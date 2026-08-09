import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReviewList } from './ReviewList'
import type { Review } from '@/types'

const mockReview: Review = {
  id: 'rev-1',
  business_id: 'test-id',
  reviewer_name: 'Jane Smith',
  reviewer_email: null,
  rating: 5,
  title: 'Excellent!',
  body: 'Great work team.',
  is_flagged: false,
  created_at: '2024-01-01T00:00:00Z',
}

describe('ReviewList', () => {
  it('renders reviews when present', () => {
    render(<ReviewList reviews={[mockReview]} />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows the generic empty state when there is no Google aggregate', () => {
    render(<ReviewList reviews={[]} />)
    expect(screen.getByText('No reviews on this site yet. Be the first to leave one!')).toBeInTheDocument()
  })

  it('shows the Google-aware empty state when a Google rating exists but no site reviews do', () => {
    render(<ReviewList reviews={[]} hasGoogleReviews />)
    expect(
      screen.getByText(
        'No reviews submitted directly on this site yet — see the reviews on Google above, or be the first to leave one here.'
      )
    ).toBeInTheDocument()
  })
})
