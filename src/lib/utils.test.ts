import { describe, it, expect } from 'vitest'
import { formatPhone, formatRating, isZipCode, isStateAbbr, formatCityState, buildSearchUrl, toSlug, fromSlug, categorySlugToKey } from './utils'

describe('formatPhone', () => {
  it('formats a 10-digit number', () => {
    expect(formatPhone('5124557890')).toBe('(512) 455-7890')
  })
  it('formats an 11-digit number with leading 1', () => {
    expect(formatPhone('15124557890')).toBe('(512) 455-7890')
  })
  it('returns unformatted string for non-standard lengths', () => {
    expect(formatPhone('123')).toBe('123')
  })
  it('strips non-digits before formatting', () => {
    expect(formatPhone('(512) 455-7890')).toBe('(512) 455-7890')
  })
})

describe('formatRating', () => {
  it('formats to one decimal place', () => {
    expect(formatRating(4.5)).toBe('4.5')
    expect(formatRating(5)).toBe('5.0')
    expect(formatRating(3.25)).toBe('3.3')
  })
})

describe('isZipCode', () => {
  it('returns true for 5-digit strings', () => {
    expect(isZipCode('78701')).toBe(true)
    expect(isZipCode('00000')).toBe(true)
  })
  it('returns false for non-zip strings', () => {
    expect(isZipCode('Austin')).toBe(false)
    expect(isZipCode('TX')).toBe(false)
    expect(isZipCode('1234')).toBe(false)
    expect(isZipCode('123456')).toBe(false)
  })
  it('trims whitespace before checking', () => {
    expect(isZipCode(' 78701 ')).toBe(true)
  })
})

describe('isStateAbbr', () => {
  it('returns true for 2-uppercase-letter strings', () => {
    expect(isStateAbbr('TX')).toBe(true)
    expect(isStateAbbr('CA')).toBe(true)
  })
  it('returns false for lowercase', () => {
    expect(isStateAbbr('tx')).toBe(false)
  })
  it('returns false for >2 letters', () => {
    expect(isStateAbbr('TEX')).toBe(false)
  })
})

describe('formatCityState', () => {
  it('formats correctly', () => {
    expect(formatCityState('Austin', 'TX')).toBe('Austin, TX')
  })
})

describe('buildSearchUrl', () => {
  it('builds URL with query param', () => {
    expect(buildSearchUrl({ q: 'Austin' })).toBe('/search?q=Austin')
  })
  it('omits empty params', () => {
    expect(buildSearchUrl({ q: 'Austin', category: '' })).toBe('/search?q=Austin')
  })
  it('returns /search with no params', () => {
    expect(buildSearchUrl({})).toBe('/search')
  })
  it('includes multiple params', () => {
    const url = buildSearchUrl({ q: 'Austin', category: 'junk_removal' })
    expect(url).toBe('/search?q=Austin&category=junk_removal')
  })
})

describe('toSlug', () => {
  it('lowercases and hyphenates a simple city name', () => {
    expect(toSlug('Los Angeles')).toBe('los-angeles')
  })
  it("strips apostrophes (Lee's Summit)", () => {
    expect(toSlug("Lee's Summit")).toBe('lees-summit')
  })
  it('strips periods (St. Louis)', () => {
    expect(toSlug('St. Louis')).toBe('st-louis')
  })
  it('handles multiple consecutive spaces', () => {
    expect(toSlug('New  York')).toBe('new-york')
  })
  it('preserves existing hyphens (Winston-Salem)', () => {
    expect(toSlug('Winston-Salem')).toBe('winston-salem')
  })
})

describe('fromSlug', () => {
  it('capitalizes a single word', () => {
    expect(fromSlug('austin')).toBe('Austin')
  })
  it('capitalizes each word in a multi-word slug', () => {
    expect(fromSlug('los-angeles')).toBe('Los Angeles')
  })
})

describe('categorySlugToKey', () => {
  it('maps junk-removal to junk_removal', () => {
    expect(categorySlugToKey('junk-removal')).toBe('junk_removal')
  })
  it('maps estate-cleanout to estate_cleanout', () => {
    expect(categorySlugToKey('estate-cleanout')).toBe('estate_cleanout')
  })
  it('returns null for unknown slugs', () => {
    expect(categorySlugToKey('other-service')).toBeNull()
  })
})
