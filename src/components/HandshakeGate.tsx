type HandshakeGateProps = {
  mode: 'handshake' | 'farewell'
  onComplete: (choice: string) => void
}

const choices = {
  handshake: ['Firm', 'Weak', 'Uncomfortably long'],
  farewell: ['Goodbye', 'Final handshake', 'Leave respectfully'],
}

export function HandshakeGate({ mode, onComplete }: HandshakeGateProps) {
  const farewell = mode === 'farewell'
  return (
    <section className="gate panel">
      <p className="eyebrow">{farewell ? 'SESSION TERMINATION' : 'IDENTITY PROTOCOL'}</p>
      <h1>{farewell ? 'Calendar expected a farewell.' : 'Handshake required.'}</h1>
      <p className="lede">{farewell ? 'Conclude the interaction appropriately.' : 'Select an acceptable grip.'}</p>
      <div className="choice-grid">
        {choices[mode].map((choice) => (
          <button className="choice" key={choice} onClick={() => onComplete(choice)}>{choice}</button>
        ))}
      </div>
    </section>
  )
}
