import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingCard } from './ListingCard'
import type { Business } from '@/types'

const mockBusiness: Business = {
  id: 'test-id',
  name: 'Lone Star Junk Austin',
  slug: 'lone-star-junk-austin-tx',
  category: 'junk_removal',
  description: 'Austin junk removal service',
  phone: '5124557890',
  email: 'info@example.com',
  website: null,
  street_address: '123 Main St',
  city: 'Austin',
  state: 'TX',
  state_full: 'Texas',
  zip_code: '78704',
  years_in_business: 8,
  insured: true,
  bonded: true,
  featured: true,
  average_rating: 4.8,
  review_count: 42,
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  images: [
    {
      id: 'img-1',
      business_id: 'test-id',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      alt_text: 'Junk removal truck',
      is_primary: true,
      sort_order: 0,
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
}

describe('ListingCard', () => {
  it('renders business name', () => {
    render(<ListingCard business={mockBusiness} />)
    expect(screen.getByText('Lone Star Junk Austin')).toBeInTheDocument()
  })

  it('renders city and state', () => {
    render(<ListingCard business={mockBusiness} />)
    expect(screen.getByText('Austin, TX')).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    render(<ListingCard business={mockBusiness} />)
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(42)')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<ListingCard business={mockBusiness} />)
    expect(screen.getByText('Junk Removal')).toBeInTheDocument()
  })

  it('renders insured & bonded badge', () => {
    render(<ListingCard business={mockBusiness} />)
    expect(screen.getByText('Insured & Bonded')).toBeInTheDocument()
  })

  it('renders formatted phone number', () => {
    render(<ListingCard business={mockBusiness} />)
    expect(screen.getByText('(512) 455-7890')).toBeInTheDocument()
  })

  it('links to the listing detail page', () => {
    render(<ListingCard business={mockBusiness} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/listings/lone-star-junk-austin-tx')
  })

  it('renders primary image with correct alt text', () => {
    render(<ListingCard business={mockBusiness} />)
    const img = screen.getByAltText('Junk removal truck')
    expect(img).toBeInTheDocument()
  })
})
