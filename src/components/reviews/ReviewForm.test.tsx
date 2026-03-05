import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewForm } from './ReviewForm'

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ReviewForm', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders all form fields', () => {
    render(<ReviewForm businessId="test-id" />)
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Great service!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tell others about your experience...')).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    render(<ReviewForm businessId="test-id" />)
    fireEvent.click(screen.getByText('Submit Review'))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Please select a rating')).toBeInTheDocument()
      expect(screen.getByText('Title is required')).toBeInTheDocument()
      expect(screen.getByText('Review is required')).toBeInTheDocument()
    })
  })

  it('calls the API on valid form submission', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'rev-1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<ReviewForm businessId="test-id" />)

    // Fill name
    await user.type(screen.getByPlaceholderText('Jane Smith'), 'John Doe')
    // Click 4th star
    const stars = screen.getAllByRole('button')
    await user.click(stars[3])
    // Fill title
    await user.type(screen.getByPlaceholderText('Great service!'), 'Excellent!')
    // Fill body
    await user.type(screen.getByPlaceholderText('Tell others about your experience...'), 'Great work team.')

    fireEvent.click(screen.getByText('Submit Review'))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/reviews', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }))
    })
  })
})
