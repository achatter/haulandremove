import { MapPin, Phone, Mail, Globe, Calendar, Shield, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import type { Business } from '@/types'
import { formatPhone } from '@/lib/utils'
import { SocialLinks } from './SocialLinks'

interface BusinessMetaProps {
  business: Business
}

export function BusinessMeta({ business }: BusinessMetaProps) {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
        <span>
          {business.street_address && `${business.street_address}, `}
          {business.city}, {business.state} {business.zip_code}
        </span>
      </div>

      {business.phone && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0 text-primary" />
          <a href={`tel:${business.phone}`} className="hover:text-foreground transition-colors">
            {formatPhone(business.phone)}
          </a>
        </div>
      )}

      {business.email && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0 text-primary" />
          <a href={`mailto:${business.email}`} className="hover:text-foreground transition-colors truncate">
            {business.email}
          </a>
        </div>
      )}

      {business.website && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4 shrink-0 text-primary" />
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors truncate"
          >
            {business.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}

      <Separator className="my-2" />

      {business.years_in_business != null && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 text-primary" />
          <span>{business.years_in_business} years in business</span>
        </div>
      )}

      {(business.insured || business.bonded) && (
        <div className="flex items-center gap-2 text-green-700">
          <Shield className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            {[business.insured && 'Insured', business.bonded && 'Bonded'].filter(Boolean).join(' & ')}
          </span>
        </div>
      )}

      {business.booking_url && (
        <>
          <Separator className="my-2" />
          <a
            href={business.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Book Appointment
          </a>
        </>
      )}

      {business.social_media && (
        <>
          <Separator className="my-2" />
          <SocialLinks social={business.social_media} />
        </>
      )}
    </div>
  )
}
