import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewsModal } from './ReviewsModal'
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

describe('ReviewsModal', () => {
  it('opens a modal with review details when on-site reviews exist', async () => {
    const user = userEvent.setup()
    render(<ReviewsModal rating={5} reviewCount={1} reviews={[mockReview]} />)

    await user.click(screen.getByRole('button', { name: /view 1 reviews/i }))

    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Excellent!')).toBeInTheDocument()
    expect(screen.getByText('Great work team.')).toBeInTheDocument()
  })

  it('links out to Google when the rating is a Google aggregate with no on-site reviews', () => {
    render(
      <ReviewsModal
        rating={4.5}
        reviewCount={128}
        reviews={[]}
        googleMapsUrl="https://maps.google.com/?cid=123"
      />
    )

    const link = screen.getByRole('link', { name: /see 128 reviews on google/i })
    expect(link).toHaveAttribute('href', 'https://maps.google.com/?cid=123')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('(128 reviews on Google)')).toBeInTheDocument()
  })

  it('renders a static, non-interactive badge when there is a Google count but no maps link', () => {
    render(<ReviewsModal rating={4.5} reviewCount={128} reviews={[]} />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('(128 reviews on Google)')).toBeInTheDocument()
  })

  it('is not clickable when there are no reviews at all', () => {
    render(<ReviewsModal rating={0} reviewCount={0} reviews={[]} />)

    const button = screen.getByRole('button')
    expect(button).not.toHaveAttribute('aria-label')
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('(0 reviews)')).toBeInTheDocument()
  })
})
