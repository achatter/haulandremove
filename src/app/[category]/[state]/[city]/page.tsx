import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { getBusinessesByCategoryAndCity } from '@/lib/db/businesses'
import { CATEGORIES, CITIES_BY_STATE, US_STATES } from '@/lib/constants'
import { toSlug, fromSlug, categorySlugToKey } from '@/lib/utils'

interface PageProps {
  params: Promise<{ category: string; state: string; city: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function resolveCityName(stateAbbr: string, citySlug: string): string | null {
  const cities = CITIES_BY_STATE[stateAbbr.toUpperCase()]
  if (cities) {
    const match = cities.find(c => toSlug(c) === citySlug)
    if (match) return match
  }
  return fromSlug(citySlug)
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
  const { category: categorySlug, state: stateSlug, city: citySlug } = await params
  const categoryKey = categorySlugToKey(categorySlug)
  if (!categoryKey) return {}

  const stateAbbr = stateSlug.toUpperCase()
  const stateObj = US_STATES.find(s => s.abbr === stateAbbr)
  const stateName = stateObj?.name ?? stateAbbr
  const cityName = resolveCityName(stateAbbr, citySlug) ?? fromSlug(citySlug)
  const categoryLabel = CATEGORIES[categoryKey].label

  return {
    title: `${categoryLabel} in ${cityName}, ${stateAbbr}`,
    description: `Find trusted ${categoryLabel.toLowerCase()} professionals in ${cityName}, ${stateName}. Browse ratings, reviews, and contact information.`,
  }
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { category: categorySlug, state: stateSlug, city: citySlug } = await params
  const sp = await searchParams

  const categoryKey = categorySlugToKey(categorySlug)
  if (!categoryKey) notFound()

  const stateAbbr = stateSlug.toUpperCase()
  const stateObj = US_STATES.find(s => s.abbr === stateAbbr)
  const stateName = stateObj?.name ?? stateAbbr
  const cityName = resolveCityName(stateAbbr, citySlug) ?? fromSlug(citySlug)
  const categoryLabel = CATEGORIES[categoryKey].label

  const page = typeof sp.page === 'string' ? sp.page : '1'
  const sort = (typeof sp.sort === 'string' ? sp.sort : 'rating') as 'rating' | 'name' | 'newest'

  const businesses = await getBusinessesByCategoryAndCity(categoryKey, stateAbbr, cityName)

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {categoryLabel} in {cityName}, {stateAbbr}
        </h1>
        <p className="text-muted-foreground mb-4">
          Find trusted {categoryLabel.toLowerCase()} professionals in {cityName}, {stateName}.
        </p>
        <SearchBar currentCategory={categoryKey} />
      </div>
      <SearchResults
        businesses={businesses}
        count={businesses.length}
        params={{ category: categoryKey, state: stateAbbr, city: cityName, sort, page }}
      />
    </Container>
  )
}
