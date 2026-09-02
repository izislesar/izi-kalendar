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

    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    expect(screen.getByText('Холостой патрон.')).toBeInTheDocument()
    expect(onAmmoChange).toHaveBeenLastCalledWith(2)

    fireEvent.click(screen.getByRole('button', { name: 'ПЕРЕЗАРЯДИТЬ' }))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('ГОТОВ')).toBeInTheDocument()

    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    expect(screen.getByText('Механизм заклинило.')).toBeInTheDocument()
    expect(onAmmoChange).toHaveBeenLastCalledWith(1)

    fireEvent.click(screen.getByRole('button', { name: 'УСТРАНИТЬ' }))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('ГОТОВ')).toBeInTheDocument()

    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    expect(onAmmoChange).toHaveBeenLastCalledWith(0)
    expect(screen.getByText('17 сентября выбрано.')).toBeInTheDocument()
    expect(onDateHit).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1499))
    expect(onDateHit).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1))
    expect(onDateHit).toHaveBeenCalledWith(17)
  })

  it('directs an empty range user to feed Pet without selecting a date', () => {
    const onDateHit = vi.fn()

    render(<ShootingRange ammo={0} onAmmoChange={vi.fn()} onDateHit={onDateHit} />)

    fireEvent.click(screen.getByRole('button', { name: '9 сентября' }))

    expect(screen.getByText('Нет боеприпасов. Покормите Питомца.')).toBeInTheDocument()
    expect(onDateHit).not.toHaveBeenCalled()
  })

  it('uses a crosshair over enabled date targets', () => {
    render(<ShootingRange ammo={3} onAmmoChange={vi.fn()} onDateHit={vi.fn()} />)

    expect(window.getComputedStyle(screen.getByRole('button', { name: '17 сентября' })).cursor).toBe('crosshair')
  })

  it('rejects decoy dates without consuming ammunition', () => {
    const onAmmoChange = vi.fn()
    render(<ShootingRange ammo={3} onAmmoChange={onAmmoChange} onDateHit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: '31 сентября — недействительная цель' }))

    expect(screen.getByRole('status')).toHaveTextContent('Дата не существует. Патрон учтён, но не израсходован.')
    expect(onAmmoChange).not.toHaveBeenCalled()
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

    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    fireEvent.click(screen.getByRole('button', { name: 'ПЕРЕЗАРЯДИТЬ' }))
    act(() => vi.advanceTimersByTime(1000))
    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    fireEvent.click(screen.getByRole('button', { name: 'УСТРАНИТЬ' }))
    act(() => vi.advanceTimersByTime(1000))
    view.rerender(<ShootingRange ammo={ammo} onAmmoChange={onAmmoChange} onDateHit={onDateHit} />)
    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))

    view.unmount()
    act(() => vi.advanceTimersByTime(1500))

    expect(onDateHit).not.toHaveBeenCalled()
  })

  it('briefly masks date numbers and exposes a lagging crosshair deterministically', () => {
    vi.useFakeTimers()
    render(<ShootingRange ammo={3} onAmmoChange={vi.fn()} onDateHit={vi.fn()} />)

    const target = screen.getByRole('button', { name: '17 сентября' })
    expect(target).toHaveTextContent('17')
    act(() => vi.advanceTimersByTime(4000))
    expect(target).toHaveTextContent('?')
    act(() => vi.advanceTimersByTime(700))
    expect(target).toHaveTextContent('17')

    fireEvent.pointerMove(screen.getByTestId('range-targets'), { clientX: 120, clientY: 80 })
    expect(screen.getByTestId('range-crosshair')).toHaveStyle({ left: '120px', top: '80px' })
  })
})
