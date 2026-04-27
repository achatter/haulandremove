import type { MetadataRoute } from 'next'
import { getDistinctCitiesForSitemap } from '@/lib/db/businesses'
import { CATEGORIES } from '@/lib/constants'
import { toSlug, stateAbbrToSlug } from '@/lib/utils'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://junkremovalsearch.com').trim()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...Object.values(CATEGORIES).map(cat => ({
      url: `${BASE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  let cityPages: MetadataRoute.Sitemap = []
  try {
    const cities = await getDistinctCitiesForSitemap()
    cityPages = cities.map(({ category, state, city }) => {
      const categorySlug = Object.values(CATEGORIES).find(c =>
        // category DB key uses underscores, e.g. 'junk_removal'
        c.slug.replace(/-/g, '_') === category
      )?.slug ?? category.replace(/_/g, '-')

      return {
        url: `${BASE_URL}/${categorySlug}/${stateAbbrToSlug(state)}/${toSlug(city)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })
  } catch {
    // If DB is unavailable during build, return only static pages
  }

  return [...staticPages, ...cityPages]
}
