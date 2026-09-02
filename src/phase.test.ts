import { describe, expect, it } from 'vitest'
import { nextPhase, type Phase } from './phase'

describe('phase progression', () => {
  it('moves through the complete meeting path in order', () => {
    const expected: Phase[] = [
      'home',
      'handshake',
      'range',
      'lockpick',
      'details',
      'farewell',
      'done',
    ]

    const actual: Phase[] = ['home']
    while (actual.at(-1) !== 'done') actual.push(nextPhase(actual.at(-1)!))

    expect(actual).toEqual(expected)
  })

  it('keeps the completed phase stable', () => {
    expect(nextPhase('done')).toBe('done')
  })
})
