import { Suspense } from 'react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { SearchFilters } from './SearchFilters'
import type { Business, SearchParams } from '@/types'
import { CATEGORIES } from '@/lib/constants'
import { US_STATES } from '@/lib/constants'

interface SearchResultsProps {
  businesses: Business[]
  count: number
  params: SearchParams
}

function buildNoResultsMessage(params: SearchParams): string {
  const categoryLabel = params.category
    ? (CATEGORIES[params.category as keyof typeof CATEGORIES]?.label ?? params.category)
    : null
  const stateLabel = params.state
    ? (US_STATES.find((s) => s.abbr === params.state)?.name ?? params.state)
    : null
  const cityLabel = params.city ?? null

  const serviceText = categoryLabel ? `${categoryLabel} providers` : 'service providers'

  if (cityLabel && stateLabel) {
    return `No ${serviceText} found in ${cityLabel}, ${stateLabel}.`
  }
  if (stateLabel) {
    return `No ${serviceText} found in ${stateLabel}.`
  }
  if (params.q) {
    return `No ${serviceText} found for "${params.q}".`
  }
  return `No ${serviceText} found.`
}

export function SearchResults({ businesses, count, params }: SearchResultsProps) {
  const showing = Math.min(businesses.length, count)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {count === 0
            ? buildNoResultsMessage(params)
            : `Showing ${showing} of ${count} result${count !== 1 ? 's' : ''}`}
          {count > 0 && params.q && (
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
