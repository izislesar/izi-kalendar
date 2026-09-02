import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

async function completeDemo(title: string) {
  const startedAt = Date.now()
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'СОЗДАТЬ ВСТРЕЧУ' }))
  fireEvent.click(screen.getByRole('button', { name: 'Твёрдое' }))
  fireEvent.click(screen.getByRole('button', { name: 'Печенье' }))

  fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
  fireEvent.click(screen.getByRole('button', { name: 'ПЕРЕЗАРЯДИТЬ' }))
  await waitFor(() => expect(screen.getByText('ГОТОВ')).toBeInTheDocument(), { timeout: 1500 })

  fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
  fireEvent.click(screen.getByRole('button', { name: 'УСТРАНИТЬ' }))
  await waitFor(() => expect(screen.getByText('ГОТОВ')).toBeInTheDocument(), { timeout: 1500 })

  fireEvent.click(screen.getByRole('button', { name: '17 сентября' }))
  expect(screen.getByText('17 сентября выбрано.')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByText('Подтвердите дату.')).toBeInTheDocument(), { timeout: 2200 })
  fireEvent.click(screen.getByRole('button', { name: 'ПОВЕРНУТЬ ЗАМОК' }))
  fireEvent.click(screen.getByRole('button', { name: 'ПОВЕРНУТЬ ЗАМОК' }))
  fireEvent.click(screen.getByRole('button', { name: 'Да' }))
  await waitFor(() => expect(screen.getByLabelText('Название')).toBeInTheDocument(), { timeout: 1000 })
  fireEvent.change(screen.getByLabelText('Название'), { target: { value: title } })
  fireEvent.click(screen.getByRole('button', { name: 'СОХРАНИТЬ ВСТРЕЧУ' }))
  fireEvent.click(screen.getByRole('button', { name: 'До свидания' }))

  expect(screen.getByRole('article', { name: 'Созданная встреча' })).toHaveTextContent(title)
  return Date.now() - startedAt
}

describe('timed demo smoke path', () => {
  afterEach(cleanup)

  it('completes twice with real service timers under two minutes', async () => {
    const first = await completeDemo('Первый прогон')
    cleanup()
    const second = await completeDemo('Второй прогон')
    expect(first).toBeLessThan(120_000)
    expect(second).toBeLessThan(120_000)
  }, 10_000)
})
