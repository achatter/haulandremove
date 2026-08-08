import { ImageGallery } from './ImageGallery'
import { CategoryBadge } from './CategoryBadge'
import { BusinessMeta } from './BusinessMeta'
import { BusinessAttributes } from './BusinessAttributes'
import { BusinessHours } from './BusinessHours'
import { ServicesList } from './ServicesList'
import { ReviewsModal } from '@/components/reviews/ReviewsModal'
import type { Business, Review } from '@/types'

interface ListingDetailProps {
  business: Business
  reviews: Review[]
}

export function ListingDetail({ business, reviews }: ListingDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Images + Description */}
      <div className="lg:col-span-2 space-y-6">
        {business.images && business.images.length > 0 && (
          <ImageGallery images={business.images} businessName={business.name} />
        )}

        <div>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{business.name}</h1>
              <div className="mt-2">
                <ReviewsModal
                  rating={business.average_rating}
                  reviewCount={business.review_count}
                  reviews={reviews}
                  googleMapsUrl={business.google_maps_url}
                />
              </div>
            </div>
            <CategoryBadge category={business.category} className="mt-1" />
          </div>

          {business.description && (
            <BusinessAttributes description={business.description} />
          )}
        </div>

        {business.working_hours && (
          <div className="border rounded-xl p-5 bg-muted/30">
            <BusinessHours hours={business.working_hours} />
          </div>
        )}

        {business.services && business.services.length > 0 && (
          <ServicesList services={business.services} />
        )}

        {business.attributes && Object.keys(business.attributes).length > 0 && (
          <div className="border rounded-xl p-5 bg-muted/30 space-y-4">
            {Object.entries(business.attributes).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-foreground mb-2">{category}</h3>
                <ul className="space-y-1">
                  {Object.entries(items).map(([label, value]) => (
                    <li key={label} className="flex items-center gap-2 text-sm">
                      {value ? (
                        <span className="text-green-600" aria-hidden="true">✓</span>
                      ) : (
                        <span className="text-muted-foreground" aria-hidden="true">✗</span>
                      )}
                      <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Contact/Meta */}
      <div className="lg:col-span-1">
        <div className="border rounded-xl p-5 bg-white shadow-sm sticky top-20">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
            Business Info
          </h2>
          <BusinessMeta business={business} />
        </div>
      </div>
    </div>
  )
}
