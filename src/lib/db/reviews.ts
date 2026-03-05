import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Review, ReviewFormData } from '@/types'

export async function getReviewsForBusiness(businessId: string): Promise<Review[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('id, business_id, reviewer_name, rating, title, body, created_at')
    .eq('business_id', businessId)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Review[]) ?? []
}

export async function insertReview(formData: ReviewFormData): Promise<Review> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      business_id: formData.business_id,
      reviewer_name: formData.reviewer_name,
      reviewer_email: formData.reviewer_email || null,
      rating: formData.rating,
      title: formData.title,
      body: formData.body,
      is_flagged: false,
    })
    .select()
    .single()

  if (error) throw error
  return data as Review
}

export function validateReview(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }
  const d = data as Record<string, unknown>

  if (!d.business_id || typeof d.business_id !== 'string') {
    return { valid: false, error: 'business_id is required' }
  }
  if (!d.reviewer_name || typeof d.reviewer_name !== 'string' || !d.reviewer_name.trim()) {
    return { valid: false, error: 'reviewer_name is required' }
  }
  if (typeof d.rating !== 'number' || d.rating < 1 || d.rating > 5) {
    return { valid: false, error: 'rating must be between 1 and 5' }
  }
  if (!d.title || typeof d.title !== 'string' || !d.title.trim()) {
    return { valid: false, error: 'title is required' }
  }
  if (!d.body || typeof d.body !== 'string' || !d.body.trim()) {
    return { valid: false, error: 'body is required' }
  }

  return { valid: true }
}
