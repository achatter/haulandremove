import type { MetadataRoute } from 'next'
import { getDistinctCitiesForSitemap } from '@/lib/db/businesses'
import { toSlug } from '@/lib/utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://haulandremove.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/categories/junk-removal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/categories/estate-cleanout`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  const cityRows = await getDistinctCitiesForSitemap()

  const CATEGORY_SLUG: Record<string, string> = {
    junk_removal: 'junk-removal',
    estate_cleanout: 'estate-cleanout',
  }

  const cityPages: MetadataRoute.Sitemap = cityRows
    .filter(row => CATEGORY_SLUG[row.category])
    .map(row => ({
      url: `${BASE_URL}/${CATEGORY_SLUG[row.category]}/${row.state.toLowerCase()}/${toSlug(row.city)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticPages, ...cityPages]
}
