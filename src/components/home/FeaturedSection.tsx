import Link from 'next/link'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Business } from '@/types'

interface FeaturedSectionProps {
  businesses: Business[]
}

export function FeaturedSection({ businesses }: FeaturedSectionProps) {
  if (businesses.length === 0) return null

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">
            <span className="w-6 h-px bg-indigo-400 inline-block" />
            Top Rated
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Featured Businesses</h2>
          <p className="text-slate-500 mt-1">Highly rated hauling &amp; removal services</p>
        </div>
        <Link
          href="/search"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <ListingCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  )
}
