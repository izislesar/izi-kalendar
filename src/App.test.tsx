import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Calendar demo', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('creates a meeting through every mandatory interaction', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'CREATE MEETING' }))
    fireEvent.click(screen.getByRole('button', { name: 'Firm' }))

    fireEvent.click(screen.getByRole('button', { name: 'Cookie' }))
    expect(screen.getByText('Your cookie preferences have been fingerprinted.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    expect(screen.getByText('Blank round.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'RELOAD' }))
    act(() => vi.advanceTimersByTime(1000))

    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    expect(screen.getByText('Weapon jammed.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'FIX' }))
    act(() => vi.advanceTimersByTime(1000))

    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    expect(screen.getByText('Confirm selected date.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'TURN LOCK' }))
    fireEvent.click(screen.getByRole('button', { name: 'TURN LOCK' }))

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Demo review' } })
    fireEvent.click(screen.getByRole('button', { name: 'SAVE MEETING' }))
    fireEvent.click(screen.getByRole('button', { name: 'Goodbye' }))

    expect(screen.getByRole('article', { name: 'Created meeting' })).toHaveTextContent('Demo review')
    expect(screen.getByText('Meeting created.')).toBeInTheDocument()
  })
})
