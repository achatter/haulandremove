import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { searchBusinesses } from '@/lib/db/businesses'

export const metadata: Metadata = {
  title: 'Estate Cleanout Services',
  description:
    'Find professional estate cleanout services near you. Browse ratings, reviews, and contact information.',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EstateCleanoutPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const params = {
    category: 'estate_cleanout' as const,
    state: typeof sp.state === 'string' ? sp.state : undefined,
    sort: (typeof sp.sort === 'string' ? sp.sort : 'rating') as 'rating' | 'name' | 'newest',
    page: typeof sp.page === 'string' ? sp.page : '1',
  }

  const { businesses, count } = await searchBusinesses(params)

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Estate Cleanout Services</h1>
        <p className="text-muted-foreground mb-4">
          Professional estate cleanout services for homes, offices, and property transitions nationwide.
        </p>
        <SearchBar currentCategory="estate_cleanout" />
      </div>
      <SearchResults businesses={businesses} count={count} params={params} />
    </Container>
  )
}
