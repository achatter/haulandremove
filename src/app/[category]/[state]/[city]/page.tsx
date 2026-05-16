import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { getBusinessesByCategoryAndCity } from '@/lib/db/businesses'
import { CATEGORIES, CITIES_BY_STATE } from '@/lib/constants'
import { toSlug, fromSlug, categorySlugToKey, stateSlugToAbbr, stateAbbrToSlug } from '@/lib/utils'

interface PageProps {
  params: Promise<{ category: string; state: string; city: string }>
}

function resolveCityName(stateAbbr: string, citySlug: string): string {
  const cities = CITIES_BY_STATE[stateAbbr] ?? []
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
          state: stateAbbrToSlug(stateAbbr), // e.g. "california" not "ca"
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
  const stateAbbr = stateSlugToAbbr(stateSlug)
  if (!categoryKey || !stateAbbr) return {}

  const categoryLabel = CATEGORIES[categoryKey].label
  const cityName = resolveCityName(stateAbbr, citySlug)

  const title = `Best ${categoryLabel} in ${cityName}, ${stateAbbr}`
  const description = `Find trusted ${categoryLabel.toLowerCase()} companies in ${cityName}, ${stateAbbr}. Compare local providers, read verified reviews, and get free quotes.`
  const url = `https://junkremovalsearch.com/${categorySlug}/${stateSlug}/${citySlug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function CityPage({ params }: PageProps) {
  const { category: categorySlug, state: stateSlug, city: citySlug } = await params
  const categoryKey = categorySlugToKey(categorySlug)
  if (!categoryKey) notFound()

  const stateAbbr = stateSlugToAbbr(stateSlug)
  if (!stateAbbr) notFound()

  const categoryLabel = CATEGORIES[categoryKey].label
  const cityName = resolveCityName(stateAbbr, citySlug)
  const stateFull = stateSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const { businesses, categoryFallback } = await getBusinessesByCategoryAndCity(categoryKey, stateAbbr, cityName)

  const searchParams = {
    category: categoryKey,
    state: stateAbbr,
    city: cityName,
    sort: 'rating' as const,
    page: '1',
  }

  return (
    <Container className="py-10">
      <div className="mb-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors underline underline-offset-4">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/categories/${categorySlug}`} className="hover:text-foreground transition-colors underline underline-offset-4">
            {categoryLabel}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${categorySlug}/${stateSlug}`} className="hover:text-foreground transition-colors underline underline-offset-4">
            {stateFull}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium">{cityName}</span>
        </nav>
        
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {categoryLabel} in {cityName}, {stateAbbr}
        </h1>
        <p className="text-muted-foreground mb-4">
          Find trusted {categoryLabel.toLowerCase()} professionals in {cityName}, {stateAbbr}.
        </p>
        <SearchBar currentCategory={categoryKey} />
      </div>
      <SearchResults businesses={businesses} count={businesses.length} params={searchParams} categoryFallback={categoryFallback} />
    </Container>
  )
}
