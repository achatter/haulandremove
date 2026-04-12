import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { searchBusinesses } from '@/lib/db/businesses'
import type { SearchParams } from '@/types'

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
    state: typeof sp.state === 'string' ? sp.state : undefined,
    city: typeof sp.city === 'string' ? sp.city : undefined,
    sort: typeof sp.sort === 'string' ? (sp.sort as SearchParams['sort']) : 'rating',
    page: typeof sp.page === 'string' ? sp.page : '1',
  }

  const { businesses, count } = await searchBusinesses(params)

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {params.q ? `Results for "${params.q}"` : 'Browse All Services'}
        </h1>
        <SearchBar
          initialQuery={params.q ?? ''}
          currentCategory={params.category ?? ''}
          currentState={params.state ?? ''}
        />
      </div>

      <SearchResults businesses={businesses} count={count} params={params} />
    </Container>
  )
}
