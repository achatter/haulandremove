import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { US_STATES } from '@/lib/constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function isZipCode(query: string): boolean {
  return /^\d{5}$/.test(query.trim())
}

export function isStateAbbr(query: string): boolean {
  return /^[A-Z]{2}$/.test(query.trim())
}

export function isCityState(query: string): boolean {
  return /^.+,\s*[A-Za-z]{2}$/.test(query.trim())
}

export function parseCityState(query: string): { city: string; state: string } {
  const match = query.trim().match(/^(.+),\s*([A-Za-z]{2})$/)
  if (!match) return { city: query.trim(), state: '' }
  return { city: match[1].trim(), state: match[2].toUpperCase() }
}

export function formatCityState(city: string, state: string): string {
  return `${city}, ${state}`
}

export function buildSearchUrl(params: Record<string, string>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v)
  }
  const qs = sp.toString()
  return qs ? `/search?${qs}` : '/search'
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')      // strip apostrophes (Lee's → lees)
    .replace(/\./g, '')        // strip periods (St. → st)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function fromSlug(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function categorySlugToKey(slug: string): 'junk_removal' | 'estate_cleanout' | null {
  if (slug === 'junk-removal') return 'junk_removal'
  if (slug === 'estate-cleanout') return 'estate_cleanout'
  return null
}

// Converts a state abbreviation to a URL slug: "CA" → "california", "TX" → "texas"
export function stateAbbrToSlug(abbr: string): string {
  const found = US_STATES.find(s => s.abbr === abbr.toUpperCase())
  return found ? toSlug(found.name) : abbr.toLowerCase()
}

// Converts a state URL slug back to abbreviation: "california" → "CA", "texas" → "TX"
export function stateSlugToAbbr(slug: string): string | null {
  const found = US_STATES.find(s => toSlug(s.name) === slug)
  return found?.abbr ?? null
}

