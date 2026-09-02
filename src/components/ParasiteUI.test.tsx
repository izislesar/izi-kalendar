import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ParasiteUI } from './ParasiteUI'

describe('ParasiteUI', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })
  it('renders only local text notices and advertisements for the phase', () => {
    render(<ParasiteUI phase="home" notice="Ваш браузер идентифицирован." />)

    expect(screen.getAllByRole('status')[0]).toHaveTextContent('Ваш браузер идентифицирован.')
    expect(screen.getByText(/ОСТАНОВИТЕ ИДЕНТИФИКАЦИЮ/)).toBeInTheDocument()
    expect(document.querySelectorAll('iframe, script, img[src^="http"]')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть рекламу' }))
    expect(screen.queryByRole('complementary', { name: 'Реклама' })).not.toBeInTheDocument()
  })

  it('rotates bounded dry interruption notices on a fixed schedule', () => {
    vi.useFakeTimers()
    render(<ParasiteUI phase="range" notice="Состояние." />)
    expect(screen.getByText('Ваше поведение мыши идентифицировано.')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3500))
    expect(screen.getByText('Календарь заметил промедление.')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3500))
    expect(screen.getByText('Ваше предпочтение вторников записано.')).toBeInTheDocument()
  })
})
