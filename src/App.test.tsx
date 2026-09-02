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

    fireEvent.click(screen.getByRole('button', { name: 'СОЗДАТЬ ВСТРЕЧУ' }))
    fireEvent.click(screen.getByRole('button', { name: 'Твёрдое' }))

    fireEvent.click(screen.getByRole('button', { name: 'Печенье' }))
    expect(screen.getByText('Предпочтения «печенье» идентифицированы.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    expect(screen.getByText('Холостой патрон.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'ПЕРЕЗАРЯДИТЬ' }))
    act(() => vi.advanceTimersByTime(1000))

    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    expect(screen.getByText('Механизм заклинило.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'УСТРАНИТЬ' }))
    act(() => vi.advanceTimersByTime(1000))

    fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
    expect(screen.getByText('17 сентября выбрано.')).toBeInTheDocument()
    expect(screen.queryByText('Подтвердите дату.')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1499))
    expect(screen.getByText('17 сентября выбрано.')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByText('Подтвердите дату.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ПОВЕРНУТЬ ЗАМОК' }))
    fireEvent.click(screen.getByRole('button', { name: 'ПОВЕРНУТЬ ЗАМОК' }))
    expect(screen.getByText('Дата подтверждена.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Название')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Вероятно' }))

    fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Обзор демо' } })
    fireEvent.click(screen.getByRole('button', { name: 'СОХРАНИТЬ ВСТРЕЧУ' }))
    fireEvent.click(screen.getByRole('button', { name: 'До свидания' }))

    expect(screen.getByRole('article', { name: 'Созданная встреча' })).toHaveTextContent('Обзор демо')
    expect(screen.getByText('Встреча создана.')).toBeInTheDocument()
  })

  it('keeps Pet visible but prevents feeding and ammunition changes on Home', () => {
    render(<App />)

    const cookie = screen.getByRole('button', { name: 'Печенье' })
    expect(screen.getByRole('complementary', { name: 'Питомец и боеприпасы' })).toBeInTheDocument()
    expect(cookie).toBeDisabled()

    fireEvent.click(cookie)
    expect(screen.getByText('0 ПАТРОНА')).toBeInTheDocument()
    expect(screen.queryByText(/Питомец получил/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'СОЗДАТЬ ВСТРЕЧУ' }))
    fireEvent.click(screen.getByRole('button', { name: 'Твёрдое' }))

    expect(screen.getByText('0 ПАТРОНА')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Печенье' })).toBeEnabled()
  })
})
