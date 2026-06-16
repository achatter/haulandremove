import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { createAdminClient } from '../supabase/admin'
import slugify from 'slugify'
import { PHOTOS } from './data'

const ESTATE_PHOTO = PHOTOS.estate[0]
const ESTATE_PLACEHOLDER_URL = `https://images.unsplash.com/photo-${ESTATE_PHOTO.id}?w=800&q=80`
const ESTATE_PLACEHOLDER_ALT = ESTATE_PHOTO.alt

const CSV_PATH = path.join(process.cwd(), 'Estate_Cleanout_Cleaned.csv')
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

async function run() {
  const supabase = createAdminClient()

  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found: ${CSV_PATH}\nRun npm run export-missing-estate-photos, get Outscraper results, and save as Estate_Cleanout_Cleaned.csv`)
  }

  console.log(`📄 Reading ${path.basename(CSV_PATH)}…`)
  const allRows = await readCsv(CSV_PATH)
  console.log(`   ${allRows.length} rows total`)

  const rows = allRows.filter(r => r.photo?.trim() || r.logo?.trim())
  console.log(`   ${rows.length} rows with photo/logo to restore`)

  // ── Step 1: Build phone → row map ─────────────────────────────────────────
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

  // ── Step 3: Slug fallback for unmatched rows ──────────────────────────────
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
    // Estate placeholder becomes a gallery fallback
    newImages.push({ business_id: bizId, url: ESTATE_PLACEHOLDER_URL, alt_text: ESTATE_PLACEHOLDER_ALT, is_primary: false, sort_order: photo ? 2 : logo ? 1 : 0 })
  }

  const uniqueMatchedIds = [...new Set(matchedIds)]
  const seenImageKeys = new Set<string>()
  const uniqueNewImages = newImages.filter(img => {
    const key = `${img.business_id}::${img.url}`
    if (seenImageKeys.has(key)) return false
    seenImageKeys.add(key)
    return true
  })

  console.log(`\n📸 ${uniqueMatchedIds.length} businesses matched, ${uniqueNewImages.length} image rows to write`)

  if (uniqueMatchedIds.length === 0) {
    console.log('No matches found — nothing to do.')
    return
  }

  // ── Step 5: Demote all unsplash placeholder primaries for matched businesses
  // Estate cleanout businesses use multiple different unsplash placeholder URLs,
  // so we match on the unsplash domain rather than a single URL.
  console.log('\n🔧 Demoting existing placeholder primaries for matched businesses…')
  let demoted = 0

  for (let i = 0; i < uniqueMatchedIds.length; i += CHUNK) {
    const batch = uniqueMatchedIds.slice(i, i + CHUNK)
    const { error } = await supabase
      .from('business_images')
      .update({ is_primary: false, sort_order: 2 })
      .in('business_id', batch)
      .like('url', '%unsplash%')

    if (error) {
      console.error(`   ❌ Demote batch ${i} failed: ${error.message}`)
    } else {
      demoted += batch.length
    }
  }
  console.log(`   Demoted placeholders for ${demoted} businesses`)

  // ── Step 6: Upsert the CSV photos as new primary images ───────────────────
  console.log('\n📤 Upserting CSV photos…')
  let upserted = 0
  let errors = 0

  for (let i = 0; i < uniqueNewImages.length; i += CHUNK) {
    const batch = uniqueNewImages.slice(i, i + CHUNK)
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
  console.log(`   Businesses restored: ${uniqueMatchedIds.length}`)
  console.log(`   Image rows upserted: ${upserted}`)
  if (errors) console.log(`   Batches with errors: ${errors}`)
  console.log(`   Unmatched (skipped): ${rows.length - uniqueMatchedIds.length}`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
