import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { createAdminClient } from '../supabase/admin'
import slugify from 'slugify'
import { PHOTOS } from './data'

// The verified dumpster photo — kept as a gallery fallback for restored businesses.
const JUNK_PHOTO = PHOTOS.junk[0]
const DUMPSTER_URL = `https://images.unsplash.com/photo-${JUNK_PHOTO.id}?w=800&q=80`
const DUMPSTER_ALT = JUNK_PHOTO.alt

const CSV_PATH = path.join(process.cwd(), 'Junk_Removal_Cleaned_Small.csv')
const CHUNK = 100

interface CsvRow {
  name: string
  city: string
  state_code: string
  phone: string
  company_phone: string
  photo: string
  logo: string
  [key: string]: string
}

// ── Minimal CSV parser (handles quoted fields with embedded commas) ────────────

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
      // Strip BOM if present
      const cleanLine = line.replace(/^﻿/, '')
      headers = parseCsvLine(cleanLine).map(h => h.trim())
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

function cleanPhone(raw: string): string | undefined {
  if (!raw) return undefined
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1)
  return digits.length >= 7 ? digits : undefined
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  const supabase = createAdminClient()

  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found: ${CSV_PATH}`)
  }

  console.log(`📄 Reading ${path.basename(CSV_PATH)}…`)
  const allRows = await readCsv(CSV_PATH)
  console.log(`   ${allRows.length} rows total`)

  // Filter to rows that actually have photo or logo data
  const rows = allRows.filter(r => r.photo?.trim() || r.logo?.trim())
  console.log(`   ${rows.length} rows with photo/logo to restore`)

  // ── Step 1: Build a phone → row map ──────────────────────────────────────
  const phoneToRow = new Map<string, CsvRow>()
  for (const row of rows) {
    const phone = cleanPhone(row.phone || row.company_phone)
    if (phone) phoneToRow.set(phone, row)
  }

  // ── Step 2: Fetch matching businesses by phone ────────────────────────────
  const phones = [...phoneToRow.keys()]
  console.log(`\n🔍 Matching ${phones.length} phone numbers against database…`)

  const phoneToId = new Map<string, string>()
  const phoneToName = new Map<string, string>()

  for (let i = 0; i < phones.length; i += CHUNK) {
    const batch = phones.slice(i, i + CHUNK)
    const { data, error } = await supabase
      .from('businesses')
      .select('id, phone, name')
      .in('phone', batch)

    if (error) {
      console.error(`   ❌ Phone batch ${i} failed: ${error.message}`)
      continue
    }

    for (const biz of data ?? []) {
      if (biz.phone) {
        phoneToId.set(biz.phone, biz.id)
        phoneToName.set(biz.phone, biz.name)
      }
    }
  }
  console.log(`   Found ${phoneToId.size} phone matches`)

  // ── Step 3: For rows without a phone match, try slug ──────────────────────
  const slugRows = rows.filter(r => {
    const phone = cleanPhone(r.phone || r.company_phone)
    return !phone || !phoneToId.has(phone)
  })

  console.log(`\n🔍 Trying slug fallback for ${slugRows.length} unmatched rows…`)
  const slugToId = new Map<string, string>()

  for (const row of slugRows) {
    const name = row.name?.trim()
    const city = row.city?.trim()
    const state = row.state_code?.trim().toUpperCase()
    if (!name || !city || !state) continue

    const slug = slugify(`${name} ${city} ${state}`, { lower: true, strict: true })
    const { data } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (data?.id) slugToId.set(slug, data.id)
  }
  console.log(`   Found ${slugToId.size} additional slug matches`)

  // ── Step 4: Build image update batches ────────────────────────────────────

  interface ImageRow {
    business_id: string
    url: string
    alt_text: string
    is_primary: boolean
    sort_order: number
  }

  const matchedIds: string[] = []
  const newImages: ImageRow[] = []

  for (const row of rows) {
    const phone = cleanPhone(row.phone || row.company_phone)
    const slug = slugify(
      `${row.name?.trim() ?? ''} ${row.city?.trim() ?? ''} ${row.state_code?.trim().toUpperCase() ?? ''}`,
      { lower: true, strict: true }
    )

    const bizId = (phone && phoneToId.get(phone)) ?? slugToId.get(slug)
    if (!bizId) continue

    const name = row.name?.trim() ?? 'Business'
    const photo = row.photo?.trim()
    const logo = row.logo?.trim()

    matchedIds.push(bizId)

    if (photo) {
      newImages.push({ business_id: bizId, url: photo, alt_text: `${name} - photo`, is_primary: true, sort_order: 0 })
    }
    if (logo) {
      newImages.push({ business_id: bizId, url: logo, alt_text: `${name} - logo`, is_primary: false, sort_order: photo ? 1 : 0 })
      if (!photo) newImages[newImages.length - 1].is_primary = true
    }
    // Dumpster becomes a gallery fallback at sort_order 2
    newImages.push({ business_id: bizId, url: DUMPSTER_URL, alt_text: DUMPSTER_ALT, is_primary: false, sort_order: photo ? 2 : logo ? 1 : 0 })
  }

  console.log(`\n📸 ${matchedIds.length} businesses matched, ${newImages.length} image rows to write`)

  if (matchedIds.length === 0) {
    console.log('No matches found — nothing to do.')
    return
  }

  // ── Step 5: Demote the existing dumpster-only image to sort_order 2 ───────
  // (The nuclear fix left each business with exactly 1 image: the dumpster.)
  console.log('\n🔧 Demoting existing primary images for matched businesses…')
  let demoted = 0

  for (let i = 0; i < matchedIds.length; i += CHUNK) {
    const batch = matchedIds.slice(i, i + CHUNK)
    const { error } = await supabase
      .from('business_images')
      .update({ is_primary: false, sort_order: 2 })
      .in('business_id', batch)
      .eq('url', DUMPSTER_URL)

    if (error) {
      console.error(`   ❌ Demote batch ${i} failed: ${error.message}`)
    } else {
      demoted += batch.length
    }
  }
  console.log(`   Demoted images for ${demoted} businesses`)

  // ── Step 6: Upsert the CSV photos as new primary images ───────────────────
  console.log('\n📤 Upserting CSV photos…')
  let upserted = 0
  let errors = 0

  for (let i = 0; i < newImages.length; i += CHUNK) {
    const batch = newImages.slice(i, i + CHUNK)
    const { error } = await supabase
      .from('business_images')
      .upsert(batch, { onConflict: 'business_id,url' })

    if (error) {
      console.error(`   ❌ Upsert batch ${i} failed: ${error.message}`)
      errors++
    } else {
      upserted += batch.length
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Businesses restored: ${matchedIds.length}`)
  console.log(`   Image rows upserted: ${upserted}`)
  if (errors) console.log(`   Batches with errors: ${errors}`)
  console.log(`\nMatched businesses now show their own Google Maps photo as primary.`)
  console.log(`Unmatched businesses (~${rows.length - matchedIds.length} skipped) still show the dumpster photo.`)
  console.log(`Run npm run scrape-services to restore website-scraped photos for all businesses.`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
