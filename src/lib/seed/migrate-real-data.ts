import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { cleanup } from './cleanup'
import { importRealData } from './import-real-data'

/**
 * Complete migration from test data to real data
 * 1. Cleans all existing test data
 * 2. Imports real data from Excel file
 */
async function migrateToRealData(excelFilePath: string) {
  console.log('🚀 Starting complete data migration to real data...')
  console.log(`📄 Excel file: ${excelFilePath}`)
  
  try {
    // Step 1: Clean existing data
    console.log('\n📋 Step 1: Cleaning existing test data...')
    await cleanup()
    
    // Step 2: Import real data
    console.log('\n📋 Step 2: Importing real data from Excel...')
    await importRealData(excelFilePath)
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('✅ Test data has been removed')
    console.log('✅ Real data has been imported')
    console.log('\n📊 Next steps:')
    console.log('  - Review the imported data in your Supabase dashboard')
    console.log('  - Test the application to ensure everything works correctly')
    console.log('  - Consider adding images for the imported businesses')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    console.error('\n🔄 Your database state may be inconsistent.')
    console.error('   Consider running the cleanup script and trying again.')
    throw error
  }
}

// Run migration if called directly
if (require.main === module) {
  const excelFile = process.argv[2]
  if (!excelFile) {
    console.error('❌ Please provide path to Excel file')
    console.log('Usage: npm run migrate-data path/to/file.xlsx')
    console.log('Example: npm run migrate-data ./data/Junk_Removal_Cleaned_Small.xlsx')
    process.exit(1)
  }

  migrateToRealData(excelFile).catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
}

export { migrateToRealData }