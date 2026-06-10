import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// Build complete approved URL sets per category.
// Any primary image NOT matching one of these exact URLs will be replaced.
const APPROVED_JUNK_URLS = new Set(
  PHOTOS.junk.map(p => `https://images.unsplash.com/photo-${p.id}?w=800&q=80`)
)
const APPROVED_ESTATE_URLS = new Set(
  PHOTOS.estate.map(p => `https://images.unsplash.com/photo-${p.id}?w=800&q=80`)
)

// Batch sizes to stay within Supabase PostgREST limits
const BIZ_CHUNK = 100   // IDs per .in() when fetching images
const UPD_CHUNK = 100   // rows per upsert/update batch

async function fixCategory(
  supabase: ReturnType<typeof createAdminClient>,
  category: 'junk_removal' | 'estate_cleanout',
  approvedUrls: Set<string>,
  pool: { id: string; alt: string }[]
): Promise<{ updated: number; inserted: number }> {
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
  if (bizIds.length === 0) return { updated: 0, inserted: 0 }

  // 2. Scan ALL images (any domain) for each chunk to find:
  //    - bad primary images (wrong URL)
  //    - businesses with no primary image at all
  const toUpdateIds: string[] = []       // image row IDs whose URL needs fixing
  const toInsertBizIds: string[] = []    // business IDs that have no primary image at all

  for (let i = 0; i < bizIds.length; i += BIZ_CHUNK) {
    const chunk = bizIds.slice(i, i + BIZ_CHUNK)

    // Fetch ALL images for these businesses — we check every primary regardless of domain
    const { data: images, error } = await supabase
      .from('business_images')
      .select('id, business_id, url, is_primary')
      .in('business_id', chunk)
    if (error) throw new Error(`Fetch images: ${error.message}`)

    // Group by business_id
    const bizToImages = new Map<string, { id: string; url: string; is_primary: boolean }[]>()
    for (const img of (images ?? []) as { id: string; business_id: string; url: string; is_primary: boolean }[]) {
      if (!bizToImages.has(img.business_id)) bizToImages.set(img.business_id, [])
      bizToImages.get(img.business_id)!.push(img)
    }

    for (const bizId of chunk) {
      const imgs = bizToImages.get(bizId) ?? []
      const primaryImg = imgs.find(img => img.is_primary)

      if (!primaryImg) {
        // No primary image at all — need to insert one
        toInsertBizIds.push(bizId)
      } else if (!approvedUrls.has(primaryImg.url)) {
        // Primary image URL is NOT in the approved set — needs replacing
        toUpdateIds.push(primaryImg.id)
      }
    }

    if ((i / BIZ_CHUNK) % 20 === 0 && i > 0) {
      console.log(`   … scanned ${i}/${bizIds.length}: ${toUpdateIds.length} to update, ${toInsertBizIds.length} to insert`)
    }
  }

  console.log(`   Primary images to replace: ${toUpdateIds.length}`)
  console.log(`   Businesses missing primary:  ${toInsertBizIds.length}`)

  if (toUpdateIds.length === 0 && toInsertBizIds.length === 0) {
    console.log(`   ✅ All primary images are already correct`)
    return { updated: 0, inserted: 0 }
  }

  let updated = 0
  let inserted = 0

  // 3. Replace bad primary images via batched upserts (cycles through the approved pool)
  for (let i = 0; i < toUpdateIds.length; i += UPD_CHUNK) {
    const batch = toUpdateIds.slice(i, i + UPD_CHUNK)
    const upserts = batch.map((imgId, localIdx) => {
      const entry = pool[(i + localIdx) % pool.length]
      return {
        id: imgId,
        url: `https://images.unsplash.com/photo-${entry.id}?w=800&q=80`,
        alt_text: entry.alt,
      }
    })
    const { error } = await supabase
      .from('business_images')
      .upsert(upserts, { onConflict: 'id' })
    if (error) {
      console.error(`   ❌ Update batch ${i}–${i + batch.length - 1} failed: ${error.message}`)
    } else {
      updated += batch.length
      if ((i / UPD_CHUNK) % 20 === 0 && i > 0) {
        console.log(`   … updated ${updated}/${toUpdateIds.length}`)
      }
    }
  }

  // 4. Insert primary images for businesses that had none at all
  for (let i = 0; i < toInsertBizIds.length; i += UPD_CHUNK) {
    const batch = toInsertBizIds.slice(i, i + UPD_CHUNK)
    const rows = batch.map((bizId, localIdx) => {
      const entry = pool[(i + localIdx) % pool.length]
      return {
        business_id: bizId,
        url: `https://images.unsplash.com/photo-${entry.id}?w=800&q=80`,
        alt_text: entry.alt,
        is_primary: true,
        sort_order: 0,
      }
    })
    const { error } = await supabase
      .from('business_images')
      .insert(rows)
    if (error) {
      console.error(`   ❌ Insert batch ${i}–${i + batch.length - 1} failed: ${error.message}`)
    } else {
      inserted += batch.length
    }
  }

  return { updated, inserted }
}

async function run() {
  const supabase = createAdminClient()

  const junkResult  = await fixCategory(supabase, 'junk_removal',   APPROVED_JUNK_URLS,  PHOTOS.junk)
  const estateResult = await fixCategory(supabase, 'estate_cleanout', APPROVED_ESTATE_URLS, PHOTOS.estate)

  const totalUpdated  = junkResult.updated  + estateResult.updated
  const totalInserted = junkResult.inserted + estateResult.inserted

  console.log(`\n✅ Done!`)
  console.log(`   junk_removal:    ${junkResult.updated} replaced, ${junkResult.inserted} inserted`)
  console.log(`   estate_cleanout: ${estateResult.updated} replaced, ${estateResult.inserted} inserted`)
  console.log(`   Total: ${totalUpdated} replaced, ${totalInserted} inserted`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
