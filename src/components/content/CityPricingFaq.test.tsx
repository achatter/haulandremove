import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CityPricingFaq } from './CityPricingFaq'
import { getCityContent } from '@/lib/content/city-content'

describe('CityPricingFaq', () => {
  const content = getCityContent('junk_removal', 'MO', 'kansas-city')!

  it('renders the typical cost heading and price range', () => {
    render(
      <CityPricingFaq
        cityName="Kansas City"
        stateAbbr="MO"
        categoryLabel="Junk Removal"
        content={content}
      />
    )
    expect(screen.getByText(/Typical Cost of Junk Removal in Kansas City, MO/i)).toBeInTheDocument()
    expect(screen.getByText(/\$125–\$550/)).toBeInTheDocument()
  })

  it('renders all FAQ questions', () => {
    render(
      <CityPricingFaq
        cityName="Kansas City"
        stateAbbr="MO"
        categoryLabel="Junk Removal"
        content={content}
      />
    )
    for (const faq of content.faqs) {
      expect(screen.getByText(faq.q)).toBeInTheDocument()
    }
  })

  it('embeds FAQPage JSON-LD structured data', () => {
    const { container } = render(
      <CityPricingFaq
        cityName="Kansas City"
        stateAbbr="MO"
        categoryLabel="Junk Removal"
        content={content}
      />
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const json = JSON.parse(script!.innerHTML)
    expect(json['@type']).toBe('FAQPage')
    expect(json.mainEntity).toHaveLength(content.faqs.length)
  })
})
