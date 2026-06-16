import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import * as fs from 'fs'
import * as path from 'path'
import { createAdminClient } from '../supabase/admin'

const OUT_PATH = path.join(process.cwd(), 'missing-estate-photos-queries.csv')

async function run() {
  const supabase = createAdminClient()

  console.log('🔍 Fetching estate_cleanout businesses…')
  const allBizs: Array<{ id: string; name: string; city: string; state: string; state_full: string; phone: string | null; website: string | null }> = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, city, state, state_full, phone, website')
      .eq('category', 'estate_cleanout')
      .range(from, from + 999)
    if (error) throw new Error(`Fetch businesses: ${error.message}`)
    allBizs.push(...(data ?? []))
    if (!data || data.length < 1000) break
    from += 1000
  }
  console.log(`  ${allBizs.length} estate_cleanout businesses total`)

  console.log('🔍 Checking which still have only a placeholder photo…')
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
  console.log(`  ${targets.length} businesses still need a real photo`)

  const headers = ['query', 'name', 'city', 'state_code', 'phone', 'website']
  const lines = [headers.join(',')]

  for (const b of targets) {
    const query = `${b.name} ${b.city} ${b.state}`
    const row = [
      `"${query.replace(/"/g, '""')}"`,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.city.replace(/"/g, '""')}"`,
      b.state,
      b.phone ?? '',
      b.website ?? '',
    ]
    lines.push(row.join(','))
  }

  fs.writeFileSync(OUT_PATH, lines.join('\n'), 'utf8')
  console.log(`\n✅ Exported to: missing-estate-photos-queries.csv`)
  console.log(`   ${targets.length} rows written`)
  console.log(`\nNext steps:`)
  console.log(`  1. Upload missing-estate-photos-queries.csv to Outscraper Google Maps Scraper`)
  console.log(`     (use the 'query' column as search input, enable Photos option)`)
  console.log(`  2. Download the results CSV and save it as: Estate_Cleanout_Cleaned.csv`)
  console.log(`  3. Run: npm run restore-estate-images`)
}

run().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
