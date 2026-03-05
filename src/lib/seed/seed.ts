import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createAdminClient } from '../supabase/admin'
import { SEED_BUSINESSES, SEED_REVIEWS } from './data'

async function seed() {
  const supabase = createAdminClient()
  console.log('🌱 Starting seed...')

  // Upsert businesses
  const businessRows = SEED_BUSINESSES.map(({ images, ...b }) => b)
  const { data: insertedBusinesses, error: bizError } = await supabase
    .from('businesses')
    .upsert(businessRows, { onConflict: 'slug' })
    .select('id, slug')

  if (bizError) {
    console.error('Error inserting businesses:', bizError)
    process.exit(1)
  }

  console.log(`✅ Upserted ${insertedBusinesses?.length ?? 0} businesses`)

  // Build slug→id map
  const slugToId = new Map(insertedBusinesses?.map((b) => [b.slug, b.id]) ?? [])

  // Upsert images
  const imageRows = SEED_BUSINESSES.flatMap(({ slug, images }) => {
    const bizId = slugToId.get(slug)
    if (!bizId) return []
    return images.map((img) => ({ ...img, business_id: bizId }))
  })

  if (imageRows.length > 0) {
    const { error: imgError } = await supabase.from('business_images').insert(imageRows)
    if (imgError && !imgError.message.includes('duplicate')) {
      console.warn('Image insert warning:', imgError.message)
    } else {
      console.log(`✅ Inserted ${imageRows.length} images`)
    }
  }

  // Upsert reviews
  const reviewRows = SEED_REVIEWS.flatMap(({ business_slug, ...r }) => {
    const bizId = slugToId.get(business_slug)
    if (!bizId) {
      console.warn(`No business found for slug: ${business_slug}`)
      return []
    }
    return [{ ...r, business_id: bizId, is_flagged: false }]
  })

  if (reviewRows.length > 0) {
    const { error: reviewError } = await supabase.from('reviews').insert(reviewRows)
    if (reviewError) {
      console.warn('Review insert warning:', reviewError.message)
    } else {
      console.log(`✅ Inserted ${reviewRows.length} reviews`)
    }
  }

  console.log('🎉 Seed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
