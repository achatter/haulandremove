import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { ApifyClient } from 'apify-client'
import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'
import slugify from 'slugify'

const DUMPSTER_URL = `https://images.unsplash.com/photo-${PHOTOS.junk[0].id}?w=800&q=80`
const CHUNK = 500
// Apify Google Maps Scraper actor (compass/crawler-google-places)
const ACTOR_ID = 'nwua9Gu5YrADL7ZDj'

function cleanPhone(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return digits
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1)
  return digits.length >= 7 ? digits : undefined
}

async function run() {
  const token = process.env.APIFY_API_TOKEN
  if (!token) throw new Error('APIFY_API_TOKEN is not set in .env.local')

  const supabase = createAdminClient()
  const apify = new ApifyClient({ token })

  // ── Step 1: Identify businesses still needing a real photo ────────────────
  console.log('🔍 Fetching junk_removal businesses…')
  const allBizs: Array<{ id: string; name: string; city: string; state: string; phone: string | null }> = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, city, state, phone')
      .eq('category', 'junk_removal')
      .range(from, from + 999)
    if (error) throw new Error(`Fetch businesses: ${error.message}`)
    allBizs.push(...(data ?? []))
    if (!data || data.length < 1000) break
    from += 1000
  }
  console.log(`  ${allBizs.length} total junk_removal businesses`)

  // Query the inverse: collect business_ids that ALREADY have a real photo.
  // This avoids large .in() batches which exceed URL length limits.
  console.log('🔍 Checking which still have only the placeholder photo…')
  const alreadyHasRealPhoto = new Set<string>()
  let imgFrom = 0
  while (true) {
    const { data: realImgs, error } = await supabase
      .from('business_images')
      .select('business_id')
      .eq('is_primary', true)
      .not('url', 'like', '%unsplash%')
      .range(imgFrom, imgFrom + 999)
    if (error) throw new Error(`Fetch real images: ${error.message}`)
    for (const img of realImgs ?? []) alreadyHasRealPhoto.add(img.business_id)
    if (!realImgs || realImgs.length < 1000) break
    imgFrom += 1000
  }

  const targets = allBizs.filter(b => !alreadyHasRealPhoto.has(b.id))
  console.log(`  ${targets.length} businesses need a real photo\n`)

  if (targets.length === 0) {
    console.log('Nothing to do — all businesses already have real primary photos.')
    return
  }

  // ── Step 2: Run Apify Google Maps Scraper ─────────────────────────────────
  const queries = targets.map(b => `${b.name} ${b.city} ${b.state}`)
  console.log(`🚀 Starting Apify Google Maps Scraper for ${queries.length} queries…`)
  console.log('   (This may take several minutes)')

  const run_ = await apify.actor(ACTOR_ID).call({
    searchStringsArray: queries,
    maxCrawledPlacesPerSearch: 1,
    language: 'en',
  })

  console.log(`   Run ID: ${run_.id}  Status: ${run_.status}`)

  // ── Step 3: Download results ───────────────────────────────────────────────
  console.log('\n📥 Downloading results…')
  const { items } = await apify.dataset(run_.defaultDatasetId).listItems()
  console.log(`   ${items.length} results returned`)

  // ── Step 4: Build phone → bizId index ─────────────────────────────────────
  const phoneToId = new Map<string, string>()
  const nameStateToId = new Map<string, string>()

  for (const b of targets) {
    const phone = cleanPhone(b.phone)
    if (phone) phoneToId.set(phone, b.id)
    const key = slugify(`${b.name} ${b.state}`, { lower: true, strict: true })
    nameStateToId.set(key, b.id)
  }

  // ── Step 5: Match results → businesses and collect photo URLs ─────────────
  interface Match { bizId: string; photoUrl: string }
  const matches: Match[] = []
  let noPhoto = 0
  let noMatch = 0

  for (const item of items) {
    // Apify Google Maps Scraper field names
    const rawPhone = (item.phoneUnformatted ?? item.phone ?? '') as string
    const phone = cleanPhone(rawPhone)
    const rawName = (item.title ?? item.name ?? '') as string
    const nameStateKey = slugify(`${rawName} ${(item.state ?? item.address ?? '')}`, { lower: true, strict: true })

    // Photo: try imageUrl first, then first entry in photos array
    // compass/crawler-google-places returns imageUrl (main) and images[] (gallery)
    const photoUrl =
      (item.imageUrl as string | undefined) ??
      (Array.isArray(item.images) && item.images.length > 0 ? (item.images[0] as string) : undefined) ??
      (Array.isArray(item.photos) && item.photos.length > 0 ? (item.photos[0] as string) : undefined)

    if (!photoUrl) { noPhoto++; continue }

    const bizId = (phone && phoneToId.get(phone)) ?? nameStateToId.get(nameStateKey)
    if (!bizId) { noMatch++; continue }

    matches.push({ bizId, photoUrl })
  }

  console.log(`\n   Matched with photo: ${matches.length}`)
  console.log(`   No photo in result: ${noPhoto}`)
  console.log(`   No business match:  ${noMatch}`)

  if (matches.length === 0) {
    console.log('\nNo matches to write.')
    return
  }

  // ── Step 6: Demote existing placeholder primary, upsert new photo ─────────
  console.log('\n📸 Updating database…')
  let promoted = 0
  let errors = 0

  for (const { bizId, photoUrl } of matches) {
    const { error: demoteErr } = await supabase
      .from('business_images')
      .update({ is_primary: false, sort_order: 99 })
      .eq('business_id', bizId)
      .eq('is_primary', true)

    if (demoteErr) {
      console.warn(`  ⚠️  Demote failed for ${bizId}: ${demoteErr.message}`)
      errors++
      continue
    }

    const { error: imgErr } = await supabase
      .from('business_images')
      .upsert(
        { business_id: bizId, url: photoUrl, alt_text: 'Business photo', is_primary: true, sort_order: 0 },
        { onConflict: 'business_id,url' }
      )

    if (imgErr) {
      console.warn(`  ⚠️  Upsert failed for ${bizId}: ${imgErr.message}`)
      errors++
    } else {
      promoted++
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Photos promoted: ${promoted}`)
  console.log(`   Errors:          ${errors}`)
  console.log(`   Still no photo:  ${targets.length - matches.length}`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
