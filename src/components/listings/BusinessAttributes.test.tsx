import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BusinessAttributes } from './BusinessAttributes'

const jsonAttributes = JSON.stringify({
  'From the business': {
    'Identifies as Latino-owned': true,
    'Identifies as women-owned': true,
  },
  'Service options': {
    'Onsite services': false,
  },
  'Accessibility': {
    'Wheelchair accessible seating': true,
    'Wheelchair accessible restroom': false,
  },
  'Crowd': {
    'LGBTQ+ friendly': true,
    'Transgender safespace': true,
  },
})

describe('BusinessAttributes', () => {
  it('renders plain text description as formatted rich text', () => {
    render(<BusinessAttributes description="We haul away junk fast and affordably." />)
    expect(screen.getByText('We haul away junk fast and affordably.')).toBeInTheDocument()
  })

  it('extracts and displays service highlights from rich text', () => {
    render(<BusinessAttributes description="At HaulAway Junk Removal Service, LLC, we provide fast, reliable, and affordable junk removal in Dallas. We offer same-day or next-day service and 24/7 customer support. Whether you need residential, commercial, or real estate junk removal, our team is ready to help." />)
    
    expect(screen.getByText('Service Highlights')).toBeInTheDocument()
    expect(screen.getByText('Same-Day or Next-Day Service')).toBeInTheDocument()
    expect(screen.getByText('24/7 Customer Support')).toBeInTheDocument()
    expect(screen.getByText('Residential, Commercial & Real Estate Services')).toBeInTheDocument()
  })

  it('does not render attribute sections for plain text without highlights', () => {
    render(<BusinessAttributes description="We haul away junk fast and affordably." />)
    expect(screen.queryByText('From the business')).not.toBeInTheDocument()
    expect(screen.queryByText('Service Highlights')).not.toBeInTheDocument()
  })

  it('renders category headers from JSON attributes', () => {
    render(<BusinessAttributes description={jsonAttributes} />)
    expect(screen.getByText('From the business')).toBeInTheDocument()
    expect(screen.getByText('Service options')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('Crowd')).toBeInTheDocument()
  })

  it('renders true attribute items', () => {
    render(<BusinessAttributes description={jsonAttributes} />)
    expect(screen.getByText('Identifies as Latino-owned')).toBeInTheDocument()
    expect(screen.getByText('Identifies as women-owned')).toBeInTheDocument()
    expect(screen.getByText('Wheelchair accessible seating')).toBeInTheDocument()
    expect(screen.getByText('LGBTQ+ friendly')).toBeInTheDocument()
    expect(screen.getByText('Transgender safespace')).toBeInTheDocument()
  })

  it('renders false attribute items', () => {
    render(<BusinessAttributes description={jsonAttributes} />)
    expect(screen.getByText('Onsite services')).toBeInTheDocument()
    expect(screen.getByText('Wheelchair accessible restroom')).toBeInTheDocument()
  })

  it('does not render raw JSON text', () => {
    render(<BusinessAttributes description={jsonAttributes} />)
    expect(screen.queryByText(/"From the business"/)).not.toBeInTheDocument()
    expect(screen.queryByText(/true/)).not.toBeInTheDocument()
    expect(screen.queryByText(/false/)).not.toBeInTheDocument()
  })

  it('renders nothing when description is empty', () => {
    const { container } = render(<BusinessAttributes description="" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when description is null-ish', () => {
    const { container } = render(<BusinessAttributes description={null as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('handles malformed JSON gracefully as plain text', () => {
    render(<BusinessAttributes description="{not valid json" />)
    expect(screen.getByText('{not valid json')).toBeInTheDocument()
  })
})
