import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

async function completeDemo(title: string) {
  const startedAt = Date.now()
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'CREATE MEETING' }))
  fireEvent.click(screen.getByRole('button', { name: 'Firm' }))
  fireEvent.click(screen.getByRole('button', { name: 'Cookie' }))

  fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
  fireEvent.click(screen.getByRole('button', { name: 'RELOAD' }))
  await waitFor(() => expect(screen.getByText('READY')).toBeInTheDocument(), { timeout: 1500 })

  fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
  fireEvent.click(screen.getByRole('button', { name: 'FIX' }))
  await waitFor(() => expect(screen.getByText('READY')).toBeInTheDocument(), { timeout: 1500 })

  fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
  expect(screen.getByText('September 17 selected.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByText('Confirm selected date.')).toBeInTheDocument(), { timeout: 1000 })
  fireEvent.click(screen.getByRole('button', { name: 'TURN LOCK' }))
  fireEvent.click(screen.getByRole('button', { name: 'TURN LOCK' }))
  expect(screen.getByText('Date confirmed.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByLabelText('Title')).toBeInTheDocument(), { timeout: 1000 })
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: title } })
  fireEvent.click(screen.getByRole('button', { name: 'SAVE MEETING' }))
  fireEvent.click(screen.getByRole('button', { name: 'Goodbye' }))

  expect(screen.getByRole('article', { name: 'Created meeting' })).toHaveTextContent(title)
  return Date.now() - startedAt
}

describe('timed demo smoke path', () => {
  afterEach(cleanup)

  it('completes twice with real service timers under two minutes', async () => {
    const first = await completeDemo('Timed run one')
    cleanup()
    const second = await completeDemo('Timed run two')
    expect(first).toBeLessThan(120_000)
    expect(second).toBeLessThan(120_000)
  }, 10_000)
})
