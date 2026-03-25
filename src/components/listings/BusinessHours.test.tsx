import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BusinessHours } from './BusinessHours'
import type { BusinessHours as BusinessHoursType } from '@/types'

const mockHours: BusinessHoursType = {
  Monday: '9AM-5PM',
  Tuesday: '9AM-5PM',
  Wednesday: '9AM-5PM',
  Thursday: '9AM-5PM',
  Friday: '9AM-5PM',
  Saturday: '10AM-3PM',
  Sunday: null,
}

describe('BusinessHours', () => {
  it('renders all 7 day names', () => {
    render(<BusinessHours hours={mockHours} />)
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Tuesday')).toBeInTheDocument()
    expect(screen.getByText('Wednesday')).toBeInTheDocument()
    expect(screen.getByText('Thursday')).toBeInTheDocument()
    expect(screen.getByText('Friday')).toBeInTheDocument()
    expect(screen.getByText('Saturday')).toBeInTheDocument()
    expect(screen.getByText('Sunday')).toBeInTheDocument()
  })

  it('renders hours strings for open days', () => {
    render(<BusinessHours hours={mockHours} />)
    expect(screen.getByText('10AM-3PM')).toBeInTheDocument()
    expect(screen.getAllByText('9AM-5PM').length).toBeGreaterThan(0)
  })

  it('shows Closed for a null day', () => {
    render(<BusinessHours hours={mockHours} />)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('shows Closed for all days when hours object is empty', () => {
    render(<BusinessHours hours={{}} />)
    const closedItems = screen.getAllByText('Closed')
    expect(closedItems).toHaveLength(7)
  })

  it('renders the Hours heading', () => {
    render(<BusinessHours hours={mockHours} />)
    expect(screen.getByText('Hours')).toBeInTheDocument()
  })
})
