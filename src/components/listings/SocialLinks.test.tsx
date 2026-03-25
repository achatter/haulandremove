import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocialLinks } from './SocialLinks'
import type { SocialMedia } from '@/types'

const mockSocial: SocialMedia = {
  facebook: 'https://facebook.com/example',
  instagram: 'https://instagram.com/example',
  linkedin: null,
  youtube: null,
}

describe('SocialLinks', () => {
  it('renders present links', () => {
    render(<SocialLinks social={mockSocial} />)
    expect(screen.getByText('Facebook')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toBeInTheDocument()
  })

  it('does not render absent links', () => {
    render(<SocialLinks social={mockSocial} />)
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument()
    expect(screen.queryByText('YouTube')).not.toBeInTheDocument()
  })

  it('opens links in a new tab', () => {
    render(<SocialLinks social={mockSocial} />)
    const fbLink = screen.getByText('Facebook').closest('a')
    expect(fbLink).toHaveAttribute('target', '_blank')
    expect(fbLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('links have correct href', () => {
    render(<SocialLinks social={mockSocial} />)
    const fbLink = screen.getByText('Facebook').closest('a')
    expect(fbLink).toHaveAttribute('href', 'https://facebook.com/example')
  })

  it('returns null when all values are null', () => {
    const { container } = render(
      <SocialLinks social={{ facebook: null, instagram: null, linkedin: null, youtube: null }} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when social object is empty', () => {
    const { container } = render(<SocialLinks social={{}} />)
    expect(container.firstChild).toBeNull()
  })
})
