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
  image_url_1: string
  image_url_2: string
  image_url_3: string
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
  _images: string[]
}

interface ImageRecord {
  business_id: string
  url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
}

// ── CSV Parser ────────────────────────────────────────────────────────────────

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
    const line = pending ? pending + '\n' + rawLine : rawLine
    const quoteCount = (line.match(/"/g) || []).length
    if (quoteCount % 2 !== 0) {
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

// ── Processing ────────────────────────────────────────────────────────────────

async function parseCsv(filePath: string, existingSlugs: Set<string>): Promise<ProcessedBusiness[]> {
  console.log(`\n📄 Reading ${path.basename(filePath)}…`)
  const rows = await readCsv(filePath)
  console.log(`   ${rows.length} rows found`)

  const businesses: ProcessedBusiness[] = []
  // Track which base slugs have been used and how many times
  const seenSlugs = new Map<string, number>()
  let skipped = 0

  for (const row of rows) {
    const name = row.business_name?.trim()
    if (!name) { skipped++; continue }

    const city = row.city?.trim() || row.scraped_city?.trim()
    if (!city) { skipped++; continue }

    const state = row.state_code?.trim().toUpperCase()
    const state_full = row.state_field?.trim() || row.state?.trim()
    if (!state || !state_full) { skipped++; continue }

    const baseSlug = slugify(`${name} ${city} ${state}`, { lower: true, strict: true })
    // Find a slug that doesn't exist in DB or in this batch
    let count = seenSlugs.get(baseSlug) ?? 0
    let slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`
    while (existingSlugs.has(slug)) {
      count++
      slug = `${baseSlug}-${count + 1}`
    }
    seenSlugs.set(baseSlug, count + 1)
    existingSlugs.add(slug) // Reserve this slug for subsequent rows

    const images = [row.image_url_1, row.image_url_2, row.image_url_3]
      .filter(u => u && u.startsWith('http'))

    businesses.push({
      name,
      slug,
      category: 'estate_cleanout',
      phone:          cleanPhone(row.phone),
      email:          row.email?.trim() || undefined,
      website:        row.website?.trim() || undefined,
      street_address: row.address?.trim() || undefined,
      city,
      state,
      state_full,
      zip_code:       cleanZip(row.postal_code),
      insured:        false,
      bonded:         false,
      featured:       false,
      average_rating: parseFloat(row.rating) || 0,
      review_count:   parseInt(row.reviews, 10) || 0,
      status:         'active',
      social_media:   parseSocialMedia(row),
      _images:        images,
    })
  }

  console.log(`   ✅ ${businesses.length} valid (${skipped} skipped)`)
  return businesses
}

async function run() {
  const projectRoot = path.resolve(__dirname, '../../../')
  const csvPath = path.join(projectRoot, 'estate_cleanout_services_all_cities.csv')

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV not found: ${csvPath}`)
    process.exit(1)
  }

  const supabase = createAdminClient()

  // ── Step 1: Clear existing estate cleanout data ───────────────────────────
  console.log('\n🧹 Step 1: Removing existing estate cleanout businesses…')

  // Fetch all IDs with pagination (Supabase returns max 1000 rows per query)
  let ids: string[] = []
  let page = 0
  const pageSize = 1000
  while (true) {
    const { data, error: fetchErr } = await supabase
      .from('businesses')
      .select('id')
      .eq('category', 'estate_cleanout')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (fetchErr) {
      console.error('❌ Error fetching existing businesses:', fetchErr.message)
      process.exit(1)
    }

    ids = ids.concat((data ?? []).map(r => r.id))
    if (!data || data.length < pageSize) break
    page++
  }

  console.log(`   Found ${ids.length} existing estate cleanout businesses`)

  if (ids.length > 0) {
    const chunkSize = 200

    // Delete images in chunks
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize)
      const { error: imgDelErr } = await supabase
        .from('business_images')
        .delete()
        .in('business_id', chunk)
      if (imgDelErr) {
        console.error('❌ Error deleting images:', imgDelErr.message)
        process.exit(1)
      }
    }
    console.log('   ✅ Images deleted')

    // Delete reviews in chunks
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize)
      const { error: revDelErr } = await supabase
        .from('reviews')
        .delete()
        .in('business_id', chunk)
      if (revDelErr) {
        console.error('❌ Error deleting reviews:', revDelErr.message)
        process.exit(1)
      }
    }
    console.log('   ✅ Reviews deleted')

    // Delete businesses in chunks
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize)
      const { error: bizDelErr } = await supabase
        .from('businesses')
        .delete()
        .in('id', chunk)
      if (bizDelErr) {
        console.error('❌ Error deleting businesses:', bizDelErr.message)
        process.exit(1)
      }
    }
    console.log('   ✅ Businesses deleted')
  }

  // ── Step 2: Load existing slugs to avoid collisions ──────────────────────
  console.log('\n🔍 Step 2: Loading existing slugs from DB…')
  const existingSlugs = new Set<string>()
  let slugPage = 0
  while (true) {
    const { data: slugData, error: slugErr } = await supabase
      .from('businesses')
      .select('slug')
      .range(slugPage * 1000, (slugPage + 1) * 1000 - 1)

    if (slugErr) {
      console.error('❌ Error fetching slugs:', slugErr.message)
      process.exit(1)
    }

    ;(slugData ?? []).forEach(r => existingSlugs.add(r.slug))
    if (!slugData || slugData.length < 1000) break
    slugPage++
  }
  console.log(`   Found ${existingSlugs.size} existing slugs`)

  // ── Step 3: Parse CSV ─────────────────────────────────────────────────────
  console.log('\n📂 Step 3: Parsing CSV…')
  const businesses = await parseCsv(csvPath, existingSlugs)

  if (businesses.length === 0) {
    console.error('❌ No valid businesses parsed from CSV')
    process.exit(1)
  }

  // ── Step 4: Insert businesses in batches ──────────────────────────────────
  console.log(`\n💾 Step 4: Inserting ${businesses.length} businesses…`)
  const allImageRecords: ImageRecord[] = []
  let totalInserted = 0
  const batchSize = 200

  for (let start = 0; start < businesses.length; start += batchSize) {
    const batch = businesses.slice(start, start + batchSize)

    // Strip private _images field before inserting
    const batchData = batch.map(({ _images: _i, ...biz }) => biz)

    const { data, error } = await supabase
      .from('businesses')
      .insert(batchData)
      .select('id')

    if (error) {
      console.error(`   ❌ Batch ${start}–${start + batch.length - 1} failed:`, error.message)
      continue
    }

    totalInserted += data?.length ?? 0

    if (data) {
      data.forEach((row, idx) => {
        const biz = batch[idx]
        biz._images.forEach((url, imgIdx) => {
          allImageRecords.push({
            business_id: row.id,
            url,
            alt_text: `${biz.name} - photo ${imgIdx + 1}`,
            is_primary: imgIdx === 0,
            sort_order: imgIdx,
          })
        })
      })
    }

    if (start % (batchSize * 5) === 0 && start > 0) {
      console.log(`   … inserted ${totalInserted} so far`)
    }
  }

  console.log(`   ✅ Inserted ${totalInserted} businesses`)

  // ── Step 5: Insert images ─────────────────────────────────────────────────
  if (allImageRecords.length > 0) {
    console.log(`\n🖼️  Step 5: Inserting ${allImageRecords.length} images…`)
    let imagesInserted = 0
    for (let start = 0; start < allImageRecords.length; start += batchSize) {
      const batch = allImageRecords.slice(start, start + batchSize)
      const { data, error } = await supabase
        .from('business_images')
        .insert(batch)
        .select('id')
      if (error) {
        console.error(`   ❌ Image batch failed:`, error.message)
      } else {
        imagesInserted += data?.length ?? 0
      }
    }
    console.log(`   ✅ Inserted ${imagesInserted} images`)
  }

  console.log(`\n🎉 Done! ${totalInserted} estate cleanout businesses, ${allImageRecords.length} images`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
