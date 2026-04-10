import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { createAdminClient } from '../supabase/admin'
import slugify from 'slugify'
import { Category } from '@/types'

// ── Types ────────────────────────────────────────────────────────────────────

interface CsvRow {
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
  [key: string]: string
}

interface ProcessedBusiness {
  name: string
  slug: string
  category: Category
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
  if (row.facebook)  result.facebook  = row.facebook
  if (row.instagram) result.instagram = row.instagram
  if (row.linkedin)  result.linkedin  = row.linkedin
  if (row.youtube)   result.youtube   = row.youtube
  if (row.tiktok)    result.tiktok    = row.tiktok
  if (row.twitter)   result.twitter   = row.twitter
  return Object.keys(result).length > 0 ? result : undefined
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

  const businesses: ProcessedBusiness[] = []
  let skipped = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    const name = row.business_name?.trim()
    if (!name) { skipped++; continue }

    // Use the actual business city, fall back to scraped_city
    const city = (row.city?.trim() || row.scraped_city?.trim())
    if (!city) { skipped++; continue }

    // State: state_code = abbreviation (e.g. "CA"), state = full name (e.g. "California")
    const state = row.state_code?.trim().toUpperCase()
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

    businesses.push({
      name,
      slug,
      category,
      phone:          cleanPhone(row.phone),
      email:          row.email || undefined,
      website:        row.website || undefined,
      street_address: row.address || undefined,
      city,
      state,
      state_full,
      zip_code,
      insured:        false,
      bonded:         false,
      featured:       false,
      average_rating,
      review_count,
      status:         'active',
      social_media:   parseSocialMedia(row),
    })
  }

  console.log(`   ✅ ${businesses.length} valid businesses (${skipped} skipped)`)
  return businesses
}

async function insertInBatches(
  supabase: ReturnType<typeof createAdminClient>,
  businesses: ProcessedBusiness[],
  batchSize = 200
): Promise<number> {
  let inserted = 0
  for (let start = 0; start < businesses.length; start += batchSize) {
    const batch = businesses.slice(start, start + batchSize)
    const { data, error } = await supabase
      .from('businesses')
      .insert(batch)
      .select('id')

    if (error) {
      console.error(`   ❌ Batch ${start}–${start + batch.length - 1} failed:`, error.message)
      // Continue with next batch rather than aborting everything
    } else {
      inserted += data?.length ?? 0
    }

    if ((start / batchSize) % 10 === 0) {
      console.log(`   … inserted ${inserted} so far`)
    }
  }
  return inserted
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function run() {
  const projectRoot = path.resolve(__dirname, '../../../')
  const junkFile   = path.join(projectRoot, 'Junk_Hauling_Cleaned.csv')
  const estateFile = path.join(projectRoot, 'Estate_Cleanout_Cleaned.csv')

  for (const f of [junkFile, estateFile]) {
    if (!fs.existsSync(f)) {
      console.error(`❌ File not found: ${f}`)
      process.exit(1)
    }
  }

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

  const junkBusinesses   = await processCsvFile(junkFile,   'junk_removal',   seenSlugs)
  const estateBusinesses = await processCsvFile(estateFile, 'estate_cleanout', seenSlugs)

  const allBusinesses = [...junkBusinesses, ...estateBusinesses]
  console.log(`\n   Total to insert: ${allBusinesses.length}`)

  // ── Step 3: Insert in batches ─────────────────────────────────────────────
  console.log('\n💾 Step 3: Inserting into Supabase…')
  console.log('   Inserting junk removal businesses…')
  const junkInserted = await insertInBatches(supabase, junkBusinesses)
  console.log(`   ✅ Junk removal: ${junkInserted} inserted`)

  console.log('   Inserting estate cleanout businesses…')
  const estateInserted = await insertInBatches(supabase, estateBusinesses)
  console.log(`   ✅ Estate cleanout: ${estateInserted} inserted`)

  console.log(`\n🎉 Done! Total inserted: ${junkInserted + estateInserted} businesses`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
