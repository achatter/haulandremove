import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { chromium, Browser, Page } from 'playwright'
import { createAdminClient } from '../supabase/admin'
import { PHOTOS } from './data'

// The current dumpster placeholder — businesses showing only this need real photos.
const DUMPSTER_URL = `https://images.unsplash.com/photo-${PHOTOS.junk[0].id}?w=800&q=80`

const BATCH_SIZE = 10
const PAGE_TIMEOUT_MS = 15_000
const BATCH_PAUSE_MS = 1_500
const CHUNK = 500

/**
 * Visits a business website and returns the URL of the first large, content-looking image.
 * Returns null if the site is unreachable or has no suitable photos.
 */
async function scrapeFirstPhoto(url: string, browser: Browser): Promise<string | null> {
  let page: Page | null = null
  try {
    page = await browser.newPage()
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS })

    const photos = await page.evaluate((): string[] => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => ({
          src: img.src,
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height,
        }))
        .filter(
          img =>
            img.src.startsWith('http') &&
            img.w >= 200 &&
            img.h >= 200 &&
            !img.src.toLowerCase().includes('logo') &&
            !img.src.toLowerCase().includes('icon') &&
            !img.src.toLowerCase().includes('favicon') &&
            !img.src.toLowerCase().includes('sprite') &&
            !img.src.toLowerCase().includes('badge')
        )
        .sort((a, b) => b.w * b.h - a.w * a.h) // largest first
        .map(img => img.src)
    })

    return photos[0] ?? null
  } catch {
    return null
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

async function run() {
  const supabase = createAdminClient()

  // ── Step 1: fetch all junk_removal businesses that have a website ─────────
  console.log('🔍 Fetching junk_removal businesses with websites…')
  const allBizsWithSite: Array<{ id: string; name: string; website: string }> = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, website')
      .eq('category', 'junk_removal')
      .not('website', 'is', null)
      .range(from, from + 999)
    if (error) throw new Error(`Fetch businesses: ${error.message}`)
    allBizsWithSite.push(...(data ?? []))
    if (!data || data.length < 1000) break
    from += 1000
  }
  console.log(`  ${allBizsWithSite.length} junk_removal businesses with websites`)

  // ── Step 2: find which ones show only the dumpster placeholder ────────────
  console.log('🔍 Checking for placeholder-only primaries…')
  const bizIds = allBizsWithSite.map(b => b.id)
  const needsRealPhoto = new Set<string>()

  for (let i = 0; i < bizIds.length; i += CHUNK) {
    const chunk = bizIds.slice(i, i + CHUNK)
    const { data: images, error } = await supabase
      .from('business_images')
      .select('business_id, url, is_primary')
      .in('business_id', chunk)

    if (error) {
      console.error(`  ❌ Image fetch error (batch ${i}): ${error.message}`)
      continue
    }

    const byBiz = new Map<string, Array<{ url: string; is_primary: boolean }>>()
    for (const img of images ?? []) {
      if (!byBiz.has(img.business_id)) byBiz.set(img.business_id, [])
      byBiz.get(img.business_id)!.push(img)
    }

    for (const bizId of chunk) {
      const imgs = byBiz.get(bizId) ?? []
      const primaries = imgs.filter(img => img.is_primary)
      const hasOnlyPlaceholder =
        primaries.length === 0 || primaries.every(img => img.url === DUMPSTER_URL)
      if (hasOnlyPlaceholder) needsRealPhoto.add(bizId)
    }
  }

  const targets = allBizsWithSite.filter(b => needsRealPhoto.has(b.id))
  console.log(`  ${targets.length} businesses need a real primary photo`)

  if (targets.length === 0) {
    console.log('Nothing to do — all businesses already have real primary photos.')
    return
  }

  // ── Step 3: scrape & promote ──────────────────────────────────────────────
  console.log('\n🌐 Scraping business websites…\n')
  const browser = await chromium.launch({ headless: true })
  let promoted = 0
  let noPhoto = 0
  let dbErrors = 0

  try {
    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
      const batch = targets.slice(i, i + BATCH_SIZE)

      await Promise.allSettled(
        batch.map(async (biz, batchIdx) => {
          const globalIdx = i + batchIdx + 1
          const url = biz.website.startsWith('http') ? biz.website : `https://${biz.website}`

          const photoUrl = await scrapeFirstPhoto(url, browser)

          if (!photoUrl) {
            noPhoto++
            return
          }

          // Demote existing placeholder primary
          const { error: demoteErr } = await supabase
            .from('business_images')
            .update({ is_primary: false, sort_order: 99 })
            .eq('business_id', biz.id)
            .eq('is_primary', true)

          if (demoteErr) {
            console.warn(`  ⚠️  [${globalIdx}] ${biz.name}: demote failed — ${demoteErr.message}`)
            dbErrors++
            return
          }

          // Upsert the scraped photo as the new primary
          const { error: imgErr } = await supabase
            .from('business_images')
            .upsert(
              {
                business_id: biz.id,
                url: photoUrl,
                alt_text: `${biz.name} photo`,
                is_primary: true,
                sort_order: 0,
              },
              { onConflict: 'business_id,url' }
            )

          if (imgErr) {
            console.warn(`  ⚠️  [${globalIdx}] ${biz.name}: insert failed — ${imgErr.message}`)
            dbErrors++
          } else {
            console.log(`  ✅ [${globalIdx}/${targets.length}] ${biz.name}`)
            promoted++
          }
        })
      )

      if (i + BATCH_SIZE < targets.length) {
        await new Promise(r => setTimeout(r, BATCH_PAUSE_MS))
      }

      if (i > 0 && (i / BATCH_SIZE) % 20 === 0) {
        console.log(`… ${i}/${targets.length} scanned (${promoted} promoted so far)`)
      }
    }
  } finally {
    await browser.close()
  }

  console.log(`\n✅ Done!`)
  console.log(`  Businesses scanned:  ${targets.length}`)
  console.log(`  Photos promoted:     ${promoted}`)
  console.log(`  No photo found:      ${noPhoto}`)
  if (dbErrors) console.log(`  DB errors:           ${dbErrors}`)
  console.log(
    `\nFor businesses with no website or no scrapeable photos (~${noPhoto} above),\n` +
      `re-export from Outscraper/Apify with the 'photo' column enabled and run\n` +
      `npm run restore-junk-images with the updated CSV.`
  )
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
