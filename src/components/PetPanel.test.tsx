import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PetPanel } from './PetPanel'

afterEach(cleanup)

describe('PetPanel', () => {
  it('turns a local feed choice into three rounds', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} canFeed onFeed={onFeed} />)

    expect(screen.getByText(/no ammunition/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cookie' }))
    expect(onFeed).toHaveBeenCalledWith(3, 'Cookie')
    expect(screen.getByText(/pet consumed cookie/i)).toBeInTheDocument()
  })

  it('does not feed when feeding is unavailable', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} onFeed={onFeed} canFeed={false} />)

    const cookie = screen.getByRole('button', { name: 'Cookie' })
    expect(cookie).toBeDisabled()
    fireEvent.click(cookie)

    expect(onFeed).not.toHaveBeenCalled()
    expect(screen.queryByText(/pet consumed cookie/i)).not.toBeInTheDocument()
  })
})
