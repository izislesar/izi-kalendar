import { useState, type FormEvent } from 'react'

export type CalendarEvent = {
  title: string
  date: string
  time: string
  duration: string
}

export function MeetingDetails({ selectedDay, onSave }: { selectedDay: number; onSave: (event: CalendarEvent) => void }) {
  const [title, setTitle] = useState('Important meeting')
  const [time, setTime] = useState('14:00')
  const [duration, setDuration] = useState('30')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({ title, date: `2026-09-${String(selectedDay).padStart(2, '0')}`, time, duration })
  }

  return (
    <form className="details panel" onSubmit={submit}>
      <p className="eyebrow">MEETING RECORD // DATE CONFIRMED</p>
      <h1>Provide details.</h1>
      <div className="form-grid">
        <label>Title<input aria-label="Title" required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Time<input aria-label="Time" type="time" required value={time} onChange={(event) => setTime(event.target.value)} /></label>
        <label>Duration<select aria-label="Duration" value={duration} onChange={(event) => setDuration(event.target.value)}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option></select></label>
      </div>
      <button className="primary" type="submit">SAVE MEETING</button>
    </form>
  )
}

export function EventCard({ event }: { event: CalendarEvent }) {
  const day = Number(event.date.slice(-2))
  return (
    <article className="event-card" aria-label="Created meeting">
      <div className="event-date"><span>SEP</span><strong>{day}</strong></div>
      <div><p className="eyebrow">MEETING CREATED</p><h2>{event.title}</h2><p>{day} September 2026 · {event.time} · {event.duration} minutes</p></div>
      <span className="event-state">LOCAL</span>
    </article>
  )
}
