import { describe, it, expect } from 'vitest'
import { validateReview } from './reviews'

describe('validateReview', () => {
  const validReview = {
    business_id: 'some-uuid',
    reviewer_name: 'Jane Smith',
    rating: 5,
    title: 'Great service!',
    body: 'Excellent work, would use again.',
  }

  it('passes valid review data', () => {
    expect(validateReview(validReview)).toEqual({ valid: true })
  })

  it('rejects missing business_id', () => {
    const { business_id: _, ...rest } = validReview
    const result = validateReview(rest)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/business_id/)
  })

  it('rejects missing reviewer_name', () => {
    const result = validateReview({ ...validReview, reviewer_name: '' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/reviewer_name/)
  })

  it('rejects rating 0', () => {
    const result = validateReview({ ...validReview, rating: 0 })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/rating/)
  })

  it('rejects rating 6', () => {
    const result = validateReview({ ...validReview, rating: 6 })
    expect(result.valid).toBe(false)
  })

  it('rejects missing title', () => {
    const result = validateReview({ ...validReview, title: '' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/title/)
  })

  it('rejects missing body', () => {
    const result = validateReview({ ...validReview, body: '' })
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/body/)
  })

  it('rejects non-object input', () => {
    expect(validateReview(null)).toEqual({ valid: false, error: 'Invalid request body' })
    expect(validateReview('string')).toEqual({ valid: false, error: 'Invalid request body' })
  })
})
