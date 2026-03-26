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
        el.querySelectorAll('h1, h2, h3, h4, li, [class*="title"], [class*="name"]').forEach(item => {
          const text = item.textContent?.trim() ?? ''
          if (text.length > 2 && text.length < 80) candidates.add(text)
        })
      })

      // Strategy 2: scan h1/h2/h3/h4 for service-related keywords
      if (candidates.size === 0) {
        document.querySelectorAll('h1, h2, h3, h4').forEach(heading => {
          const text = heading.textContent?.trim() ?? ''
          const lower = text.toLowerCase()
          if (keywords.some(kw => lower.includes(kw)) && text.length < 80) {
            candidates.add(text)
          }
        })
      }

      // Strategy 3: list items inside a section/div with a service keyword heading
      if (candidates.size === 0) {
        document.querySelectorAll('section, div').forEach(section => {
          const heading = section.querySelector('h1, h2, h3, h4')
          if (!heading) return
          const headingText = heading.textContent?.toLowerCase() ?? ''
          if (!keywords.some(kw => headingText.includes(kw))) return
          section.querySelectorAll('li').forEach(li => {
            const text = li.textContent?.trim() ?? ''
            if (text.length > 2 && text.length < 80) candidates.add(text)
          })
        })
      }

      // Strategy 4: divs/spans/p elements inside sections with keyword headings
      // Handles grid/card layouts that don't use <li>
      if (candidates.size === 0) {
        document.querySelectorAll('section, div').forEach(section => {
          const heading = section.querySelector('h1, h2, h3, h4')
          if (!heading) return
          const headingText = heading.textContent?.toLowerCase() ?? ''
          if (!keywords.some(kw => headingText.includes(kw))) return

          // Look for direct child divs/spans/p that contain short service text
          section.querySelectorAll('div > p, div > span, div > div, article, .card, .item, .tile').forEach(item => {
            const text = item.textContent?.trim() ?? ''
            // Only pick up short, leaf-level text that looks like a service name
            if (text.length > 3 && text.length < 80 && !item.querySelector('p, h1, h2, h3, h4')) {
              candidates.add(text)
            }
          })
        })
      }

      // Strategy 5: elements with class names matching card/item/tile patterns in any section
      if (candidates.size === 0) {
        document.querySelectorAll(
          '[class*="item"], [class*="card"], [class*="tile"], [class*="box"]'
        ).forEach(el => {
          // Only pick up elements that are inside a section/div that has a keyword heading
          let parent = el.parentElement
          while (parent) {
            const heading = parent.querySelector('h1, h2, h3, h4')
            if (heading) {
              const headingText = heading.textContent?.toLowerCase() ?? ''
              if (keywords.some(kw => headingText.includes(kw))) {
                const text = el.textContent?.trim() ?? ''
                if (text.length > 3 && text.length < 80 && !el.querySelector('p, h1, h2, h3, h4')) {
                  candidates.add(text)
                }
                break
              }
            }
            parent = parent.parentElement
          }
        })
      }

      return [...candidates].slice(0, 20)
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
        .slice(0, 5)
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
 * but no scraped services yet. Resumable — re-running skips already-processed rows.
 * Also re-processes businesses that previously returned empty results (services = []).
 */
async function scrapeServices() {
  const supabase = createAdminClient()

  // Fetch businesses that need scraping:
  // - services IS NULL (never scraped)
  // - OR services has no entries with source = 'scraped' (only google-imported or empty)
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, website, slug, services')
    .eq('status', 'active')
    .not('website', 'is', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch businesses:', error.message)
    process.exit(1)
  }

  // Filter to only businesses that don't already have scraped services
  const needsScraping = (businesses ?? []).filter(biz => {
    if (!biz.services) return true // never processed
    const services = biz.services as Array<{ name: string; source: string }>
    if (!Array.isArray(services) || services.length === 0) return true // empty result, retry
    return !services.some(s => s.source === 'scraped') // has services but none scraped yet
  })

  if (needsScraping.length === 0) {
    console.log('ℹ️  No businesses need scraping (all have scraped services data or no website).')
    return
  }

  console.log(`🔍 Scraping ${needsScraping.length} businesses...\n`)

  const browser = await chromium.launch({ headless: true })

  try {
    let successCount = 0
    let failCount    = 0

    for (let i = 0; i < needsScraping.length; i += BATCH_SIZE) {
      const batch = needsScraping.slice(i, i + BATCH_SIZE)

      await Promise.allSettled(
        batch.map(async (biz, batchIdx) => {
          const globalIdx = i + batchIdx + 1
          const url = biz.website!.startsWith('http') ? biz.website! : `https://${biz.website}`
          console.log(`  [${globalIdx}/${needsScraping.length}] ${biz.name}`)

          const scraped = await scrapePage(url, browser)

          // Merge scraped services with existing (non-scraped) services, deduplicating by name
          const existingServices = Array.isArray(biz.services)
            ? (biz.services as Array<{ name: string; source: string }>).filter(s => s.source !== 'scraped')
            : []
          const existingNames = new Set(existingServices.map(s => s.name.toLowerCase()))
          const newScraped = scraped.services.filter(s => !existingNames.has(s.name.toLowerCase()))
          const mergedServices = [...existingServices, ...newScraped]

          const { error: updateErr } = await supabase
            .from('businesses')
            .update({ services: mergedServices })
            .eq('id', biz.id)

          if (updateErr) {
            console.warn(`    ⚠️  DB update failed: ${updateErr.message}`)
            failCount++
          } else {
            if (scraped.services.length > 0) {
              console.log(`    ✅ ${scraped.services.length} scraped services found (${existingServices.length} existing preserved)`)
              successCount++
            } else {
              console.log(`    ○  No scraped services found`)
              failCount++
            }
          }

          // Insert extra photos (skip duplicates by checking existing images)
          if (scraped.extra_photos.length > 0) {
            const imageRows = scraped.extra_photos.map((photoUrl, idx) => ({
              business_id: biz.id,
              url: photoUrl,
              alt_text: `${biz.name} photo ${idx + 2}`,
              is_primary: false,
              sort_order: idx + 1,
            }))
            const { error: imgErr } = await supabase
              .from('business_images')
              .upsert(imageRows, { onConflict: 'business_id,url', ignoreDuplicates: true })
            if (imgErr) {
              console.warn(`    ⚠️  Image insert failed: ${imgErr.message}`)
            } else {
              console.log(`    📷 ${imageRows.length} extra photo(s) saved`)
            }
          }
        })
      )

      // Pause between batches to be polite to servers
      if (i + BATCH_SIZE < needsScraping.length) {
        await new Promise(r => setTimeout(r, BATCH_PAUSE_MS))
      }
    }

    console.log(`\n🎉 Scraping complete!`)
    console.log(`   Services found: ${successCount} / ${needsScraping.length}`)
    console.log(`   No data found:  ${failCount} / ${needsScraping.length}`)
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
