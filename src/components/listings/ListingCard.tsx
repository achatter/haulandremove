import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CategoryBadge } from './CategoryBadge'
import { StarRating } from '@/components/reviews/StarRating'
import type { Business } from '@/types'
import { formatPhone, formatRating } from '@/lib/utils'

interface ListingCardProps {
  business: Business
}

export function ListingCard({ business }: ListingCardProps) {
  const primaryImage = business.images?.find((img) => img.is_primary) ?? business.images?.[0]

  return (
    <Link href={`/listings/${business.slug}`} className="group block">
      <Card className="overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
        {/* Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <span className="text-zinc-400 text-sm">No image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={business.category} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {business.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={business.average_rating} size="sm" />
            <span className="text-sm font-medium">{formatRating(business.average_rating)}</span>
            <span className="text-sm text-muted-foreground">({business.review_count})</span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{business.city}, {business.state}</span>
          </div>

          {business.phone && (
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{formatPhone(business.phone)}</span>
            </div>
          )}

          {(business.insured || business.bonded) && (
            <div className="flex items-center gap-1 mt-2">
              <Shield className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs text-green-700 font-medium">
                {[business.insured && 'Insured', business.bonded && 'Bonded'].filter(Boolean).join(' & ')}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
