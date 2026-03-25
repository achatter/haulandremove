import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { chromium, Browser, Page } from 'playwright'
import { createAdminClient } from '../supabase/admin'

const BATCH_SIZE = 10
const PAGE_TIMEOUT_MS = 15_000
const BATCH_PAUSE_MS = 1_500

// Service-related keywords common to junk removal / hauling companies
const SERVICE_KEYWORDS = [
  'removal', 'hauling', 'cleanout', 'junk', 'pickup', 'disposal',
  'demolition', 'demo', 'debris', 'trash', 'estate', 'hoarding',
  'furniture', 'appliance', 'mattress', 'yard', 'construction',
]

interface ScrapedData {
  services: Array<{ name: string; source: 'scraped' }>
  extra_photos: string[]
}

/**
 * Scrapes a single business website for services and additional photos.
 * Returns empty arrays on failure so the business is marked as processed.
 */
async function scrapePage(url: string, browser: Browser): Promise<ScrapedData> {
  let page: Page | null = null
  try {
    page = await browser.newPage()

    // Set a realistic user agent to reduce blocks
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS })

    // --- Extract services ---
    const services = await page.evaluate((keywords: string[]) => {
      const candidates = new Set<string>()

      // Strategy 1: elements whose class or id contains "service"
      document.querySelectorAll('[class*="service"], [id*="service"]').forEach(el => {
        el.querySelectorAll('h2, h3, h4, li, [class*="title"], [class*="name"]').forEach(item => {
          const text = item.textContent?.trim() ?? ''
          if (text.length > 2 && text.length < 80) candidates.add(text)
        })
      })

      // Strategy 2: scan h2/h3 for service-related keywords (fallback)
      if (candidates.size === 0) {
        document.querySelectorAll('h2, h3').forEach(heading => {
          const text = heading.textContent?.trim() ?? ''
          const lower = text.toLowerCase()
          if (keywords.some(kw => lower.includes(kw)) && text.length < 80) {
            candidates.add(text)
          }
        })
      }

      // Strategy 3: list items inside a section/div that contains a service keyword heading
      if (candidates.size === 0) {
        document.querySelectorAll('section, div').forEach(section => {
          const heading = section.querySelector('h2, h3')
          if (!heading) return
          const headingText = heading.textContent?.toLowerCase() ?? ''
          if (!keywords.some(kw => headingText.includes(kw))) return
          section.querySelectorAll('li').forEach(li => {
            const text = li.textContent?.trim() ?? ''
            if (text.length > 2 && text.length < 80) candidates.add(text)
          })
        })
      }

      return [...candidates].slice(0, 15)
    }, SERVICE_KEYWORDS)

    // --- Extract additional photos ---
    const extra_photos = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => ({
          src: img.src,
          w: img.naturalWidth || img.width,
          h: img.naturalHeight || img.height,
        }))
        .filter(img =>
          img.src.startsWith('http') &&
          img.w >= 100 &&
          img.h >= 100 &&
          !img.src.toLowerCase().includes('logo') &&
          !img.src.toLowerCase().includes('icon') &&
          !img.src.toLowerCase().includes('favicon')
        )
        .map(img => img.src)
        .slice(0, 2)
    })

    return {
      services: services.map(name => ({ name, source: 'scraped' as const })),
      extra_photos,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`    ⚠️  Scrape failed: ${msg.split('\n')[0]}`)
    return { services: [], extra_photos: [] }
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

/**
 * Main scraper: processes all businesses in the DB that have a website
 * but no services data yet. Resumable — re-running skips already-processed rows.
 */
async function scrapeServices() {
  const supabase = createAdminClient()

  // Fetch businesses that need scraping
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, website, slug')
    .eq('status', 'active')
    .not('website', 'is', null)
    .is('services', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch businesses:', error.message)
    process.exit(1)
  }

  if (!businesses || businesses.length === 0) {
    console.log('ℹ️  No businesses need scraping (all have services data or no website).')
    return
  }

  console.log(`🔍 Scraping ${businesses.length} businesses...\n`)

  const browser = await chromium.launch({ headless: true })

  try {
    let successCount = 0
    let failCount    = 0

    for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
      const batch = businesses.slice(i, i + BATCH_SIZE)

      await Promise.allSettled(
        batch.map(async (biz, batchIdx) => {
          const globalIdx = i + batchIdx + 1
          const url = biz.website!.startsWith('http') ? biz.website! : `https://${biz.website}`
          console.log(`  [${globalIdx}/${businesses.length}] ${biz.name}`)

          const scraped = await scrapePage(url, browser)

          // Always update — even empty array marks the row as processed
          const { error: updateErr } = await supabase
            .from('businesses')
            .update({ services: scraped.services })
            .eq('id', biz.id)

          if (updateErr) {
            console.warn(`    ⚠️  DB update failed: ${updateErr.message}`)
            failCount++
          } else {
            if (scraped.services.length > 0) {
              console.log(`    ✅ ${scraped.services.length} services found`)
              successCount++
            } else {
              console.log(`    ○  No services found`)
              failCount++
            }
          }

          // Insert extra photos
          if (scraped.extra_photos.length > 0) {
            const imageRows = scraped.extra_photos.map((url, idx) => ({
              business_id: biz.id,
              url,
              alt_text: `${biz.name} photo ${idx + 2}`,
              is_primary: false,
              sort_order: idx + 1,
            }))
            const { error: imgErr } = await supabase
              .from('business_images')
              .insert(imageRows)
            if (imgErr) {
              console.warn(`    ⚠️  Image insert failed: ${imgErr.message}`)
            } else {
              console.log(`    📷 ${imageRows.length} extra photo(s) saved`)
            }
          }
        })
      )

      // Pause between batches to be polite to servers
      if (i + BATCH_SIZE < businesses.length) {
        await new Promise(r => setTimeout(r, BATCH_PAUSE_MS))
      }
    }

    console.log(`\n🎉 Scraping complete!`)
    console.log(`   Services found: ${successCount} / ${businesses.length}`)
    console.log(`   No data found:  ${failCount} / ${businesses.length}`)
    console.log(`\n💡 To re-scrape failed businesses, run:`)
    console.log(`   UPDATE businesses SET services = NULL WHERE services = '[]'::jsonb;`)
    console.log(`   Then run npm run scrape-services again.`)
  } finally {
    await browser.close()
  }
}

if (require.main === module) {
  scrapeServices().catch(err => {
    console.error('Scraping failed:', err)
    process.exit(1)
  })
}

export { scrapeServices }
