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
}> {
  const supabase = await createClient()
  const { q, category, state, sort = 'rating', page = '1' } = params
  const offset = (parseInt(page) - 1) * PAGE_SIZE

  let query = supabase
    .from('businesses')
    .select(BUSINESS_SELECT, { count: 'exact' })
    .eq('status', 'active')

  if (q) {
    const trimmed = q.trim()
    if (isZipCode(trimmed)) {
      query = query.eq('zip_code', trimmed)
    } else if (isStateAbbr(trimmed)) {
      query = query.eq('state', trimmed)
    } else if (isCityState(trimmed)) {
      const { city, state: stateAbbr } = parseCityState(trimmed)
      query = query.ilike('city', `%${city}%`).eq('state', stateAbbr)
    } else {
      query = query.textSearch('search_vector', trimmed, {
        type: 'plain',
        config: 'english',
      })
    }
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (state) {
    query = query.eq('state', state)
  }

  if (sort === 'rating') {
    query = query.order('average_rating', { ascending: false })
  } else if (sort === 'name') {
    query = query.order('name', { ascending: true })
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false })
  }

  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await query

  if (error) throw error

  return {
    businesses: (data as Business[]) ?? [],
    count: count ?? 0,
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
