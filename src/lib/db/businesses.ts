import { createClient } from '@/lib/supabase/server'
import type { Business, SearchParams } from '@/types'
import { isZipCode, isStateAbbr, isCityState, parseCityState } from '@/lib/utils'
import { PAGE_SIZE } from '@/lib/constants'

const BUSINESS_SELECT = `
  id, name, slug, category, description, phone, email, website,
  street_address, city, state, state_full, zip_code,
  years_in_business, insured, bonded, featured,
  average_rating, review_count, status, created_at,
  booking_url, working_hours, services, social_media, attributes,
  images:business_images(id, url, alt_text, is_primary, sort_order)
`

export async function searchBusinesses(params: SearchParams): Promise<{
  businesses: Business[]
  count: number
  categoryFallback: boolean
}> {
  const supabase = await createClient()
  const { q, category, state, city, sort = 'rating', page = '1' } = params
  const offset = (parseInt(page) - 1) * PAGE_SIZE

  // Parse location from q once — reused in both primary and fallback queries
  let locationType: 'zip' | 'state' | 'citystate' | 'text' | 'none' = 'none'
  let parsedCity = ''
  let parsedState = ''
  let parsedZip = ''
  let searchText = ''

  if (q) {
    const trimmed = q.trim()
    if (isZipCode(trimmed)) {
      locationType = 'zip'; parsedZip = trimmed
    } else if (isStateAbbr(trimmed)) {
      locationType = 'state'; parsedState = trimmed.toUpperCase()
    } else if (isCityState(trimmed)) {
      const p = parseCityState(trimmed)
      locationType = 'citystate'; parsedCity = p.city; parsedState = p.state
    } else {
      locationType = 'text'; searchText = trimmed
    }
  }

  function buildQuery(includeCategory: boolean) {
    let qb = supabase
      .from('businesses')
      .select(BUSINESS_SELECT, { count: 'exact' })
      .eq('status', 'active')

    if (locationType === 'zip' && !state && !city) {
      qb = qb.eq('zip_code', parsedZip)
    } else if (locationType === 'state' && !state) {
      qb = qb.eq('state', parsedState)
    } else if (locationType === 'citystate') {
      if (!state) qb = qb.ilike('city', `%${parsedCity}%`).eq('state', parsedState)
    } else if (locationType === 'text') {
      qb = qb.textSearch('search_vector', searchText, { type: 'plain', config: 'english' })
    }

    if (city) qb = qb.ilike('city', `%${city}%`)
    if (includeCategory && category) qb = qb.eq('category', category)
    if (state) qb = qb.eq('state', state)

    if (sort === 'rating') qb = qb.order('average_rating', { ascending: false })
    else if (sort === 'name') qb = qb.order('name', { ascending: true })
    else if (sort === 'newest') qb = qb.order('created_at', { ascending: false })

    return qb.range(offset, offset + PAGE_SIZE - 1)
  }

  // Primary query — with category filter
  const { data, count, error } = await buildQuery(true)
  if (error) throw error

  // If category was specified but returned 0 results, fall back without category
  if (category && (count ?? 0) === 0) {
    const { data: fbData, count: fbCount, error: fbError } = await buildQuery(false)
    if (fbError) throw fbError
    return {
      businesses: (fbData as Business[]) ?? [],
      count: fbCount ?? 0,
      categoryFallback: true,
    }
  }

  return {
    businesses: (data as Business[]) ?? [],
    count: count ?? 0,
    categoryFallback: false,
  }
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_SELECT)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) return null
  return data as Business
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_SELECT)
    .eq('status', 'active')
    .eq('featured', true)
    .order('average_rating', { ascending: false })
    .limit(6)

  if (error) throw error
  return (data as Business[]) ?? []
}

export async function getCitySuggestions(q: string, limit = 8): Promise<{ city: string; state: string }[]> {
  const supabase = await createClient()
  const trimmed = q.trim()
  if (!trimmed) return []

  const { data, error } = await supabase
    .from('businesses')
    .select('city, state')
    .eq('status', 'active')
    .ilike('city', `%${trimmed}%`)
    .order('city', { ascending: true })
    .limit(limit * 4) // over-fetch to deduplicate in JS

  if (error) return []

  // Deduplicate city+state combinations
  const seen = new Set<string>()
  const results: { city: string; state: string }[] = []
  for (const row of (data ?? [])) {
    const key = `${row.city},${row.state}`
    if (!seen.has(key)) {
      seen.add(key)
      results.push({ city: row.city, state: row.state })
      if (results.length >= limit) break
    }
  }
  return results
}

export async function getBusinessesByCategory(
  category: string,
  limit = PAGE_SIZE
): Promise<Business[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(BUSINESS_SELECT)
    .eq('status', 'active')
    .eq('category', category)
    .order('average_rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as Business[]) ?? []
}

export async function getBusinessesByCategoryAndCity(
  category: string,
  state: string,
  city: string,
  limit = PAGE_SIZE,
): Promise<{ businesses: Business[]; count: number }> {
  const supabase = await createClient()

  const { data, count, error } = await supabase
    .from('businesses')
    .select(BUSINESS_SELECT, { count: 'exact' })
    .eq('status', 'active')
    .eq('category', category)
    .eq('state', state.toUpperCase())
    .eq('city', city)
    .order('average_rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  return { businesses: (data as Business[]) ?? [], count: count ?? 0 }
}

export async function getDistinctCitiesForSitemap(): Promise<
  { category: string; state: string; city: string }[]
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('category, state, city')
    .eq('status', 'active')
    .order('state')
    .order('city')

  if (error) return []

  const seen = new Set<string>()
  const results: { category: string; state: string; city: string }[] = []
  for (const row of (data ?? [])) {
    const key = `${row.category}|${row.state}|${row.city}`
    if (!seen.has(key)) {
      seen.add(key)
      results.push({ category: row.category, state: row.state, city: row.city })
    }
  }
  return results
}
