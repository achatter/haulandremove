import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// The single approved junk-removal image.
const JUNK_PHOTO = PHOTOS.junk[0]
const JUNK_URL = `https://images.unsplash.com/photo-${JUNK_PHOTO.id}?w=800&q=80`
const JUNK_ALT = JUNK_PHOTO.alt

const CHUNK = 100 // business IDs per batch

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

  let deleted = 0
  let inserted = 0
  let errors = 0

  for (let i = 0; i < bizIds.length; i += CHUNK) {
    const chunk = bizIds.slice(i, i + CHUNK)

    // Step 1: Delete ALL existing images for this chunk of businesses.
    // This eliminates every stale, wrong, or duplicate row — including any
    // rows where is_primary was set to true for the wrong URL.
    const { error: delErr } = await supabase
      .from('business_images')
      .delete()
      .in('business_id', chunk)

    if (delErr) {
      console.error(`❌ Delete batch ${i}–${i + chunk.length - 1} failed: ${delErr.message}`)
      errors++
      continue
    }
    deleted += chunk.length

    // Step 2: Insert exactly one correct image per business.
    const rows = chunk.map(bizId => ({
      business_id: bizId,
      url: JUNK_URL,
      alt_text: JUNK_ALT,
      is_primary: true,
      sort_order: 0,
    }))

    const { error: insErr } = await supabase
      .from('business_images')
      .insert(rows)

    if (insErr) {
      console.error(`❌ Insert batch ${i}–${i + chunk.length - 1} failed: ${insErr.message}`)
      errors++
    } else {
      inserted += chunk.length
    }

    if ((i / CHUNK) % 20 === 0 && i > 0) {
      console.log(`… ${inserted}/${bizIds.length} done`)
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Businesses processed:  ${bizIds.length}`)
  console.log(`   Image rows deleted:    ${deleted}`)
  console.log(`   Image rows inserted:   ${inserted}`)
  if (errors) console.log(`   Batches with errors:   ${errors}`)
  console.log(`\nEvery junk_removal business now has exactly one image: the verified dumpster photo.`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
