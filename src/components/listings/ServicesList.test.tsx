import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServicesList } from './ServicesList'
import type { ServiceItem } from '@/types'

const mockServices: ServiceItem[] = [
  { name: 'Furniture Removal', source: 'scraped' },
  { name: 'Appliance Hauling', description: 'All major appliances', source: 'scraped' },
  { name: 'Estate Cleanout', source: 'scraped' },
]

describe('ServicesList', () => {
  it('renders service names', () => {
    render(<ServicesList services={mockServices} />)
    expect(screen.getByText('Furniture Removal')).toBeInTheDocument()
    expect(screen.getByText('Appliance Hauling')).toBeInTheDocument()
    expect(screen.getByText('Estate Cleanout')).toBeInTheDocument()
  })

  it('renders description when present', () => {
    render(<ServicesList services={mockServices} />)
    expect(screen.getByText('All major appliances')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(<ServicesList services={[{ name: 'Junk Removal', source: 'scraped' }]} />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('renders Services Offered heading', () => {
    render(<ServicesList services={mockServices} />)
    expect(screen.getByText('Services Offered')).toBeInTheDocument()
  })

  it('returns null for empty array', () => {
    const { container } = render(<ServicesList services={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null for null services', () => {
    const { container } = render(<ServicesList services={null as any} />)
    expect(container.firstChild).toBeNull()
  })
})
