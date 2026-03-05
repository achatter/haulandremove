import { describe, it, expect } from 'vitest'
import { formatPhone, formatRating, isZipCode, isStateAbbr, formatCityState, buildSearchUrl } from './utils'

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
