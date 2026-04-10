import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { createAdminClient } from '../supabase/admin'
import slugify from 'slugify'
import { Category, ServiceItem, BusinessHours } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

interface CsvRow {
  // Simple CSV format fields
  state: string
  state_code: string
  scraped_city: string
  business_name: string
  category: string
  address: string
  city: string
  state_field: string
  postal_code: string
  phone: string
  email: string
  all_emails: string
  website: string
  rating: string
  reviews: string
  latitude: string
  longitude: string
  facebook: string
  instagram: string
  linkedin: string
  youtube: string
  tiktok: string
  twitter: string
  google_maps_url: string
  // Rich CSV format fields (scraped data)
  name: string
  subtypes: string
  type: string
  street: string
  county: string
  country: string
  country_code: string
  domain: string
  company_name: string
  company_phone: string
  company_phones: string
  company_linkedin: string
  company_facebook: string
  company_instagram: string
  company_x: string
  company_youtube: string
  website_title: string
  website_description: string
  website_generator: string
  photo: string
  street_view: string
  logo: string
  located_in: string
  business_status: string
  working_hours: string
  working_hours_csv_compatible: string
  other_hours: string
  booking_appointment_link: string
  about: string
  description: string
  [key: string]: string
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
  insured: boolean
  bonded: boolean
  featured: boolean
  average_rating: number
  review_count: number
  status: 'active'
  social_media?: Record<string, string>
  services?: ServiceItem[]
  working_hours?: BusinessHours
  booking_url?: string
  attributes?: Record<string, Record<string, boolean>>
  // Private fields — stripped before DB insertion, used for image records
  _photo?: string
  _logo?: string
}

interface ImageRecord {
  business_id: string
  url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
}

// ── CSV Parser ────────────────────────────────────────────────────────────────

/**
 * Minimal RFC-4180 CSV parser — handles quoted fields with embedded commas/newlines.
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

async function readCsv(filePath: string): Promise<CsvRow[]> {
  const rows: CsvRow[] = []
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  let headers: string[] = []
  let isFirst = true
  let pending = ''

  for await (const rawLine of rl) {
    // Re-assemble multi-line quoted fields by counting unescaped quotes
    const line = pending ? pending + '\n' + rawLine : rawLine
    const quoteCount = (line.match(/"/g) || []).length
    if (quoteCount % 2 !== 0) {
      // Odd number of quotes means the field spans multiple lines
      pending = line
      continue
    }
    pending = ''

    if (isFirst) {
      headers = parseCsvLine(line).map(h => h.trim())
      isFirst = false
      continue
    }

    const values = parseCsvLine(line)
    if (values.length < 2) continue

    const row: Partial<CsvRow> = {}
    for (let i = 0; i < headers.length; i++) {
      row[headers[i]] = (values[i] ?? '').trim()
    }
    rows.push(row as CsvRow)
  }

  return rows
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function cleanPhone(raw: string): string | undefined {
  if (!raw) return undefined
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1)
  return digits.length >= 7 ? digits : undefined
}

function cleanZip(raw: string): string {
  if (!raw) return ''
  // CSV stores zip as float like "90501.0"
  const num = parseFloat(raw)
  if (isNaN(num)) return raw.slice(0, 10)
  return String(Math.round(num)).padStart(5, '0')
}

function parseSocialMedia(row: CsvRow): Record<string, string> | undefined {
  const result: Record<string, string> = {}
  // Try rich format (company_ prefix) first, then simple format
  const facebook  = row.company_facebook  || row.facebook
  const instagram = row.company_instagram || row.instagram
  const linkedin  = row.company_linkedin  || row.linkedin
  const youtube   = row.company_youtube   || row.youtube
  const tiktok    = row.tiktok
  const twitter   = row.company_x || row.twitter

  if (facebook)  result.facebook  = facebook
  if (instagram) result.instagram = instagram
  if (linkedin)  result.linkedin  = linkedin
  if (youtube)   result.youtube   = youtube
  if (tiktok)    result.tiktok    = tiktok
  if (twitter)   result.twitter   = twitter
  return Object.keys(result).length > 0 ? result : undefined
}

/**
 * Parse comma-separated subtypes string into ServiceItem array.
 * e.g. "Junk removal service, Debris removal service" → [{name: "Junk removal service"}, ...]
 */
