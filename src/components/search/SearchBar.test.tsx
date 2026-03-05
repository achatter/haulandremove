import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  it('renders search input and button', () => {
    render(<SearchBar />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('shows initial query value', () => {
    render(<SearchBar initialQuery="Austin" />)
    expect(screen.getByDisplayValue('Austin')).toBeInTheDocument()
  })

  it('navigates to search URL on submit', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    await user.type(screen.getByRole('textbox'), 'Denver')
    fireEvent.submit(screen.getByRole('button', { name: /search/i }).closest('form')!)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search?q=Denver')
    })
  })

  it('includes category in URL when provided', async () => {
    const user = userEvent.setup()
    render(<SearchBar currentCategory="junk_removal" />)

    await user.type(screen.getByRole('textbox'), 'Austin')
    fireEvent.submit(screen.getByRole('button', { name: /search/i }).closest('form')!)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search?q=Austin&category=junk_removal')
    })
  })

  it('navigates to /search with empty query on empty submit', async () => {
    render(<SearchBar />)
    fireEvent.submit(screen.getByRole('button', { name: /search/i }).closest('form')!)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search')
    })
  })
})
