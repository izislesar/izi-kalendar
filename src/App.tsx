import { useState } from 'react'
import { EventCard, MeetingDetails, type CalendarEvent } from './components/MeetingDetails'
import { HandshakeGate } from './components/HandshakeGate'
import { Lockpick } from './components/Lockpick'
import { ParasiteUI } from './components/ParasiteUI'
import { PetPanel } from './components/PetPanel'
import ShootingRange from './components/ShootingRange'
import type { Phase } from './phase'

function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const [ammo, setAmmo] = useState(0)
  const [selectedDay, setSelectedDay] = useState(17)
  const [pendingEvent, setPendingEvent] = useState<CalendarEvent | null>(null)
  const [createdEvent, setCreatedEvent] = useState<CalendarEvent | null>(null)
  const [notice, setNotice] = useState('Your browser has been fingerprinted.')

  const acceptHandshake = () => {
    setNotice("Handshake accepted. Calendar's opinion of you has changed.")
    setPhase('range')
  }

  const feedPet = (rounds: number, food: string) => {
    setAmmo(rounds)
    setNotice(`Your ${food.toLowerCase()} preferences have been fingerprinted.`)
  }

  const selectDate = (day: number) => {
    setSelectedDay(day)
    setNotice('Your shooting style has been fingerprinted.')
    setPhase('lockpick')
  }

  const confirmDate = () => {
    setNotice('Your lockpicking behavior has been fingerprinted.')
    setPhase('details')
  }

  const requestSave = (event: CalendarEvent) => {
    setPendingEvent(event)
    setNotice('Calendar expected a farewell.')
    setPhase('farewell')
  }

  const finish = () => {
    if (!pendingEvent) return
    setCreatedEvent(pendingEvent)
    setNotice('Your meeting has been fingerprinted.')
    setPhase('done')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Calendar home">
          <span className="brand-mark">C</span><span>Calendar</span>
        </a>
        <div className="connection"><span /> ONION ROUTE ACTIVE</div>
      </header>

      <ParasiteUI phase={phase} notice={notice} />
      {(phase === 'home' || phase === 'range') && (
        <PetPanel ammo={ammo} canFeed={phase === 'range'} onFeed={feedPet} />
      )}

      <section className="workspace" data-phase={phase}>
        <div className="status-rail">
          <p>PROTOCOL 09.02</p><p>LOCAL SESSION</p><p>NO SYNC</p>
        </div>

        {phase === 'home' && (
          <article className="phase-card">
            <p className="eyebrow">SECURE CONNECTION ESTABLISHED</p>
            <h1>Calendar is waiting.</h1>
            <p className="lede">One appointment may be created at this time.</p>
            <button className="primary" onClick={() => setPhase('handshake')}>CREATE MEETING</button>
          </article>
        )}
        {phase === 'handshake' && <HandshakeGate mode="handshake" onComplete={acceptHandshake} />}
        {phase === 'range' && <ShootingRange ammo={ammo} onAmmoChange={setAmmo} onDateHit={selectDate} />}
        {phase === 'lockpick' && <Lockpick selectedDay={selectedDay} onSuccess={confirmDate} />}
        {phase === 'details' && <MeetingDetails selectedDay={selectedDay} onSave={requestSave} />}
        {phase === 'farewell' && <HandshakeGate mode="farewell" onComplete={finish} />}
        {phase === 'done' && createdEvent && (
          <section className="done-panel panel">
            <p className="eyebrow">RECORD ACCEPTED</p>
            <h1>Meeting created.</h1>
            <p className="lede">Thank you for respecting Calendar.</p>
            <EventCard event={createdEvent} />
          </section>
        )}
      </section>

      <footer>
        <span>CALENDAR SYSTEMS // PRIVATE APPOINTMENT INFRASTRUCTURE</span>
        <span>SESSION: LOCAL</span>
      </footer>
    </main>
  )
}

export default App
