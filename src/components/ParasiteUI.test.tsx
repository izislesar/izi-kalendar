import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ParasiteUI } from './ParasiteUI'

describe('ParasiteUI', () => {
  it('renders only local text notices and advertisements for the phase', () => {
    render(<ParasiteUI phase="home" notice="Your browser has been fingerprinted." />)

    expect(screen.getByRole('status')).toHaveTextContent('Your browser has been fingerprinted.')
    expect(screen.getByText(/stop browser fingerprinting/i)).toBeInTheDocument()
    expect(document.querySelectorAll('iframe, script, img[src^="http"]')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss advertisement' }))
    expect(screen.queryByRole('complementary', { name: 'Advertisement' })).not.toBeInTheDocument()
  })
})
