import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EventCard, MeetingDetails } from './MeetingDetails'

describe('MeetingDetails', () => {
  it('submits fast defaults with the confirmed September date', () => {
    const onSave = vi.fn()
    render(<MeetingDetails selectedDay={17} onSave={onSave} />)

    const time = screen.getByLabelText('Время')
    expect(time).toHaveValue('14:27')
    expect(time).toHaveAttribute('step', '1020')
    expect(time).toBeValid()
    fireEvent.click(screen.getByRole('button', { name: 'РАЗРЕШИТЬ ОБЫЧНЫЕ МИНУТЫ' }))
    expect(time).toHaveAttribute('step', '60')
    fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Обзор демо' } })
    fireEvent.click(screen.getByRole('button', { name: 'СОХРАНИТЬ ВСТРЕЧУ' }))

    expect(onSave).toHaveBeenCalledWith({
      title: 'Обзор демо',
      date: '2026-09-17',
      time: '14:27',
      duration: '30',
    })
  })

  it('renders the created meeting as a real local event card', () => {
    render(<EventCard event={{ title: 'Обзор демо', date: '2026-09-17', time: '14:00', duration: '30' }} />)
    expect(screen.getByRole('article', { name: 'Созданная встреча' })).toHaveTextContent('Обзор демо')
    expect(screen.getByText(/17 сентября 2026/i)).toBeInTheDocument()
  })
})
