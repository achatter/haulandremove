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
      <div className="flex items-end justify-between mb-10 border-t-2 border-slate-900 pt-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Top Rated</p>
          <h2 className="font-serif text-4xl font-bold text-slate-900">Featured Businesses</h2>
          <p className="text-slate-500 mt-2 text-base">Highly rated hauling &amp; removal services nationwide</p>
        </div>
        <Link
          href="/search"
          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors border-b-2 border-slate-900 hover:border-blue-600 pb-0.5 whitespace-nowrap"
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
