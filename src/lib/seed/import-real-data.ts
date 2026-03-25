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
  booking_url?: string
  working_hours?: Record<string, string | null>
  social_media?: Record<string, string>
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * Parses working_hours JSON string from Outscraper format:
 * {"Monday": ["5:30AM-9PM"], "Tuesday": ["5:30AM-9PM"], ...}
 * into flat object: { "Monday": "5:30AM-9PM", "Tuesday": "5:30AM-9PM", ... }
 */
function parseWorkingHours(raw: any): Record<string, string | null> | undefined {
  if (!raw) return undefined
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
    const result: Record<string, string | null> = {}
    for (const day of DAYS) {
      const val = parsed[day]
      result[day] = Array.isArray(val) && val.length > 0 ? String(val[0]) : null
    }
    return result
  } catch {
    return undefined
  }
}

/**
 * Extracts social media links from row columns
 */
function parseSocialMedia(row: ExcelRowData): Record<string, string> | undefined {
  const facebook  = getFieldValue(row, ['company_facebook'])
  const instagram = getFieldValue(row, ['company_instagram'])
  const linkedin  = getFieldValue(row, ['company_linkedin'])
  const youtube   = getFieldValue(row, ['company_youtube'])

  const result: Record<string, string> = {}
  if (facebook)  result.facebook  = String(facebook)
  if (instagram) result.instagram = String(instagram)
  if (linkedin)  result.linkedin  = String(linkedin)
  if (youtube)   result.youtube   = String(youtube)

  return Object.keys(result).length > 0 ? result : undefined
}

/**
 * Parses Excel file and converts to business data.
 * Returns both processed businesses and raw rows (aligned by index) for photo extraction.
 */
function parseExcelFile(filePath: string): { businesses: ProcessedBusiness[]; rawRows: ExcelRowData[] } {
  console.log(`📄 Reading Excel file: ${filePath}`)

  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const jsonData: ExcelRowData[] = XLSX.utils.sheet_to_json(worksheet)

  console.log(`📊 Found ${jsonData.length} rows in Excel file`)

  const businesses: ProcessedBusiness[] = []
  const rawRows: ExcelRowData[] = []
  const seenSlugs = new Map<string, number>()

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
      const stateRaw = getFieldValue(row, ['state', 'state_code', 'st', 'province'])
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
      const zip_code = getFieldValue(row, ['zip', 'postal_code', 'zip_code', 'zipcode', 'postcode'])?.toString() || ''

      // Create slug, deduplicating with a counter suffix if needed
      const baseSlug = slugify(`${name} ${city} ${state}`, { lower: true, strict: true })
      const count = seenSlugs.get(baseSlug) ?? 0
      seenSlugs.set(baseSlug, count + 1)
      const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`

      // Build description: prefer 'about' column (richer), fall back to 'description'
      const about       = getFieldValue(row, ['about'])
      const description = getFieldValue(row, ['description', 'details', 'services'])
      const combinedDescription = about
        ? String(about)
        : description
          ? String(description)
          : undefined

      // Extract ratings directly from CSV
      const ratingRaw      = getFieldValue(row, ['rating'])
      const reviewCountRaw = getFieldValue(row, ['reviews'])
      const average_rating = ratingRaw      ? parseFloat(String(ratingRaw))      || 0 : 0
      const review_count   = reviewCountRaw ? parseInt(String(reviewCountRaw), 10) || 0 : 0

      const business: ProcessedBusiness = {
        name: name.toString().trim(),
        slug,
        category: 'junk_removal',
        description: combinedDescription,
        phone: cleanPhone(getFieldValue(row, ['phone', 'telephone', 'phone_number', 'tel'])),
        email: getFieldValue(row, ['email', 'email_address', 'contact_email']),
        website: getFieldValue(row, ['website', 'url', 'web', 'site']),
        street_address: getFieldValue(row, ['street', 'address', 'street_address', 'addr']),
        city: city.toString().trim(),
        state,
        state_full,
        zip_code: zip_code.trim(),
        years_in_business: parseInt(getFieldValue(row, ['years_in_business', 'years', 'experience', 'years_experience']) || '0') || undefined,
        insured: parseBooleanField(getFieldValue(row, ['insured', 'insurance', 'is_insured'])),
        bonded: parseBooleanField(getFieldValue(row, ['bonded', 'bond', 'is_bonded'])),
        featured: false,
        average_rating,
        review_count,
        status: 'active',
        booking_url:   getFieldValue(row, ['booking_appointment_link']) || undefined,
        working_hours: parseWorkingHours(getFieldValue(row, ['working_hours'])),
        social_media:  parseSocialMedia(row),
      }

      businesses.push(business)
      rawRows.push(row)
    } catch (error) {
      console.error(`❌ Error processing row ${i + 1}:`, error)
      console.error('Row data:', row)
    }
  }

  console.log(`✅ Successfully processed ${businesses.length} businesses`)
  return { businesses, rawRows }
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
    const { businesses, rawRows } = parseExcelFile(excelFilePath)

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
      .select('id, slug, name')

    if (bizError) {
      console.error('❌ Error inserting businesses:', bizError)
      throw bizError
    }

    console.log(`✅ Inserted ${insertedBusinesses?.length ?? 0} businesses into database`)

    // Insert primary photos from CSV 'photo' column into business_images
    if (insertedBusinesses && insertedBusinesses.length > 0) {
      const imageRows = insertedBusinesses
        .map((biz, i) => {
          const photoUrl = getFieldValue(rawRows[i], ['photo'])
          if (!photoUrl || typeof photoUrl !== 'string' || !photoUrl.startsWith('http')) return null
          return {
            business_id: biz.id,
            url: String(photoUrl),
            alt_text: `${biz.name} photo`,
            is_primary: true,
            sort_order: 0,
          }
        })
        .filter(Boolean)

      if (imageRows.length > 0) {
        const { error: imgError } = await supabase
          .from('business_images')
          .insert(imageRows)

        if (imgError) {
          console.warn('⚠️  Error inserting images:', imgError.message)
        } else {
          console.log(`✅ Inserted ${imageRows.length} primary photos`)
        }
      } else {
        console.log('ℹ️  No photo URLs found in CSV')
      }
    }

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
