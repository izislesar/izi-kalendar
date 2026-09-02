import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HandshakeGate } from './HandshakeGate'

describe('HandshakeGate', () => {
  it('accepts every handshake strength', () => {
    const onComplete = vi.fn()
    render(<HandshakeGate mode="handshake" onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Твёрдое' }))
    expect(onComplete).toHaveBeenCalledWith('Твёрдое')
  })

  it('accepts a farewell before saving', () => {
    const onComplete = vi.fn()
    render(<HandshakeGate mode="farewell" onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Уйти с уважением' }))
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByText(/Прощание выбрано/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'ПОДТВЕРДИТЬ ПРОЩАНИЕ' }))
    expect(onComplete).toHaveBeenCalledWith('Уйти с уважением')
  })
})
