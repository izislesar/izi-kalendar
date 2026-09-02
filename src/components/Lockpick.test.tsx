import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Lockpick } from './Lockpick'

afterEach(() => {
  cleanup()
})

describe('Lockpick', () => {
  function answerMemoryQuestion(container: HTMLElement) {
    const view = within(container)
    expect(view.queryByTestId('lockpick-stage')).not.toBeInTheDocument()
    fireEvent.click(view.getByRole('button', { name: '17' }))
    expect(view.getByText('Ответ принят без улучшения рейтинга.')).toBeInTheDocument()
  }

  it('maps pointer movement across the lock to the pick angle', () => {
    const { container } = render(<Lockpick selectedDay={17} onSuccess={vi.fn()} />)
    const { getByTestId } = within(container)
    answerMemoryQuestion(container)

    const lock = getByTestId('lockpick-stage')
    Object.defineProperty(lock, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 200 }),
    })

    fireEvent.pointerMove(lock, { clientX: 150 })

    expect(getByTestId('pick')).toHaveAttribute('data-angle', '30')
  })

  it('widens the lock, then requires an absurd confirmation', () => {
    const onSuccess = vi.fn()
    const { container } = render(
      <Lockpick selectedDay={17} onSuccess={onSuccess} />,
    )
    const { getByRole, getByTestId, getByText } = within(container)
    answerMemoryQuestion(container)

    fireEvent.keyDown(getByTestId('lockpick-stage'), { key: ' ' })

    expect(getByRole('status')).toHaveTextContent('Замок сопротивляется. Измените угол.')
    expect(onSuccess).not.toHaveBeenCalled()

    fireEvent.keyDown(getByTestId('lockpick-stage'), { key: ' ' })

    expect(getByText('Дата подтверждена.')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(getByRole('button', { name: 'Да' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Вероятно' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Я уже не уверен' })).toBeInTheDocument()
    fireEvent.click(getByRole('button', { name: 'Вероятно' }))
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it.each(['Да', 'Вероятно', 'Я уже не уверен'])('allows confirmation with “%s”', (choice) => {
    const onSuccess = vi.fn()
    const { container, getByRole, getByTestId } = render(<Lockpick selectedDay={17} onSuccess={onSuccess} />)
    answerMemoryQuestion(container)
    fireEvent.click(getByTestId('lockpick-stage'))
    fireEvent.click(getByTestId('lockpick-stage'))
    fireEvent.click(getByRole('button', { name: choice }))
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })
})
