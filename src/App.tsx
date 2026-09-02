import { useState } from 'react'
import { nextPhase, type Phase } from './phase'

const phaseCopy: Record<Phase, { eyebrow: string; title: string; body: string }> = {
  home: {
    eyebrow: 'SECURE CONNECTION ESTABLISHED',
    title: 'Calendar is waiting.',
    body: 'One appointment may be created at this time.',
  },
  handshake: {
    eyebrow: 'IDENTITY PROTOCOL',
    title: 'Handshake required.',
    body: 'Calendar must establish a working relationship.',
  },
  range: {
    eyebrow: 'DATE ACQUISITION',
    title: 'Select a date.',
    body: 'Date-selection equipment will be issued here.',
  },
  lockpick: {
    eyebrow: 'DATE VERIFICATION',
    title: 'Confirm selected date.',
    body: 'The selected date remains locked.',
  },
  details: {
    eyebrow: 'MEETING RECORD',
    title: 'Provide details.',
    body: 'Title, time, and duration are required.',
  },
  farewell: {
    eyebrow: 'SESSION TERMINATION',
    title: 'Calendar expected a farewell.',
    body: 'Conclude the interaction appropriately.',
  },
  done: {
    eyebrow: 'RECORD ACCEPTED',
    title: 'Meeting created.',
    body: 'Calendar noticed that.',
  },
}

function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const copy = phaseCopy[phase]

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Calendar home">
          <span className="brand-mark">C</span>
          <span>Calendar</span>
        </a>
        <div className="connection"><span /> ONION ROUTE ACTIVE</div>
      </header>

      <section className="workspace" data-phase={phase}>
        <div className="status-rail">
          <p>PROTOCOL 09.02</p>
          <p>LOCAL SESSION</p>
          <p>NO SYNC</p>
        </div>
        <article className="phase-card">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="lede">{copy.body}</p>
          {phase !== 'done' && (
            <button className="primary" onClick={() => setPhase(nextPhase(phase))}>
              {phase === 'home' ? 'CREATE MEETING' : 'CONTINUE'}
            </button>
          )}
        </article>
      </section>

      <footer>
        <span>CALENDAR SYSTEMS // PRIVATE APPOINTMENT INFRASTRUCTURE</span>
        <span>SESSION: LOCAL</span>
      </footer>
    </main>
  )
}

export default App
