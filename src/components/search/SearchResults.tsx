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
  categoryFallback?: boolean
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

export function SearchResults({ businesses, count, params, categoryFallback }: SearchResultsProps) {
  const showing = Math.min(businesses.length, count)
  const categoryLabel = params.category
    ? (CATEGORIES[params.category as keyof typeof CATEGORIES]?.label ?? params.category)
    : null

  return (
    <div className="space-y-6">
      {categoryFallback && categoryLabel && (
        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-4 py-2">
          No <strong>{categoryLabel}</strong> providers found{params.q ? ` for "${params.q}"` : ''}.
          Showing all available services instead who might be able to provide <strong>{categoryLabel}</strong>.
        </div>
      )}
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
