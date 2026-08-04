import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { searchBusinesses } from '@/lib/db/businesses'
import { CATEGORIES, CITIES_BY_STATE } from '@/lib/constants'
import { isCityState, parseCityState, toSlug, stateAbbrToSlug } from '@/lib/utils'
import type { SearchParams } from '@/types'

// If the query resolves to a known city and a specific category is selected,
// send the user to the canonical city landing page (richer content, same listings)
// instead of the generic results grid.
function resolveCityPageRedirect(params: SearchParams): string | null {
  if (!params.q || !params.category || !isCityState(params.q)) return null

  const { city, state } = parseCityState(params.q)
  const matchedCity = (CITIES_BY_STATE[state] ?? []).find(
    c => c.toLowerCase() === city.toLowerCase()
  )
  if (!matchedCity) return null

  const categorySlug = CATEGORIES[params.category as keyof typeof CATEGORIES].slug
  const stateSlug = stateAbbrToSlug(state)
  return `/${categorySlug}/${stateSlug}/${toSlug(matchedCity)}`
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  return {
    title: q ? `Search: ${q}` : 'Browse All Services',
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const params: SearchParams = {
    q: typeof sp.q === 'string' ? sp.q : undefined,
    category: typeof sp.category === 'string' ? (sp.category as SearchParams['category']) : undefined,
    sort: typeof sp.sort === 'string' ? (sp.sort as SearchParams['sort']) : 'rating',
    page: typeof sp.page === 'string' ? sp.page : '1',
  }

  const cityPageRedirect = resolveCityPageRedirect(params)
  if (cityPageRedirect) redirect(cityPageRedirect)

  const { businesses, count, categoryFallback } = await searchBusinesses(params)

  const categoryInfo = params.category ? CATEGORIES[params.category as keyof typeof CATEGORIES] : null

  return (
    <Container className="py-10">
      <div className="mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors underline underline-offset-4">Home</Link>
          {categoryInfo && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/categories/${categoryInfo.slug}`} className="hover:text-foreground transition-colors underline underline-offset-4">
                {categoryInfo.label}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-foreground font-medium">
            {params.q ? `Results for "${params.q}"` : 'Browse All Services'}
          </span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {params.q ? `Results for "${params.q}"` : 'Browse All Services'}
        </h1>
        <SearchBar
          initialQuery={params.q ?? ''}
          currentCategory={params.category ?? ''}
        />
      </div>

      <SearchResults businesses={businesses} count={count} params={params} categoryFallback={categoryFallback} />
    </Container>
  )
}
