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
    expect(screen.getByText('ДОВЕРИЕ 41/100')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'История браузера · 3' }))
    expect(screen.getByText('Предпочтения «история браузера» идентифицированы.')).toBeInTheDocument()

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
    expect(screen.getByText('Контрольный вопрос памяти.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '17' }))
    expect(screen.getByText('Подтвердите дату.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ПОВЕРНУТЬ ЗАМОК' }))
    fireEvent.click(screen.getByRole('button', { name: 'ПОВЕРНУТЬ ЗАМОК' }))
    expect(screen.getByText('Дата подтверждена.')).toBeInTheDocument()
    expect(screen.queryByLabelText('Название')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Вероятно' }))

    fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Обзор демо' } })
    fireEvent.click(screen.getByRole('button', { name: 'РАЗРЕШИТЬ ОБЫЧНЫЕ МИНУТЫ' }))
    fireEvent.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ДОСТУП К МИНУТАМ' }))
    fireEvent.click(screen.getByRole('button', { name: 'СОХРАНИТЬ ВСТРЕЧУ' }))
    fireEvent.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ НАЗВАНИЕ' }))
    fireEvent.click(screen.getByRole('button', { name: 'СОХРАНИТЬ ПРОБЕЛЫ' }))
    fireEvent.click(screen.getByRole('button', { name: 'До свидания' }))
    fireEvent.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ПРОЩАНИЕ' }))

    expect(screen.getByText('Встреча ещё не создана.')).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Созданная встреча' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'ЗАВЕРШИТЬ СОЗДАНИЕ' }))
    fireEvent.click(screen.getByRole('button', { name: 'Признать неизбежность' }))

    expect(screen.getByRole('article', { name: 'Созданная встреча' })).toHaveTextContent('Обзор демо')
    expect(screen.getByText('Встреча создана.')).toBeInTheDocument()
  })

  it('keeps Pet visible but prevents feeding and ammunition changes on Home', () => {
    render(<App />)

    const cookie = screen.getByRole('button', { name: 'Печенье · 1' })
    expect(screen.getByRole('complementary', { name: 'Питомец и боеприпасы' })).toBeInTheDocument()
    expect(cookie).toBeDisabled()

    fireEvent.click(cookie)
    expect(screen.getByText('0 ПАТРОНА')).toBeInTheDocument()
    expect(screen.queryByText(/Питомец получил/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'СОЗДАТЬ ВСТРЕЧУ' }))
    fireEvent.click(screen.getByRole('button', { name: 'Твёрдое' }))

    expect(screen.getByText('0 ПАТРОНА')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Печенье · 1' })).toBeEnabled()
  })
})
