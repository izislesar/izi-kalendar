import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import '../styles.css'
import ShootingRange from './ShootingRange'

describe('ShootingRange', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('clamps the demo path to blank, jam, then a live date hit', () => {
    vi.useFakeTimers()
    let ammo = 3
    const onAmmoChange = vi.fn((next: number) => {
      ammo = next
    })
    const onDateHit = vi.fn()

    const view = render(
      <ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    expect(screen.getByText('Blank round.')).toBeInTheDocument()
    expect(onAmmoChange).toHaveBeenLastCalledWith(2)

    fireEvent.click(screen.getByRole('button', { name: 'RELOAD' }))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('READY')).toBeInTheDocument()

    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    expect(screen.getByText('Weapon jammed.')).toBeInTheDocument()
    expect(onAmmoChange).toHaveBeenLastCalledWith(1)

    fireEvent.click(screen.getByRole('button', { name: 'FIX' }))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('READY')).toBeInTheDocument()

    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    expect(onAmmoChange).toHaveBeenLastCalledWith(0)
    expect(screen.getByText('September 17 selected.')).toBeInTheDocument()
    expect(onDateHit).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(499))
    expect(onDateHit).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onDateHit).toHaveBeenCalledWith(17)
  })

  it('directs an empty range user to feed Pet without selecting a date', () => {
    const onDateHit = vi.fn()

    render(<ShootingRange ammo={0} onAmmoChange={vi.fn()} onDateHit={onDateHit} />)

    fireEvent.click(screen.getByRole('button', { name: 'September 9' }))

    expect(screen.getByText('No ammunition. Feed Pet to continue.')).toBeInTheDocument()
    expect(onDateHit).not.toHaveBeenCalled()
  })

  it('uses a crosshair over enabled date targets', () => {
    render(<ShootingRange ammo={3} onAmmoChange={vi.fn()} onDateHit={vi.fn()} />)

    expect(window.getComputedStyle(screen.getByRole('button', { name: 'September 17' })).cursor).toBe('crosshair')
  })

  it('cancels the pending date transition when unmounted', () => {
    vi.useFakeTimers()
    let ammo = 3
    const onAmmoChange = vi.fn((next: number) => {
      ammo = next
    })
    const onDateHit = vi.fn()
    const view = render(
      <ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    fireEvent.click(screen.getByRole('button', { name: 'RELOAD' }))
    act(() => vi.advanceTimersByTime(1000))
    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))
    fireEvent.click(screen.getByRole('button', { name: 'FIX' }))
    act(() => vi.advanceTimersByTime(1000))
    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: 'September 17' }))

    view.unmount()
    act(() => vi.advanceTimersByTime(500))

    expect(onDateHit).not.toHaveBeenCalled()
  })
})
