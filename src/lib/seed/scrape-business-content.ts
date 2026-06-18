import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { chromium, Browser, Page } from 'playwright'
import { createAdminClient } from '../supabase/admin'
import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'

const BATCH_SIZE = 5
const PAGE_TIMEOUT_MS = 15_000
const BATCH_PAUSE_MS = 2_500
const TRACKING_FILE = 'run_tracking_business_content.json'
const MAX_TEXT_CHARS = 6_000

interface ExtractedContent {
  description: string | null
  services: Array<{ name: string; description?: string; source: 'scraped' }> | null
  working_hours: Record<string, string | null> | null
  booking_url: string | null
}

interface TrackingData {
  started_at: string
  last_run_at: string
  completed: string[]
  failed: string[]
}

function loadTracking(): TrackingData {
  if (fs.existsSync(TRACKING_FILE)) {
    return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'))
  }
  return {
    started_at: new Date().toISOString(),
    last_run_at: new Date().toISOString(),
    completed: [],
    failed: [],
  }
}

function saveTracking(data: TrackingData) {
  data.last_run_at = new Date().toISOString()
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2))
}

async function getPageText(url: string, browser: Browser): Promise<string | null> {
  let page: Page | null = null
  try {
    page = await browser.newPage()
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS })

    const text = await page.evaluate(() => {
      document.querySelectorAll('script, style, noscript, nav, footer, header').forEach(el => el.remove())
      return (document.body?.innerText ?? document.body?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim()
    })

    return text.slice(0, MAX_TEXT_CHARS)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`    ⚠️  Page load failed: ${msg.split('\n')[0]}`)
    return null
  } finally {
    if (page) await page.close().catch(() => {})
  }
}

async function extractWithClaude(
  client: Anthropic,
  businessName: string,
  pageText: string
): Promise<ExtractedContent> {
  const prompt = `Extract structured business info from this website text for a hauling/removal services directory.

Business: ${businessName}

Website text:
${pageText}

Return ONLY valid JSON (no markdown, no explanation):
{
  "description": "1-3 sentence factual description of what this business does, or null",
  "services": [{"name": "service name", "description": "optional brief detail"}],
  "working_hours": {
    "Monday": "9am-5pm", "Tuesday": "9am-5pm", "Wednesday": "9am-5pm",
    "Thursday": "9am-5pm", "Friday": "9am-5pm", "Saturday": "Closed", "Sunday": null
  },
  "booking_url": "https://..."
}

Rules:
- description: factual only, no marketing fluff. null if unclear.
- services: up to 15 specific services actually mentioned. Empty array [] if none found.
- working_hours: all 7 days. null = no info found, "Closed" = explicitly closed.
- booking_url: full URL to book/schedule/appointment page, or null.`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  // Strip markdown fences if present
  const jsonText = rawText.startsWith('```')
    ? (rawText.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? rawText)
    : rawText

  try {
    const parsed = JSON.parse(jsonText)
    return {
      description: typeof parsed.description === 'string' && parsed.description.length > 10
        ? parsed.description
        : null,
      services:
        Array.isArray(parsed.services) && parsed.services.length > 0
          ? parsed.services
              .filter((s: { name?: string }) => typeof s.name === 'string' && s.name.length > 1)
              .map((s: { name: string; description?: string }) => ({
                name: s.name,
                ...(s.description ? { description: s.description } : {}),
                source: 'scraped' as const,
              }))
          : null,
      working_hours:
        parsed.working_hours && typeof parsed.working_hours === 'object'
          ? parsed.working_hours
          : null,
      booking_url:
        typeof parsed.booking_url === 'string' && parsed.booking_url.startsWith('http')
          ? parsed.booking_url
          : null,
    }
  } catch {
    console.warn(`    ⚠️  Failed to parse Claude response`)
    return { description: null, services: null, working_hours: null, booking_url: null }
  }
}

async function run() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in .env.local')
    process.exit(1)
  }

  const supabase = createAdminClient()
  const anthropic = new Anthropic({ apiKey })
  const tracking = loadTracking()
  const completedSet = new Set(tracking.completed)

  console.log('Fetching businesses with website but no description...')
  const allBizs: Array<{ id: string; name: string; website: string; category: string }> = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, website, category')
      .not('website', 'is', null)
      .or('description.is.null,description.eq.')
      .eq('status', 'active')
      .range(from, from + 999)
    if (error) throw new Error(error.message)
    allBizs.push(...((data as typeof allBizs) ?? []))
    if (!data || data.length < 1000) break
    from += 1000
  }

  const toProcess = allBizs.filter(b => !completedSet.has(b.id))
  console.log(`  ${allBizs.length} total (null/empty description)`)
  console.log(`  ${completedSet.size} already completed`)
  console.log(`  ${toProcess.length} to process\n`)

  if (toProcess.length === 0) {
    console.log('✅ Nothing left to process.')
    return
  }

  const browser = await chromium.launch({ headless: true })
  let succeeded = 0
  let noData = 0
  let errored = 0

  try {
    for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
      const batch = toProcess.slice(i, i + BATCH_SIZE)

      for (const biz of batch) {
        const globalIdx = i + batch.indexOf(biz) + 1
        const url = biz.website.startsWith('http') ? biz.website : `https://${biz.website}`
        console.log(`  [${globalIdx}/${toProcess.length}] ${biz.name} (${biz.category})`)

        const pageText = await getPageText(url, browser)
        if (!pageText || pageText.length < 100) {
          console.log(`    ○  No usable text`)
          tracking.failed.push(biz.id)
          saveTracking(tracking)
          noData++
          continue
        }

        const extracted = await extractWithClaude(anthropic, biz.name, pageText)
        const updates: Record<string, unknown> = {}
        if (extracted.description) updates.description = extracted.description
        if (extracted.services) updates.services = extracted.services
        if (extracted.working_hours) updates.working_hours = extracted.working_hours
        if (extracted.booking_url) updates.booking_url = extracted.booking_url

        if (Object.keys(updates).length === 0) {
          console.log(`    ○  Nothing extracted`)
          tracking.failed.push(biz.id)
          noData++
        } else {
          const { error } = await supabase.from('businesses').update(updates).eq('id', biz.id)
          if (error) {
            console.warn(`    ⚠️  DB update failed: ${error.message}`)
            tracking.failed.push(biz.id)
            errored++
          } else {
            console.log(`    ✅ ${Object.keys(updates).join(', ')}`)
            tracking.completed.push(biz.id)
            succeeded++
          }
        }

        saveTracking(tracking)
      }

      if (i + BATCH_SIZE < toProcess.length) {
        await new Promise(r => setTimeout(r, BATCH_PAUSE_MS))
      }
    }
  } finally {
    await browser.close()
  }

  console.log(`\n🎉 Done!`)
  console.log(`   Extracted data: ${succeeded}`)
  console.log(`   No data found:  ${noData}`)
  console.log(`   Errors:         ${errored}`)
  console.log(`   Total:          ${toProcess.length}`)
}

run().catch(err => {
  console.error('❌', err)
  process.exit(1)
})
