import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// Photo IDs confirmed to show incorrect content (wellness bottles, not junk removal)
const BAD_PHOTO_IDS = [
  '1558618666-fcd25c85cd64',
  '1558618047-3c8c76ca7d13',
]

async function run() {
  const supabase = createAdminClient()
  let totalFixed = 0

  for (const badId of BAD_PHOTO_IDS) {
    const { data: rows, error: fetchErr } = await supabase
      .from('business_images')
      .select('id')
      .ilike('url', `%photo-${badId}%`)

    if (fetchErr) {
      console.error(`Error fetching images for ${badId}:`, fetchErr.message)
      continue
    }

    const count = rows?.length ?? 0
    console.log(`Found ${count} images with bad photo ID: ${badId}`)

    if (count === 0) continue

    for (let i = 0; i < rows!.length; i++) {
      const poolEntry = PHOTOS.junk[i % PHOTOS.junk.length]
      const newUrl = `https://images.unsplash.com/photo-${poolEntry.id}?w=800&q=80`

      const { error: updateErr } = await supabase
        .from('business_images')
        .update({ url: newUrl, alt_text: poolEntry.alt })
        .eq('id', rows![i].id)

      if (updateErr) {
        console.error(`Error updating image ${rows![i].id}:`, updateErr.message)
      } else {
        totalFixed++
        console.log(`  ✅ Replaced ${badId} with ${poolEntry.id}`)
      }
    }
  }

  console.log(`\n✅ Done — fixed ${totalFixed} images`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
