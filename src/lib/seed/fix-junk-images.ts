import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// The single verified junk-removal fallback image.
const JUNK_PHOTO = PHOTOS.junk[0]
const JUNK_URL = `https://images.unsplash.com/photo-${JUNK_PHOTO.id}?w=800&q=80`
const JUNK_ALT = JUNK_PHOTO.alt

// Unsplash photo IDs that are confirmed wrong for junk removal.
// Only Unsplash URLs are checked — Google Maps / website-scraped photos are
// never touched, even if they look unfamiliar.
const BAD_UNSPLASH_IDS = new Set([
  '1558618666-fcd25c85cd64', // supplement/wellness bottles — not junk removal
  '1558618047-3c8c76ca7d13', // same mismatched Outscraper batch
])

function extractUnsplashId(url: string): string | null {
  const match = url.match(/unsplash\.com\/photo-([\w-]+)/)
  return match ? match[1] : null
}

function isBadPrimary(url: string): boolean {
  const id = extractUnsplashId(url)
  if (!id) return false // non-Unsplash primaries (e.g. Google Maps) are fine
  return BAD_UNSPLASH_IDS.has(id)
}

const CHUNK = 100

async function run() {
  const supabase = createAdminClient()

  console.log('🔍 Fetching all junk_removal business IDs…')
  const bizIds: string[] = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id')
      .eq('category', 'junk_removal')
      .range(from, from + 999)
    if (error) throw new Error(`Fetch businesses: ${error.message}`)
    bizIds.push(...(data ?? []).map((r: { id: string }) => r.id))
    if (!data || data.length < 1000) break
    from += 1000
  }
  console.log(`Found ${bizIds.length} junk_removal businesses`)

  let fixed = 0
  let inserted = 0
  let alreadyGood = 0
  let errors = 0

  for (let i = 0; i < bizIds.length; i += CHUNK) {
    const chunk = bizIds.slice(i, i + CHUNK)

    // Fetch existing images for this chunk — only primary images matter here.
    const { data: images, error: imgErr } = await supabase
      .from('business_images')
      .select('id, business_id, url, is_primary, sort_order')
      .in('business_id', chunk)
      .order('sort_order', { ascending: true })

    if (imgErr) {
      console.error(`❌ Fetch images batch ${i}: ${imgErr.message}`)
      errors++
      continue
    }

    // Group by business_id
    const byBiz = new Map<string, Array<{ id: string; url: string; is_primary: boolean; sort_order: number }>>()
    for (const img of images ?? []) {
      if (!byBiz.has(img.business_id)) byBiz.set(img.business_id, [])
      byBiz.get(img.business_id)!.push(img)
    }

    const toFix: string[] = []      // business_id list — need primary replaced
    const noImages: string[] = []   // business_id list — need primary inserted

    for (const bizId of chunk) {
      const imgs = byBiz.get(bizId) ?? []
      const primary = imgs.find(img => img.is_primary)

      if (!primary) {
        // No primary image at all — insert the fallback
        noImages.push(bizId)
      } else if (isBadPrimary(primary.url)) {
        // Primary is a known bad Unsplash photo — replace it
        toFix.push(bizId)
      } else {
        alreadyGood++
      }
    }

    // Demote bad primaries (set is_primary=false so we can insert a correct one)
    if (toFix.length > 0) {
      const { error: updateErr } = await supabase
        .from('business_images')
        .update({ is_primary: false })
        .in('business_id', toFix)
        .eq('is_primary', true)

      if (updateErr) {
        console.error(`❌ Demote batch ${i}: ${updateErr.message}`)
        errors++
      } else {
        fixed += toFix.length
      }
    }

    // Insert the verified fallback as new primary for businesses that need it
    const needPrimary = [...toFix, ...noImages]
    if (needPrimary.length > 0) {
      const rows = needPrimary.map(bizId => ({
        business_id: bizId,
        url: JUNK_URL,
        alt_text: JUNK_ALT,
        is_primary: true,
        sort_order: 0,
      }))

      const { error: insErr } = await supabase
        .from('business_images')
        .upsert(rows, { onConflict: 'business_id,url' })

      if (insErr) {
        console.error(`❌ Insert fallback batch ${i}: ${insErr.message}`)
        errors++
      } else {
        inserted += needPrimary.length
      }
    }

    if ((i / CHUNK) % 20 === 0 && i > 0) {
      console.log(`… ${i}/${bizIds.length} processed`)
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Businesses scanned:          ${bizIds.length}`)
  console.log(`   Already had correct primary: ${alreadyGood}`)
  console.log(`   Bad primary replaced:        ${fixed}`)
  console.log(`   Missing primary inserted:    ${inserted}`)
  if (errors) console.log(`   Batches with errors:         ${errors}`)
  console.log(`\nSupplementary (non-primary) images were not touched.`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
