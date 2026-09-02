import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PetPanel } from './PetPanel'

afterEach(cleanup)

describe('PetPanel', () => {
  it('turns a local feed choice into three rounds', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} canFeed onFeed={onFeed} />)

    expect(screen.getByText(/Нет боеприпасов/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Печенье' }))
    expect(onFeed).toHaveBeenCalledWith(3, 'Печенье')
    expect(screen.getByText(/Питомец получил «печенье»/)).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Луковица', 'История браузера', 'Печенье'])
    expect(screen.getByRole('complementary')).toHaveClass('pet-panel--fed')
  })

  it('does not feed when feeding is unavailable', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} onFeed={onFeed} canFeed={false} />)

    const cookie = screen.getByRole('button', { name: 'Печенье' })
    expect(cookie).toBeDisabled()
    fireEvent.click(cookie)

    expect(onFeed).not.toHaveBeenCalled()
    expect(screen.queryByText(/Питомец получил «печенье»/)).not.toBeInTheDocument()
  })
})