function parseServices(subtypes: string): ServiceItem[] | undefined {
  if (!subtypes) return undefined
  const items = subtypes.split(',').map(s => s.trim()).filter(Boolean)
  if (items.length === 0) return undefined
  return items.map(name => ({ name, source: 'csv' as const }))
}

/**
 * Parse working_hours JSON from the rich CSV.
 * Input format: {"Monday": ["5:30AM-9PM"], "Tuesday": ["5:30AM-9PM"], ...}
 * Output format: {"Monday": "5:30AM-9PM", "Tuesday": "5:30AM-9PM", ...}
 */
function parseWorkingHours(raw: string): BusinessHours | undefined {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return undefined
    const hours: Record<string, string> = {}
    for (const [day, value] of Object.entries(parsed)) {
      if (Array.isArray(value) && value.length > 0) {
        hours[day] = (value as string[]).join(', ')
      } else if (typeof value === 'string' && value) {
        hours[day] = value
      }
    }
    return Object.keys(hours).length > 0 ? (hours as BusinessHours) : undefined
  } catch {
    return undefined
  }
}

/**
 * Parse the "about" column JSON into an attributes object.
 * Input format: {"Service options": {"Onsite services": true}, ...}
 * Output: same shape, with boolean values coerced.
 */
function parseAttributes(raw: string): Record<string, Record<string, boolean>> | undefined {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return undefined
    const result: Record<string, Record<string, boolean>> = {}
    for (const [cat, items] of Object.entries(parsed)) {
      if (typeof items === 'object' && items !== null) {
        result[cat] = {}
        for (const [label, value] of Object.entries(items as Record<string, unknown>)) {
          result[cat][label] = Boolean(value)
        }
      }
    }
    return Object.keys(result).length > 0 ? result : undefined
  } catch {
    return undefined
  }
}

// ── Main processing ───────────────────────────────────────────────────────────

