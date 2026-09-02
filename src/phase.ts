export type Phase =
  | 'home'
  | 'handshake'
  | 'range'
  | 'lockpick'
  | 'details'
  | 'farewell'
  | 'done'

const phases: Phase[] = [
  'home',
  'handshake',
  'range',
  'lockpick',
  'details',
  'farewell',
  'done',
]

export function nextPhase(phase: Phase): Phase {
  const index = phases.indexOf(phase)
  return phases[Math.min(index + 1, phases.length - 1)]
}
