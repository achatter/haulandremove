import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { getBusinessesByCategoryAndCity } from '@/lib/db/businesses'
import { CATEGORIES, CITIES_BY_STATE } from '@/lib/constants'
import { toSlug, fromSlug, categorySlugToKey } from '@/lib/utils'

interface PageProps {
  params: Promise<{ category: string; state: string; city: string }>
}

function resolveCityName(stateAbbr: string, citySlug: string): string {
  const cities = CITIES_BY_STATE[stateAbbr.toUpperCase()] ?? []
  const match = cities.find(c => toSlug(c) === citySlug)
  return match ?? fromSlug(citySlug)
}

export async function generateStaticParams() {
  const params: { category: string; state: string; city: string }[] = []
  for (const categorySlug of ['junk-removal', 'estate-cleanout']) {
    for (const [stateAbbr, cities] of Object.entries(CITIES_BY_STATE)) {
      for (const city of cities) {
        params.push({
          category: categorySlug,
          state: stateAbbr.toLowerCase(),
          city: toSlug(city),
        })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, state, city: citySlug } = await params
  const categoryKey = categorySlugToKey(categorySlug)
  if (!categoryKey) return {}

  const categoryLabel = CATEGORIES[categoryKey].label
  const cityName = resolveCityName(state, citySlug)
  const stateUpper = state.toUpperCase()

  return {
    title: `${categoryLabel} in ${cityName}, ${stateUpper}`,
    description: `Find trusted ${categoryLabel.toLowerCase()} professionals in ${cityName}, ${stateUpper}. Browse ratings, reviews, and contact information for local providers.`,
  }
}

export default async function CityPage({ params }: PageProps) {
  const { category: categorySlug, state, city: citySlug } = await params
  const categoryKey = categorySlugToKey(categorySlug)
  if (!categoryKey) notFound()

  const categoryLabel = CATEGORIES[categoryKey].label
  const cityName = resolveCityName(state, citySlug)
  const stateUpper = state.toUpperCase()

  const businesses = await getBusinessesByCategoryAndCity(categoryKey, stateUpper, cityName)

  const searchParams = {
    category: categoryKey,
    state: stateUpper,
    city: cityName,
    sort: 'rating' as const,
    page: '1',
  }

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {categoryLabel} in {cityName}, {stateUpper}
        </h1>
        <p className="text-muted-foreground mb-4">
          Find trusted {categoryLabel.toLowerCase()} professionals in {cityName}, {stateUpper}.
        </p>
        <SearchBar currentCategory={categoryKey} />
      </div>
      <SearchResults businesses={businesses} count={businesses.length} params={searchParams} />
    </Container>
  )
}