async function processCsvFile(
  filePath: string,
  category: Category,
  seenSlugs: Map<string, number>
): Promise<ProcessedBusiness[]> {
  console.log(`\n📄 Reading ${path.basename(filePath)}…`)
  const rows = await readCsv(filePath)
  console.log(`   ${rows.length} rows found`)

  if (rows.length === 0) return []

  // Detect format: rich scraped CSV has 'name' column, simple CSV has 'business_name'
  const headers = Object.keys(rows[0])
  const isRichFormat = headers.includes('name') && !headers.includes('business_name')
  console.log(`   Format detected: ${isRichFormat ? 'rich (scraped)' : 'simple'}`)

  const businesses: ProcessedBusiness[] = []
  let skipped = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    const name = (isRichFormat ? row.name : row.business_name)?.trim()
    if (!name) { skipped++; continue }

    // Use the actual business city, fall back to scraped_city (simple format only)
    const city = (row.city?.trim() || (!isRichFormat ? row.scraped_city?.trim() : ''))
    if (!city) { skipped++; continue }

    // state_code = abbreviation (e.g. "TX"), state = full name (e.g. "Texas")
    const state = row.state_code?.trim().toUpperCase()
    // Rich CSV: 'state' = full name. Simple CSV: 'state_field' or 'state'
    const state_full = (row.state_field?.trim() || row.state?.trim())
    if (!state || !state_full) { skipped++; continue }

    const zip_code = cleanZip(row.postal_code)

    // Build slug, deduplicating with counter suffix
    const baseSlug = slugify(`${name} ${city} ${state}`, { lower: true, strict: true })
    const count = seenSlugs.get(baseSlug) ?? 0
    seenSlugs.set(baseSlug, count + 1)
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`

    const average_rating = parseFloat(row.rating) || 0
    const review_count   = parseInt(row.reviews, 10) || 0

    // Street address: both formats use 'address'; rich format also has 'street'
    const street_address = (row.address?.trim() || (isRichFormat ? row.street?.trim() : '')) || undefined

    // Phone: prefer the listing-level phone, fall back to company_phone
    const phone = cleanPhone(row.phone || row.company_phone)

    // Description: prefer 'description' column, fall back to 'website_description'
    const description = (row.description?.trim() || row.website_description?.trim()) || undefined

    businesses.push({
      name,
      slug,
      category,
      description,
      phone,
      email:         row.email?.trim() || undefined,
      website:       row.website?.trim() || undefined,
      street_address,
      city,
      state,
      state_full,
      zip_code,
      insured:       false,
      bonded:        false,
      featured:      false,
      average_rating,
      review_count,
      status:        'active',
      social_media:  parseSocialMedia(row),
      // Rich format only fields:
      services:      isRichFormat ? parseServices(row.subtypes) : undefined,
      working_hours: isRichFormat ? parseWorkingHours(row.working_hours) : undefined,
      booking_url:   isRichFormat ? (row.booking_appointment_link?.trim() || undefined) : undefined,
      attributes:    isRichFormat ? parseAttributes(row.about) : undefined,
      _photo:        isRichFormat ? (row.photo?.trim() || undefined) : undefined,
      _logo:         isRichFormat ? (row.logo?.trim() || undefined) : undefined,
    })
  }

  console.log(`   ✅ ${businesses.length} valid businesses (${skipped} skipped)`)
  return businesses
}

async function insertInBatches(
  supabase: ReturnType<typeof createAdminClient>,
  businesses: ProcessedBusiness[],
  batchSize = 200
): Promise<{ inserted: number; imageRecords: ImageRecord[] }> {
  let inserted = 0
  const imageRecords: ImageRecord[] = []

  for (let start = 0; start < businesses.length; start += batchSize) {
    const batch = businesses.slice(start, start + batchSize)

    // Strip private _photo/_logo fields — they're not DB columns
    const batchData = batch.map(({ _photo: _p, _logo: _l, ...business }) => business)

    const { data, error } = await supabase
      .from('businesses')
      .insert(batchData)
      .select('id')

    if (error) {
      console.error(`   ❌ Batch ${start}–${start + batch.length - 1} failed:`, error.message)
      // Continue with next batch rather than aborting everything
    } else {
      inserted += data?.length ?? 0

      // Match returned IDs (in insertion order) to their photo/logo URLs
      if (data) {
        data.forEach((row, idx) => {
          const biz = batch[idx]
          if (biz._photo) {
            imageRecords.push({
              business_id: row.id,
              url: biz._photo,
              alt_text: `${biz.name} - photo`,
              is_primary: true,
              sort_order: 0,
            })
          }
          if (biz._logo) {
            imageRecords.push({
              business_id: row.id,
              url: biz._logo,
              alt_text: `${biz.name} - logo`,
              is_primary: biz._photo ? false : true,
              sort_order: biz._photo ? 1 : 0,
            })
          }
        })
      }
    }

    if ((start / batchSize) % 10 === 0) {
      console.log(`   … inserted ${inserted} so far`)
    }
  }
  return { inserted, imageRecords }
}

async function insertImages(
  supabase: ReturnType<typeof createAdminClient>,
  imageRecords: ImageRecord[],
  batchSize = 200
): Promise<number> {
  let inserted = 0
  for (let start = 0; start < imageRecords.length; start += batchSize) {
    const batch = imageRecords.slice(start, start + batchSize)
    const { data, error } = await supabase
      .from('business_images')
      .insert(batch)
      .select('id')

    if (error) {
      console.error(`   ❌ Image batch ${start}–${start + batch.length - 1} failed:`, error.message)
    } else {
      inserted += data?.length ?? 0
    }
  }
  return inserted
}

// ── Entry point ───────────────────────────────────────────────────────────────

function findCsvFile(projectRoot: string, candidates: string[]): string | null {
  for (const name of candidates) {
    const filePath = path.join(projectRoot, name)
    if (fs.existsSync(filePath)) return filePath
  }
  return null
}

async function run() {
  const projectRoot = path.resolve(__dirname, '../../../')

  // Find CSV files — try scraped ("Small") files first, then plain cleaned files
  const junkFile   = findCsvFile(projectRoot, [
    'Junk_Removal_Cleaned_Small.csv',
    'Junk_Removal_Cleaned.csv',
    'Junk_Hauling_Cleaned.csv',
  ])
  const estateFile = findCsvFile(projectRoot, [
    'Estate_Cleanout_Cleaned_Small.csv',
    'Estate_Cleanout_Cleaned.csv',
  ])

  if (!junkFile && !estateFile) {
    console.error('❌ No CSV files found. Expected one of:')
    console.error('   Junk_Removal_Cleaned_Small.csv, Junk_Removal_Cleaned.csv, Junk_Hauling_Cleaned.csv')
    console.error('   Estate_Cleanout_Cleaned_Small.csv, Estate_Cleanout_Cleaned.csv')
    process.exit(1)
  }

  if (junkFile)   console.log(`\n✅ Junk CSV:   ${path.basename(junkFile)}`)
  else             console.warn('\n⚠️  No junk removal CSV found — skipping')
  if (estateFile) console.log(`✅ Estate CSV: ${path.basename(estateFile)}`)
  else             console.warn('⚠️  No estate cleanout CSV found — skipping')

  const supabase = createAdminClient()

  // ── Step 1: Clear existing data ───────────────────────────────────────────
  console.log('\n🧹 Step 1: Clearing existing data…')

  const { error: revErr } = await supabase
    .from('reviews')
    .delete()
    .gt('created_at', '1970-01-01')
  if (revErr) { console.error('❌ Error deleting reviews:', revErr.message); process.exit(1) }
  console.log('   ✅ Reviews cleared')

  const { error: imgErr } = await supabase
    .from('business_images')
    .delete()
    .gt('created_at', '1970-01-01')
  if (imgErr) { console.error('❌ Error deleting images:', imgErr.message); process.exit(1) }
  console.log('   ✅ Business images cleared')

  const { error: bizErr } = await supabase
    .from('businesses')
    .delete()
    .gt('created_at', '1970-01-01')
  if (bizErr) { console.error('❌ Error deleting businesses:', bizErr.message); process.exit(1) }
  console.log('   ✅ Businesses cleared')

  // ── Step 2: Parse CSV files ───────────────────────────────────────────────
  console.log('\n📂 Step 2: Parsing CSV files…')
  const seenSlugs = new Map<string, number>()

  const junkBusinesses   = junkFile
    ? await processCsvFile(junkFile,   'junk_removal',   seenSlugs)
    : []
  const estateBusinesses = estateFile
    ? await processCsvFile(estateFile, 'estate_cleanout', seenSlugs)
    : []

  console.log(`\n   Total to insert: ${junkBusinesses.length + estateBusinesses.length}`)

  // ── Step 3: Insert businesses in batches ──────────────────────────────────
  console.log('\n💾 Step 3: Inserting businesses into Supabase…')
  const allImageRecords: ImageRecord[] = []

  if (junkBusinesses.length > 0) {
    console.log('   Inserting junk removal businesses…')
    const { inserted, imageRecords } = await insertInBatches(supabase, junkBusinesses)
    console.log(`   ✅ Junk removal: ${inserted} inserted, ${imageRecords.length} images queued`)
    allImageRecords.push(...imageRecords)
  }

  if (estateBusinesses.length > 0) {
    console.log('   Inserting estate cleanout businesses…')
    const { inserted, imageRecords } = await insertInBatches(supabase, estateBusinesses)
    console.log(`   ✅ Estate cleanout: ${inserted} inserted, ${imageRecords.length} images queued`)
    allImageRecords.push(...imageRecords)
  }

  // ── Step 4: Insert business images ───────────────────────────────────────
  if (allImageRecords.length > 0) {
    console.log(`\n🖼️  Step 4: Inserting ${allImageRecords.length} business images…`)
    const imagesInserted = await insertImages(supabase, allImageRecords)
    console.log(`   ✅ Images inserted: ${imagesInserted}`)
  } else {
    console.log('\n🖼️  Step 4: No images to insert')
  }

  const totalBusinesses = junkBusinesses.length + estateBusinesses.length
  console.log(`\n🎉 Done! Total businesses: ${totalBusinesses}, images: ${allImageRecords.length}`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
