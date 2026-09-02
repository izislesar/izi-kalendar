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
    expect(screen.getByText('September 17 selected.')).toBeInTheDocument()
    expect(screen.queryByText('Confirm selected date.')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(499))
    expect(screen.getByText('September 17 selected.')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByText('Confirm selected date.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'TURN LOCK' }))
    fireEvent.click(screen.getByRole('button', { name: 'TURN LOCK' }))
    expect(screen.getByText('Date confirmed.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Title')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(499))
    expect(screen.getByText('Date confirmed.')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Demo review' } })
    fireEvent.click(screen.getByRole('button', { name: 'SAVE MEETING' }))
    fireEvent.click(screen.getByRole('button', { name: 'Goodbye' }))

    expect(screen.getByRole('article', { name: 'Created meeting' })).toHaveTextContent('Demo review')
    expect(screen.getByText('Meeting created.')).toBeInTheDocument()
  })

  it('keeps Pet visible but prevents feeding and ammunition changes on Home', () => {
    render(<App />)

    const cookie = screen.getByRole('button', { name: 'Cookie' })
    expect(screen.getByRole('complementary', { name: 'Pet and ammunition' })).toBeInTheDocument()
    expect(cookie).toBeDisabled()

    fireEvent.click(cookie)
    expect(screen.getByText('0 ROUNDS')).toBeInTheDocument()
    expect(screen.queryByText(/Pet consumed cookie/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'CREATE MEETING' }))
    fireEvent.click(screen.getByRole('button', { name: 'Firm' }))

    expect(screen.getByText('0 ROUNDS')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cookie' })).toBeEnabled()
  })
})
