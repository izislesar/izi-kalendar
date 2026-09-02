import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PetPanel } from './PetPanel'

afterEach(cleanup)

describe('PetPanel', () => {
  it('turns each local food into its fixed one-to-three round grant and updates flavor state', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} canFeed onFeed={onFeed} />)

    expect(screen.getByText(/Нет боеприпасов/)).toBeInTheDocument()
    expect(screen.getByText(/ГОЛОД: 87%/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'История браузера · 3' }))
    expect(onFeed).toHaveBeenCalledWith(3, 'История браузера')
    expect(screen.getByText(/Питомец получил «история браузера»/)).toHaveTextContent('+3 патрона')
    expect(screen.getByText(/ЛОЯЛЬНОСТЬ: 11\/100/)).toBeInTheDocument()
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Печенье · 1', 'Луковица · 2', 'История браузера · 3'])
    expect(screen.getByRole('complementary')).toHaveClass('pet-panel--fed')
  })

  it('does not feed when feeding is unavailable', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} onFeed={onFeed} canFeed={false} />)

    const cookie = screen.getByRole('button', { name: 'Печенье · 1' })
    expect(cookie).toBeDisabled()
    fireEvent.click(cookie)

    expect(onFeed).not.toHaveBeenCalled()
    expect(screen.queryByText(/Питомец получил «печенье»/)).not.toBeInTheDocument()
  })
})
