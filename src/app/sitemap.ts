import type { MetadataRoute } from 'next'
import { getDistinctCitiesForSitemap } from '@/lib/db/businesses'
import { toSlug } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://junkremovalsearch.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/categories/junk-removal`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/categories/estate-cleanout`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/search`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const cityRecords = await getDistinctCitiesForSitemap()

  const cityPages: MetadataRoute.Sitemap = cityRecords.map(({ category, state, city }) => {
    const catSlug = category === 'junk_removal' ? 'junk-removal' : 'estate-cleanout'
    return {
      url: `${BASE_URL}/${catSlug}/${state.toLowerCase()}/${toSlug(city)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...cityPages]
}
