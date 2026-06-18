import Link from 'next/link'
import { MapPin, Phone, ArrowUpRight, Clock } from 'lucide-react'
import { StarRating } from '@/components/reviews/StarRating'
import type { Business, BusinessHours, ServiceItem } from '@/types'
import { formatPhone, formatRating } from '@/lib/utils'
import { ListingCardImage } from './ListingCardImage'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const

function getHoursSummary(hours: BusinessHours): string | null {
  const entries = DAYS.map(d => hours[d as keyof BusinessHours] ?? null)
  const open = entries.filter(v => v && v !== 'Closed')
  if (open.length === 0) return null
  const weekday = entries.slice(0, 5)
  const weekend = entries.slice(5)
  const weekdayUniform = weekday.every(v => v === weekday[0]) && weekday[0]
  const weekendClosed = weekend.every(v => !v || v === 'Closed')
  if (weekdayUniform && weekendClosed) return `Mon–Fri: ${weekday[0]}`
  const allSame = entries.every(v => v === entries[0]) && entries[0]
  if (allSame) return `Daily: ${entries[0]}`
  return `${open.length} days/week`
}

// Bold McKinsey-style tile palette
const tilePalette = [
  { bg: '#002B5B', accent: '#00C2C2' }, // deep navy / teal
  { bg: '#003D3D', accent: '#7EDDB0' }, // dark teal / mint
  { bg: '#1A1A2E', accent: '#7B8CDE' }, // midnight / periwinkle
  { bg: '#14213D', accent: '#60A5FA' }, // cobalt / sky
  { bg: '#0F3D3D', accent: '#34D399' }, // dark emerald / green
  { bg: '#1B0036', accent: '#C084FC' }, // deep purple / lavender
]

const categoryMeta: Record<string, { label: string; color: string }> = {
  'junk_removal':    { label: 'Junk Removal',    color: '#0891B2' },
  'estate_cleanout': { label: 'Estate Cleanout', color: '#2563EB' },
}

// Stable tile color derived from business id
function getTileIndex(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff
  return h % tilePalette.length
}

interface ListingCardProps {
  business: Business
}

export function ListingCard({ business }: ListingCardProps) {
  const sortedImages = [...(business.images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const primaryImage = sortedImages.find((img) => img.is_primary) ?? sortedImages[0]
  const tile = tilePalette[getTileIndex(business.id)]
  const cat = categoryMeta[business.category] ?? { label: business.category, color: '#2563EB' }

  return (
    <Link href={`/listings/${business.slug}`} className="group block h-full">
      <div className="h-full flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-xl">

        {/* ── Image / Color Tile ── */}
        <div className="relative overflow-hidden" style={{ height: 160 }}>
          {primaryImage ? (
            <ListingCardImage image={primaryImage} tileBg={tile.bg} tileAccent={tile.accent} businessName={business.name} />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: tile.bg }}>
              {/* Diagonal line pattern */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    rgba(255,255,255,0.8) 0px,
                    rgba(255,255,255,0.8) 1px,
                    transparent 1px,
                    transparent 18px
                  )`,
                }}
              />
              {/* Large decorative circle */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
                style={{ backgroundColor: tile.accent }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: tile.accent }}
              />
              {/* Business name on tile */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-white font-serif font-bold text-xl leading-tight line-clamp-3">
                  {business.name}
                </p>
              </div>
            </div>
          )}

          {/* Category tag — always on image/tile */}
          <div className="absolute top-4 left-4">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm"
              style={{ backgroundColor: cat.color, color: '#fff' }}
            >
              {cat.label}
            </span>
          </div>
        </div>

        {/* ── Content ── McKinsey: bold left border, serif title ── */}
        <div
          className="flex-1 bg-white border-b border-r border-l border-slate-100 p-5 flex flex-col"
          style={{ borderLeftWidth: 4, borderLeftColor: cat.color }}
        >
          <h3
            className="font-serif font-bold text-lg leading-snug text-slate-900 group-hover:text-[#002B5B] transition-colors line-clamp-2 mb-3"
          >
            {business.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={business.average_rating} size="sm" />
            <span className="text-sm font-semibold text-slate-800">{formatRating(business.average_rating)}</span>
            <span className="text-xs text-slate-400">({business.review_count})</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{business.city}, {business.state}</span>
          </div>

          {business.phone && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{formatPhone(business.phone)}</span>
            </div>
          )}

          {/* Services pills */}
          {business.services && business.services.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {(business.services as ServiceItem[]).slice(0, 3).map((s) => (
                <span
                  key={s.name}
                  className="text-[11px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  {s.name}
                </span>
              ))}
              {business.services.length > 3 && (
                <span className="text-[11px] text-slate-400 py-0.5">
                  +{business.services.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Hours summary */}
          {business.working_hours && (
            (() => {
              const summary = getHoursSummary(business.working_hours)
              return summary ? (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{summary}</span>
                </div>
              ) : null
            })()
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <div>
              {(business.insured || business.bonded) && (
                <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5">
                  {[business.insured && 'Insured', business.bonded && 'Bonded'].filter(Boolean).join(' & ')}
                </span>
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
          </div>
        </div>

      </div>
    </Link>
  )
}
