import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// Any Unsplash photo ID NOT in these sets is considered stale and will be replaced.
// Only add IDs after visually confirming the actual photo content on Unsplash.
const APPROVED_JUNK_IDS = new Set(PHOTOS.junk.map(p => p.id))
const APPROVED_ESTATE_IDS = new Set(PHOTOS.estate.map(p => p.id))

const UNSPLASH_PHOTO_RE = /photo-([a-z0-9-]+)\?/i

// Batch sizes to stay within Supabase PostgREST limits
const BIZ_CHUNK = 500   // IDs per .in() when fetching images
const UPD_CHUNK = 100   // rows per upsert batch

async function fixCategory(
  supabase: ReturnType<typeof createAdminClient>,
  category: 'junk_removal' | 'estate_cleanout',
  approvedIds: Set<string>,
  pool: { id: string; alt: string }[]
): Promise<number> {
  console.log(`\n🔍 Scanning ${category} businesses…`)

  // 1. Collect all business IDs for this category (paginated)
  const bizIds: string[] = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id')
      .eq('category', category)
      .range(from, from + 999)
    if (error) throw new Error(`Fetch businesses: ${error.message}`)
    bizIds.push(...(data ?? []).map((r: { id: string }) => r.id))
    if (!data || data.length < 1000) break
    from += 1000
  }
  console.log(`   Found ${bizIds.length} businesses`)
  if (bizIds.length === 0) return 0

  // 2. Fetch all Unsplash image rows in chunks (avoids giant .in() clause)
  const stale: { id: string; url: string }[] = []
  for (let i = 0; i < bizIds.length; i += BIZ_CHUNK) {
    const chunk = bizIds.slice(i, i + BIZ_CHUNK)
    const { data: imgs, error: imgErr } = await supabase
      .from('business_images')
      .select('id, url')
      .in('business_id', chunk)
      .ilike('url', '%images.unsplash.com%')
    if (imgErr) throw new Error(`Fetch images: ${imgErr.message}`)
    for (const row of imgs ?? []) {
      const m = (row.url as string).match(UNSPLASH_PHOTO_RE)
      if (m && !approvedIds.has(m[1])) {
        stale.push({ id: row.id, url: row.url })
      }
    }
    if ((i / BIZ_CHUNK) % 4 === 0 && i > 0) {
      console.log(`   … scanned ${i}/${bizIds.length} businesses, ${stale.length} stale so far`)
    }
  }

  console.log(`   Stale images to replace: ${stale.length}`)
  if (stale.length === 0) return 0

  // 3. Replace stale images via batched upserts (cycles through the approved pool)
  let fixed = 0
  for (let i = 0; i < stale.length; i += UPD_CHUNK) {
    const batchRows = stale.slice(i, i + UPD_CHUNK)
    const upserts = batchRows.map((row, localIdx) => {
      const poolEntry = pool[(i + localIdx) % pool.length]
      return {
        id: row.id,
        url: `https://images.unsplash.com/photo-${poolEntry.id}?w=800&q=80`,
        alt_text: poolEntry.alt,
      }
    })

    const { error } = await supabase
      .from('business_images')
      .upsert(upserts, { onConflict: 'id' })

    if (error) {
      console.error(`   ❌ Upsert batch ${i}–${i + batchRows.length - 1} failed: ${error.message}`)
    } else {
      fixed += batchRows.length
    }

    if ((i / UPD_CHUNK) % 20 === 0 && i > 0) {
      console.log(`   … fixed ${fixed}/${stale.length}`)
    }
  }

  return fixed
}

async function run() {
  const supabase = createAdminClient()

  const junkFixed  = await fixCategory(supabase, 'junk_removal',   APPROVED_JUNK_IDS,   PHOTOS.junk)
  const estateFixed = await fixCategory(supabase, 'estate_cleanout', APPROVED_ESTATE_IDS, PHOTOS.estate)

  const total = junkFixed + estateFixed
  console.log(`\n✅ Done — fixed ${total} stale image(s) (${junkFixed} junk_removal, ${estateFixed} estate_cleanout)`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
