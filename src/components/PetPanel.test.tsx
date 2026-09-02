import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PetPanel } from './PetPanel'

describe('PetPanel', () => {
  it('turns a local feed choice into three rounds', () => {
    const onFeed = vi.fn()
    render(<PetPanel ammo={0} onFeed={onFeed} />)

    expect(screen.getByText(/no ammunition/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cookie' }))
    expect(onFeed).toHaveBeenCalledWith(3, 'Cookie')
    expect(screen.getByText(/pet consumed cookie/i)).toBeInTheDocument()
  })
})
