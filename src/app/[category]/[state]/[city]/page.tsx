import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { getBusinessesByCategoryAndCity } from '@/lib/db/businesses'
import { CATEGORIES, US_STATES, CITIES_BY_STATE } from '@/lib/constants'
import { toSlug, fromSlug, categorySlugToKey } from '@/lib/utils'
import type { Category } from '@/types'

interface PageProps {
  params: Promise<{ category: string; state: string; city: string }>
}

function resolvePage(p: { category: string; state: string; city: string }) {
  const categoryKey = categorySlugToKey(p.category)
  if (!categoryKey) return null

  const stateInfo = US_STATES.find(s => s.abbr.toLowerCase() === p.state.toLowerCase())
  if (!stateInfo) return null

  const categoryInfo = CATEGORIES[categoryKey]

  // Resolve exact city name from constants; fall back to fromSlug for unlisted cities
  const citiesForState = CITIES_BY_STATE[stateInfo.abbr]
  const cityName = citiesForState?.find(c => toSlug(c) === p.city) ?? fromSlug(p.city)

  return { categoryKey, categoryInfo, stateInfo, cityName }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params
  const resolved = resolvePage(p)
  if (!resolved) return { title: 'Not Found' }

  const { categoryInfo, stateInfo, cityName } = resolved
  return {
    title: `${categoryInfo.label} in ${cityName}, ${stateInfo.name}`,
    description: `Find trusted ${categoryInfo.label.toLowerCase()} professionals in ${cityName}, ${stateInfo.name}. Browse ratings, reviews, and contact information.`,
  }
}

export async function generateStaticParams() {
  const params = []
  for (const [stateAbbr, cities] of Object.entries(CITIES_BY_STATE)) {
    for (const city of cities) {
      for (const catInfo of Object.values(CATEGORIES)) {
        params.push({
          category: catInfo.slug,
          state: stateAbbr.toLowerCase(),
          city: toSlug(city),
        })
      }
    }
  }
  return params
}

export default async function CityPage({ params }: PageProps) {
  const p = await params
  const resolved = resolvePage(p)
  if (!resolved) notFound()

  const { categoryKey, categoryInfo, stateInfo, cityName } = resolved

  const { businesses, count } = await getBusinessesByCategoryAndCity(
    categoryKey,
    stateInfo.abbr,
    cityName,
  )

  const searchParams = {
    category: categoryKey as Category,
    state: stateInfo.abbr,
    city: cityName,
    sort: 'rating' as const,
    page: '1',
  }

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {categoryInfo.label} in {cityName}, {stateInfo.abbr}
        </h1>
        <p className="text-muted-foreground mb-4">
          {categoryInfo.description} in {cityName}, {stateInfo.name}.
        </p>
        <SearchBar currentCategory={categoryKey} />
      </div>
      <SearchResults businesses={businesses} count={count} params={searchParams} />
    </Container>
  )
}
