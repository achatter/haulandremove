import { Suspense } from 'react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { SearchFilters } from './SearchFilters'
import type { Business, SearchParams } from '@/types'

interface SearchResultsProps {
  businesses: Business[]
  count: number
  params: SearchParams
}

export function SearchResults({ businesses, count, params }: SearchResultsProps) {
  const showing = Math.min(businesses.length, count)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {count === 0
            ? 'No results found'
            : `Showing ${showing} of ${count} result${count !== 1 ? 's' : ''}`}
          {params.q && (
            <span> for &ldquo;<strong className="text-foreground">{params.q}</strong>&rdquo;</span>
          )}
        </p>
        <Suspense fallback={null}>
          <SearchFilters />
        </Suspense>
      </div>

      <ListingGrid businesses={businesses} />
    </div>
  )
}
