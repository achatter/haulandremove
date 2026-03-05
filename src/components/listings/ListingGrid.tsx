import { ListingCard } from './ListingCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Business } from '@/types'

interface ListingGridProps {
  businesses: Business[]
}

export function ListingGrid({ businesses }: ListingGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">No businesses found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Try a different search term or adjust your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <ListingCard key={business.id} business={business} />
      ))}
    </div>
  )
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden shadow-sm">
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
