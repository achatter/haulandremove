import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Homepage', () => {
  test('loads with hero search bar', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.getByRole('heading', { name: /hauling/i })).toBeVisible()
    await expect(page.getByPlaceholder(/city, state, or zip/i)).toBeVisible()
  })

  test('shows featured listings section', async ({ page }) => {
    await page.goto(BASE_URL)
    const cards = page.locator('a[href^="/listings/"]')
    await expect(cards.first()).toBeVisible()
  })
})

test.describe('Search', () => {
  test('search by city shows results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=Austin`)
    await expect(page.getByText(/results for/i)).toBeVisible()
    await expect(page.locator('a[href^="/listings/"]').first()).toBeVisible()
  })

  test('search by zip code shows results', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=78704`)
    await expect(page.locator('a[href^="/listings/"]').first()).toBeVisible()
  })

  test('category filter shows correct badges', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?category=estate_cleanout`)
    const badges = page.locator('text=Estate Cleanout')
    await expect(badges.first()).toBeVisible()
  })

  test('no results shows empty state', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=xyznonexistentcity12345`)
    await expect(page.getByText('No businesses found')).toBeVisible()
  })
})

test.describe('Listing Detail', () => {
  test('navigating to a listing shows detail page', async ({ page }) => {
    await page.goto(`${BASE_URL}/search?q=Austin`)
    const firstCard = page.locator('a[href^="/listings/"]').first()
    const href = await firstCard.getAttribute('href')
    await firstCard.click()
    await expect(page).toHaveURL(new RegExp('/listings/'))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('listing detail shows reviews section', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/lone-star-junk-austin-tx`)
    await expect(page.getByRole('heading', { name: /reviews/i })).toBeVisible()
  })

  test('listing detail shows review form', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/lone-star-junk-austin-tx`)
    await expect(page.getByRole('heading', { name: /write a review/i })).toBeVisible()
    await expect(page.getByPlaceholder('Jane Smith')).toBeVisible()
  })
})

test.describe('Category Pages', () => {
  test('/categories/junk-removal shows junk removal listings', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories/junk-removal`)
    await expect(page.getByRole('heading', { name: /junk removal/i })).toBeVisible()
    await expect(page.locator('text=Junk Removal').first()).toBeVisible()
  })

  test('/categories/estate-cleanout shows estate cleanout listings', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories/estate-cleanout`)
    await expect(page.getByRole('heading', { name: /estate cleanout/i })).toBeVisible()
    await expect(page.locator('text=Estate Cleanout').first()).toBeVisible()
  })
})

test.describe('Error handling', () => {
  test('nonexistent slug shows 404', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/nonexistent-business-slug-xyz-123`)
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible()
  })

  test('nonexistent page shows 404', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-page-does-not-exist`)
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible()
  })
})
