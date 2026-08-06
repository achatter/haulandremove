import { describe, it, expect } from 'vitest'
import { getCityContent } from './city-content'

const TARGET_CITIES: { category: 'junk_removal' | 'estate_cleanout'; state: string; citySlug: string }[] = [
  { category: 'junk_removal', state: 'MO', citySlug: 'kansas-city' },
  { category: 'estate_cleanout', state: 'MO', citySlug: 'kansas-city' },
  { category: 'junk_removal', state: 'AZ', citySlug: 'mesa' },
  { category: 'estate_cleanout', state: 'AZ', citySlug: 'mesa' },
  { category: 'junk_removal', state: 'NY', citySlug: 'brooklyn' },
  { category: 'estate_cleanout', state: 'NY', citySlug: 'brooklyn' },
  { category: 'junk_removal', state: 'NY', citySlug: 'albany' },
  { category: 'estate_cleanout', state: 'NY', citySlug: 'albany' },
  { category: 'junk_removal', state: 'NC', citySlug: 'charlotte' },
  { category: 'estate_cleanout', state: 'NC', citySlug: 'charlotte' },
  { category: 'junk_removal', state: 'IL', citySlug: 'chicago' },
  { category: 'estate_cleanout', state: 'IL', citySlug: 'chicago' },
  { category: 'junk_removal', state: 'IN', citySlug: 'indianapolis' },
  { category: 'estate_cleanout', state: 'IN', citySlug: 'indianapolis' },
]

function wordCount(paragraphs: string[]): number {
  return paragraphs.join(' ').trim().split(/\s+/).length
}

describe('getCityContent', () => {
  it('returns content for all target city/category blocks', () => {
    for (const { category, state, citySlug } of TARGET_CITIES) {
      const content = getCityContent(category, state, citySlug)
      expect(content, `${category}:${state}:${citySlug}`).not.toBeNull()
    }
  })

  it('keeps each intro to 2 paragraphs within a 150-250 word range', () => {
    for (const { category, state, citySlug } of TARGET_CITIES) {
      const content = getCityContent(category, state, citySlug)!
      expect(content.intro).toHaveLength(2)
      const count = wordCount(content.intro)
      expect(count, `${category}:${state}:${citySlug} word count`).toBeGreaterThanOrEqual(150)
      expect(count, `${category}:${state}:${citySlug} word count`).toBeLessThanOrEqual(250)
    }
  })

  it('has a valid price range and 3-4 FAQs per block', () => {
    for (const { category, state, citySlug } of TARGET_CITIES) {
      const content = getCityContent(category, state, citySlug)!
      expect(content.priceRange.low).toBeGreaterThan(0)
      expect(content.priceRange.high).toBeGreaterThan(content.priceRange.low)
      expect(content.faqs.length).toBeGreaterThanOrEqual(3)
      expect(content.faqs.length).toBeLessThanOrEqual(4)
    }
  })

  it('returns null for a city without curated content', () => {
    expect(getCityContent('junk_removal', 'CA', 'los-angeles')).toBeNull()
  })

  it('is case-insensitive on state abbreviation', () => {
    expect(getCityContent('junk_removal', 'mo', 'kansas-city')).not.toBeNull()
  })
})
