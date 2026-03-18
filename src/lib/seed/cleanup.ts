import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createAdminClient } from '../supabase/admin'

/**
 * Clears all test data from the database tables
 * This will remove all businesses, business_images, and reviews
 */
async function cleanup() {
  const supabase = createAdminClient()
  console.log('🧹 Starting database cleanup...')

  try {
    // Delete reviews first (has foreign key to businesses)
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .gt('created_at', '1970-01-01') // This deletes all records

    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError)
      throw reviewsError
    }
    console.log('✅ Deleted all reviews')

    // Delete business images (has foreign key to businesses)
    const { error: imagesError } = await supabase
      .from('business_images')
      .delete()
      .gt('created_at', '1970-01-01')

    if (imagesError) {
      console.error('Error deleting business images:', imagesError)
      throw imagesError
    }
    console.log('✅ Deleted all business images')

    // Delete businesses last
    const { error: businessError } = await supabase
      .from('businesses')
      .delete()
      .gt('created_at', '1970-01-01')

    if (businessError) {
      console.error('Error deleting businesses:', businessError)
      throw businessError
    }
    console.log('✅ Deleted all businesses')

    console.log('🎉 Database cleanup complete!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanup().catch((err) => {
    console.error('Cleanup failed:', err)
    process.exit(1)
  })
}

export { cleanup }