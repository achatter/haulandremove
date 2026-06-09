import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// The full set of approved Unsplash photo IDs for each category.
// Any image whose URL contains an Unsplash photo ID NOT in these sets
// is considered stale/wrong and will be replaced.
const APPROVED_JUNK_IDS = new Set(PHOTOS.junk.map(p => p.id))
const APPROVED_ESTATE_IDS = new Set(PHOTOS.estate.map(p => p.id))

// Regex to extract the Unsplash photo ID from a URL like:
// https://images.unsplash.com/photo-<ID>?w=800&q=80
const UNSPLASH_PHOTO_RE = /photo-([a-z0-9-]+)\?/i

async function run() {
  const supabase = createAdminClient()
  let totalFixed = 0

  // ── Junk removal ────────────────────────────────────────────────────────────
  console.log('\n🔍 Scanning junk_removal business images for stale Unsplash photos…')

  // Fetch all junk_removal business IDs
  const { data: junkBizRows, error: bizErr } = await supabase
    .from('businesses')
    .select('id')
    .eq('category', 'junk_removal')

  if (bizErr) {
    console.error('❌ Error fetching junk businesses:', bizErr.message)
    process.exit(1)
  }

  const junkBizIds = (junkBizRows ?? []).map(r => r.id)
  console.log(`   Found ${junkBizIds.length} junk_removal businesses`)

  if (junkBizIds.length > 0) {
    // Fetch all images for those businesses that are Unsplash URLs
    const { data: imageRows, error: imgErr } = await supabase
      .from('business_images')
      .select('id, url, business_id, is_primary')
      .in('business_id', junkBizIds)
      .ilike('url', '%images.unsplash.com%')

    if (imgErr) {
      console.error('❌ Error fetching junk images:', imgErr.message)
      process.exit(1)
    }

    const stale = (imageRows ?? []).filter(row => {
      const m = row.url.match(UNSPLASH_PHOTO_RE)
      return m ? !APPROVED_JUNK_IDS.has(m[1]) : false
    })

    console.log(`   Stale images found: ${stale.length}`)

    for (let i = 0; i < stale.length; i++) {
      const row = stale[i]
      const poolEntry = PHOTOS.junk[i % PHOTOS.junk.length]
      const newUrl = `https://images.unsplash.com/photo-${poolEntry.id}?w=800&q=80`

      const { error: updateErr } = await supabase
        .from('business_images')
        .update({ url: newUrl, alt_text: poolEntry.alt })
        .eq('id', row.id)

      if (updateErr) {
        console.error(`   ❌ Failed to update image ${row.id}:`, updateErr.message)
      } else {
        const oldId = row.url.match(UNSPLASH_PHOTO_RE)?.[1] ?? '?'
        console.log(`   ✅ Replaced ${oldId} → ${poolEntry.id}`)
        totalFixed++
      }
    }
  }

  // ── Estate cleanout ─────────────────────────────────────────────────────────
  console.log('\n🔍 Scanning estate_cleanout business images for stale Unsplash photos…')

  const { data: estateBizRows, error: estateBizErr } = await supabase
    .from('businesses')
    .select('id')
    .eq('category', 'estate_cleanout')

  if (estateBizErr) {
    console.error('❌ Error fetching estate businesses:', estateBizErr.message)
    process.exit(1)
  }

  const estateBizIds = (estateBizRows ?? []).map(r => r.id)
  console.log(`   Found ${estateBizIds.length} estate_cleanout businesses`)

  if (estateBizIds.length > 0) {
    const { data: estateImageRows, error: estateImgErr } = await supabase
      .from('business_images')
      .select('id, url, business_id, is_primary')
      .in('business_id', estateBizIds)
      .ilike('url', '%images.unsplash.com%')

    if (estateImgErr) {
      console.error('❌ Error fetching estate images:', estateImgErr.message)
      process.exit(1)
    }

    const stale = (estateImageRows ?? []).filter(row => {
      const m = row.url.match(UNSPLASH_PHOTO_RE)
      return m ? !APPROVED_ESTATE_IDS.has(m[1]) : false
    })

    console.log(`   Stale images found: ${stale.length}`)

    for (let i = 0; i < stale.length; i++) {
      const row = stale[i]
      const poolEntry = PHOTOS.estate[i % PHOTOS.estate.length]
      const newUrl = `https://images.unsplash.com/photo-${poolEntry.id}?w=800&q=80`

      const { error: updateErr } = await supabase
        .from('business_images')
        .update({ url: newUrl, alt_text: poolEntry.alt })
        .eq('id', row.id)

      if (updateErr) {
        console.error(`   ❌ Failed to update image ${row.id}:`, updateErr.message)
      } else {
        const oldId = row.url.match(UNSPLASH_PHOTO_RE)?.[1] ?? '?'
        console.log(`   ✅ Replaced ${oldId} → ${poolEntry.id}`)
        totalFixed++
      }
    }
  }

  console.log(`\n✅ Done — fixed ${totalFixed} stale images`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
