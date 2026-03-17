import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import * as XLSX from 'xlsx'
import { createAdminClient } from '../supabase/admin'
import slugify from 'slugify'
import { Category } from '@/types'

interface ExcelRowData {
  [key: string]: any
}

interface ProcessedBusiness {
  name: string
  slug: string
  category: Category
  description?: string
  phone?: string
  email?: string
  website?: string
  street_address?: string
  city: string
  state: string
  state_full: string
  zip_code: string
  years_in_business?: number
  insured: boolean
  bonded: boolean
  featured: boolean
  average_rating: number
  review_count: number
  status: 'active'
}

// US state abbreviations to full names mapping
const STATE_MAPPING: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
}

/**
 * Parses Excel file and converts to business data
 * Handles various possible column name variations
 */
function parseExcelFile(filePath: string): ProcessedBusiness[] {
  console.log(`📄 Reading Excel file: ${filePath}`)
  
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const jsonData: ExcelRowData[] = XLSX.utils.sheet_to_json(worksheet)

  console.log(`📊 Found ${jsonData.length} rows in Excel file`)

  const businesses: ProcessedBusiness[] = []

  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i]
    
    try {
      // Extract business name (try various column name possibilities)
      const name = getFieldValue(row, ['name', 'business_name', 'company_name', 'business', 'company'])
      if (!name) {
        console.warn(`⚠️  Row ${i + 1}: No business name found, skipping`)
        continue
      }

      // Extract city
      const city = getFieldValue(row, ['city', 'location', 'town'])
      if (!city) {
        console.warn(`⚠️  Row ${i + 1}: No city found for ${name}, skipping`)
        continue
      }

      // Extract state
      const stateRaw = getFieldValue(row, ['state', 'st', 'province'])
      if (!stateRaw) {
        console.warn(`⚠️  Row ${i + 1}: No state found for ${name}, skipping`)
        continue
      }

      // Normalize state (handle both abbreviations and full names)
      const stateUpper = stateRaw.toString().toUpperCase().trim()
      let state: string
      let state_full: string

      if (stateUpper.length === 2 && STATE_MAPPING[stateUpper]) {
        state = stateUpper
        state_full = STATE_MAPPING[stateUpper]
      } else {
        // Try to find by full name
        const foundAbbrev = Object.keys(STATE_MAPPING).find(
          abbrev => STATE_MAPPING[abbrev].toUpperCase() === stateUpper
        )
        if (foundAbbrev) {
          state = foundAbbrev
          state_full = STATE_MAPPING[foundAbbrev]
        } else {
          console.warn(`⚠️  Row ${i + 1}: Invalid state '${stateRaw}' for ${name}, skipping`)
          continue
        }
      }

      // Extract zip code
      const zip_code = getFieldValue(row, ['zip', 'zip_code', 'zipcode', 'postal_code', 'postcode'])?.toString() || ''

      // Create slug
      const slug = slugify(`${name} ${city} ${state}`, { lower: true, strict: true })

      // Extract other fields with defaults
      const business: ProcessedBusiness = {
        name: name.toString().trim(),
        slug,
        category: 'junk_removal', // Default to junk_removal since file is for junk removal data
        description: getFieldValue(row, ['description', 'about', 'details', 'services']),
        phone: cleanPhone(getFieldValue(row, ['phone', 'telephone', 'phone_number', 'tel'])),
        email: getFieldValue(row, ['email', 'email_address', 'contact_email']),
        website: getFieldValue(row, ['website', 'url', 'web', 'site']),
        street_address: getFieldValue(row, ['address', 'street_address', 'street', 'addr']),
        city: city.toString().trim(),
        state,
        state_full,
        zip_code: zip_code.trim(),
        years_in_business: parseInt(getFieldValue(row, ['years_in_business', 'years', 'experience', 'years_experience']) || '0') || undefined,
        insured: parseBooleanField(getFieldValue(row, ['insured', 'insurance', 'is_insured'])),
        bonded: parseBooleanField(getFieldValue(row, ['bonded', 'bond', 'is_bonded'])),
        featured: false, // Default to false for imported data
        average_rating: 0, // Will be updated when reviews are added
        review_count: 0,   // Will be updated when reviews are added
        status: 'active'
      }

      businesses.push(business)
    } catch (error) {
      console.error(`❌ Error processing row ${i + 1}:`, error)
      console.error('Row data:', row)
    }
  }

  console.log(`✅ Successfully processed ${businesses.length} businesses`)
  return businesses
}

/**
 * Helper function to get field value from row with multiple possible column names
 */
function getFieldValue(row: ExcelRowData, possibleNames: string[]): any {
  for (const name of possibleNames) {
    // Check exact match
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return row[name]
    }
    
    // Check case-insensitive match
    const lowerName = name.toLowerCase()
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase() === lowerName && value !== undefined && value !== null && value !== '') {
        return value
      }
    }
  }
  return null
}

/**
 * Clean and format phone numbers
 */
function cleanPhone(phone: any): string | undefined {
  if (!phone) return undefined
  
  // Remove all non-digits
  const cleaned = phone.toString().replace(/\D/g, '')
  
  // Return formatted phone if it's a valid length
  if (cleaned.length === 10) {
    return cleaned
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1)
  }
  
  return cleaned.length > 0 ? cleaned : undefined
}

/**
 * Parse boolean fields from various possible values
 */
function parseBooleanField(value: any): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return ['yes', 'true', '1', 'y', 'on'].includes(lower)
  }
  if (typeof value === 'number') {
    return value > 0
  }
  return false
}

/**
 * Import real data from Excel file
 */
async function importRealData(excelFilePath: string) {
  console.log('📊 Starting real data import...')

  try {
    // Parse Excel file
    const businesses = parseExcelFile(excelFilePath)
    
    if (businesses.length === 0) {
      console.error('❌ No valid businesses found in Excel file')
      return
    }

    // Connect to Supabase
    const supabase = createAdminClient()

    // Insert businesses
    const { data: insertedBusinesses, error: bizError } = await supabase
      .from('businesses')
      .insert(businesses)
      .select('id, slug')

    if (bizError) {
      console.error('❌ Error inserting businesses:', bizError)
      throw bizError
    }

    console.log(`✅ Inserted ${insertedBusinesses?.length ?? 0} businesses into database`)

    // TODO: Add default images for imported businesses
    // This could be enhanced to include stock images or placeholder images
    
    console.log('🎉 Real data import complete!')
  } catch (error) {
    console.error('❌ Import failed:', error)
    throw error
  }
}

// Run import if called directly
if (require.main === module) {
  const excelFile = process.argv[2]
  if (!excelFile) {
    console.error('❌ Please provide path to Excel file')
    console.log('Usage: npm run import-data path/to/file.xlsx')
    process.exit(1)
  }

  importRealData(excelFile).catch((err) => {
    console.error('Import failed:', err)
    process.exit(1)
  })
}

export { importRealData }