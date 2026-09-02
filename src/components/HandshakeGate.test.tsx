import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HandshakeGate } from './HandshakeGate'

describe('HandshakeGate', () => {
  it('accepts every handshake strength', () => {
    const onComplete = vi.fn()
    render(<HandshakeGate mode="handshake" onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Firm' }))
    expect(onComplete).toHaveBeenCalledWith('Firm')
  })

  it('accepts a farewell before saving', () => {
    const onComplete = vi.fn()
    render(<HandshakeGate mode="farewell" onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Leave respectfully' }))
    expect(onComplete).toHaveBeenCalledWith('Leave respectfully')
  })
})
