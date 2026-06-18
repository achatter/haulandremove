import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'

const CHUNK = 100
const DRY_RUN = process.env.DRY_RUN !== 'false'

async function run() {
  const supabase = createAdminClient()

  if (DRY_RUN) {
    console.log('🔍 DRY RUN — no changes will be made. Set DRY_RUN=false to apply.\n')
  } else {
    console.log('🗑️  LIVE RUN — duplicates will be deleted.\n')
  }

  // Fetch all businesses ordered oldest-first (keeper = first inserted)
  console.log('Fetching all businesses...')
  const allBizs: Array<{ id: string; name: string; phone: string | null; city: string; state: string; category: string; created_at: string }> = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, phone, city, state, category, created_at')
      .order('created_at', { ascending: true })
      .range(from, from + 999)
    if (error) throw new Error(error.message)
    allBizs.push(...(data ?? []))
    if (!data || data.length < 1000) break
    from += 1000
  }
  console.log(`  ${allBizs.length} total businesses\n`)

  // Build duplicate groups: key = phone+city+state+category (primary) or name+city+state+category (fallback)
  const seen = new Map<string, string>() // key -> keeperId
  const dupeToKeeper = new Map<string, string>() // dupeId -> keeperId

  for (const b of allBizs) {
    // Primary key: phone-based
    const phoneKey = b.phone
      ? `phone::${b.phone}::${b.city.toLowerCase()}::${b.state}::${b.category}`
      : null
    // Fallback key: name-based
    const nameKey = `name::${b.name.toLowerCase().trim()}::${b.city.toLowerCase()}::${b.state}::${b.category}`

    let isDupe = false

    if (phoneKey) {
      if (seen.has(phoneKey)) {
        dupeToKeeper.set(b.id, seen.get(phoneKey)!)
        isDupe = true
      } else {
        seen.set(phoneKey, b.id)
      }
    }

    if (!isDupe) {
      if (seen.has(nameKey)) {
        dupeToKeeper.set(b.id, seen.get(nameKey)!)
      } else {
        seen.set(nameKey, b.id)
      }
    }
  }

  const dupeIds = [...dupeToKeeper.keys()]
  console.log(`Found ${dupeIds.length} duplicate businesses to remove`)
  console.log(`Keeping ${allBizs.length - dupeIds.length} unique businesses\n`)

  if (dupeIds.length === 0) {
    console.log('No duplicates found — nothing to do.')
    return
  }

  // Step 1: For each dupe, transfer real (non-unsplash) images to the keeper
  console.log('📸 Transferring real photos from dupes to keepers...')
  let photosTransferred = 0
  let photoErrors = 0

  for (let i = 0; i < dupeIds.length; i += CHUNK) {
    const batch = dupeIds.slice(i, i + CHUNK)

    const { data: dupeImages } = await supabase
      .from('business_images')
      .select('business_id, url, alt_text, is_primary, sort_order')
      .in('business_id', batch)
      .not('url', 'like', '%unsplash%')

    if (!dupeImages || dupeImages.length === 0) continue

    for (const img of dupeImages) {
      const keeperId = dupeToKeeper.get(img.business_id)!
      if (!DRY_RUN) {
        // Demote any existing primary on the keeper first
        if (img.is_primary) {
          await supabase
            .from('business_images')
            .update({ is_primary: false, sort_order: 99 })
            .eq('business_id', keeperId)
            .eq('is_primary', true)
        }
        const { error } = await supabase
          .from('business_images')
          .upsert(
            { business_id: keeperId, url: img.url, alt_text: img.alt_text, is_primary: img.is_primary, sort_order: img.sort_order },
            { onConflict: 'business_id,url' }
          )
        if (error) photoErrors++
        else photosTransferred++
      } else {
        photosTransferred++
      }
    }
  }
  console.log(`  ${DRY_RUN ? '[DRY] Would transfer' : 'Transferred'} ${photosTransferred} real photos${photoErrors ? ` (${photoErrors} errors)` : ''}`)

  // Step 2: Transfer reviews from dupes to keepers
  console.log('\n⭐ Transferring reviews from dupes to keepers...')
  let reviewsTransferred = 0
  let reviewErrors = 0

  for (let i = 0; i < dupeIds.length; i += CHUNK) {
    const batch = dupeIds.slice(i, i + CHUNK)
    const { data: dupeReviews } = await supabase
      .from('reviews')
      .select('id, business_id')
      .in('business_id', batch)

    if (!dupeReviews || dupeReviews.length === 0) continue

    for (const review of dupeReviews) {
      const keeperId = dupeToKeeper.get(review.business_id)!
      if (!DRY_RUN) {
        const { error } = await supabase
          .from('reviews')
          .update({ business_id: keeperId })
          .eq('id', review.id)
        if (error) reviewErrors++
        else reviewsTransferred++
      } else {
        reviewsTransferred++
      }
    }
  }
  console.log(`  ${DRY_RUN ? '[DRY] Would transfer' : 'Transferred'} ${reviewsTransferred} reviews${reviewErrors ? ` (${reviewErrors} errors)` : ''}`)

  // Step 3: Delete the duplicates (CASCADE removes their images/reviews)
  console.log(`\n🗑️  ${DRY_RUN ? '[DRY] Would delete' : 'Deleting'} ${dupeIds.length} duplicate businesses...`)
  let deleted = 0
  let deleteErrors = 0

  if (!DRY_RUN) {
    for (let i = 0; i < dupeIds.length; i += CHUNK) {
      const batch = dupeIds.slice(i, i + CHUNK)
      const { error } = await supabase
        .from('businesses')
        .delete()
        .in('id', batch)
      if (error) {
        console.error(`  ❌ Delete batch ${i} failed: ${error.message}`)
        deleteErrors++
      } else {
        deleted += batch.length
      }
    }
  }

  console.log(`\n✅ Done!`)
  if (DRY_RUN) {
    console.log(`  Would delete:          ${dupeIds.length} duplicates`)
    console.log(`  Would transfer photos: ${photosTransferred}`)
    console.log(`  Would transfer reviews:${reviewsTransferred}`)
    console.log(`\nRe-run with DRY_RUN=false to apply changes.`)
  } else {
    console.log(`  Deleted:    ${deleted} duplicates`)
    console.log(`  Errors:     ${deleteErrors}`)
    console.log(`  Remaining:  ${allBizs.length - deleted} businesses`)
  }
}

run().catch(err => {
  console.error('❌', err)
  process.exit(1)
})
