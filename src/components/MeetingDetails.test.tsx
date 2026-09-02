import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EventCard, MeetingDetails } from './MeetingDetails'

describe('MeetingDetails', () => {
  it('submits fast defaults with the confirmed September date', () => {
    const onSave = vi.fn()
    render(<MeetingDetails selectedDay={17} onSave={onSave} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Demo review' } })
    fireEvent.click(screen.getByRole('button', { name: 'SAVE MEETING' }))

    expect(onSave).toHaveBeenCalledWith({
      title: 'Demo review',
      date: '2026-09-17',
      time: '14:00',
      duration: '30',
    })
  })

  it('renders the created meeting as a real local event card', () => {
    render(<EventCard event={{ title: 'Demo review', date: '2026-09-17', time: '14:00', duration: '30' }} />)
    expect(screen.getByRole('article', { name: 'Created meeting' })).toHaveTextContent('Demo review')
    expect(screen.getByText(/17 september 2026/i)).toBeInTheDocument()
  })
})
