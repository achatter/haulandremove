import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StarInput } from './StarInput'

describe('StarInput', () => {
  it('renders 5 star buttons', () => {
    render(<StarInput value={0} onChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('calls onChange with correct rating when clicked', () => {
    const onChange = vi.fn()
    render(<StarInput value={0} onChange={onChange} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[2]) // click 3rd star
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('calls onChange with 1 when first star is clicked', () => {
    const onChange = vi.fn()
    render(<StarInput value={0} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('calls onChange with 5 when last star is clicked', () => {
    const onChange = vi.fn()
    render(<StarInput value={0} onChange={onChange} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[4])
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('renders aria labels for accessibility', () => {
    render(<StarInput value={3} onChange={() => {}} />)
    expect(screen.getByLabelText('Rate 1 star')).toBeInTheDocument()
    expect(screen.getByLabelText('Rate 5 stars')).toBeInTheDocument()
  })
})
