import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Lockpick } from './Lockpick'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('Lockpick', () => {
  it('maps pointer movement across the lock to the pick angle', () => {
    const { container } = render(<Lockpick selectedDay={17} onSuccess={vi.fn()} />)
    const { getByTestId } = within(container)

    const lock = getByTestId('lockpick-stage')
    Object.defineProperty(lock, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 200 }),
    })

    fireEvent.pointerMove(lock, { clientX: 150 })

    expect(getByTestId('pick')).toHaveAttribute('data-angle', '30')
  })

  it('widens the lock after a failed attempt so the next attempt confirms the date', () => {
    vi.useFakeTimers()
    const onSuccess = vi.fn()
    const { container } = render(
      <Lockpick selectedDay={17} onSuccess={onSuccess} />,
    )
    const { getByRole, getByTestId, getByText } = within(container)

    fireEvent.keyDown(getByTestId('lockpick-stage'), { key: ' ' })

    expect(getByRole('status')).toHaveTextContent('Lock rattles. Adjust the pick.')
    expect(onSuccess).not.toHaveBeenCalled()

    fireEvent.keyDown(getByTestId('lockpick-stage'), { key: ' ' })

    expect(getByText('Date confirmed.')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(499))
    expect(onSuccess).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('cancels the pending success transition when unmounted', () => {
    vi.useFakeTimers()
    const onSuccess = vi.fn()
    const { getByRole, unmount } = render(<Lockpick selectedDay={17} onSuccess={onSuccess} />)

    fireEvent.click(getByRole('button', { name: 'TURN LOCK' }))
    fireEvent.click(getByRole('button', { name: 'TURN LOCK' }))
    unmount()
    act(() => vi.advanceTimersByTime(500))

    expect(onSuccess).not.toHaveBeenCalled()
  })
})
