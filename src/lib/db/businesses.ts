import { createClient } from '@/lib/supabase/server'
import type { Business, SearchParams } from '@/types'
import { isZipCode, isStateAbbr } from '@/lib/utils'
import { PAGE_SIZE } from '@/lib/constants'

const BUSINESS_SELECT = `
  id, name, slug, category, description, phone, email, website,
  street_address, city, state, state_full, zip_code,
  years_in_business, insured, bonded, featured,
  average_rating, review_count, status, created_at,
  booking_url, working_hours, services, social_media,
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
