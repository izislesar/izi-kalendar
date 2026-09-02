import { useState, type FormEvent } from 'react'

export type CalendarEvent = {
  title: string
  date: string
  time: string
  duration: string
}

export function MeetingDetails({ selectedDay, onSave }: { selectedDay: number; onSave: (event: CalendarEvent) => void }) {
  const [title, setTitle] = useState('Важная встреча')
  const [time, setTime] = useState('14:27')
  const [duration, setDuration] = useState('30')
  const [precisionRequested, setPrecisionRequested] = useState(false)
  const [precisionUnlocked, setPrecisionUnlocked] = useState(false)
  const [saveStep, setSaveStep] = useState(0)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (saveStep === 0) {
      setSaveStep(1)
      return
    }
  }
  const finishSave = () => {
    onSave({ title, date: `2026-09-${String(selectedDay).padStart(2, '0')}`, time, duration })
  }

  return (
    <form className="details panel" onSubmit={submit}>
      <p className="eyebrow">ЗАПИСЬ ВСТРЕЧИ // ДАТА ПОДТВЕРЖДЕНА</p>
      <h1>Укажите детали.</h1>
      <div className="form-grid">
        <label>Название<input aria-label="Название" required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label>Время<input aria-label="Время" type="time" step={precisionUnlocked ? 60 : 1020} required value={time} onChange={(event) => setTime(event.target.value)} /></label>
        <label>Длительность<select aria-label="Длительность" value={duration} onChange={(event) => setDuration(event.target.value)}><option value="15">15 минут</option><option value="30">30 минут</option><option value="60">60 минут</option></select></label>
      </div>
      <div className="minute-restriction">
        <span>{precisionUnlocked ? 'Обычные минуты временно разрешены.' : 'Доступны только служебные интервалы по 17 минут.'}</span>
        {!precisionUnlocked && !precisionRequested && (
          <button type="button" onClick={() => setPrecisionRequested(true)}>РАЗРЕШИТЬ ОБЫЧНЫЕ МИНУТЫ</button>
        )}
        {precisionRequested && !precisionUnlocked && (
          <button type="button" onClick={() => setPrecisionUnlocked(true)}>ПОДТВЕРДИТЬ ДОСТУП К МИНУТАМ</button>
        )}
      </div>
      <button className="primary" type="submit">СОХРАНИТЬ ВСТРЕЧУ</button>
      {saveStep >= 1 && (
        <div className="save-confirm">
          <small>НАЗВАНИЕ ЗАФИКСИРОВАНО: «{title.toUpperCase()}». ОТКАЗ НЕ ПРЕДУСМОТРЕН.</small>
          <button type="button" onClick={() => setSaveStep(2)}>ПОДТВЕРДИТЬ НАЗВАНИЕ</button>
        </div>
      )}
      {saveStep >= 2 && (
        <div className="save-confirm save-confirm--spaces">
          <small>В НАЗВАНИИ ОБНАРУЖЕНЫ ПРОБЕЛЫ. ОНИ БУДУТ СОХРАНЕНЫ БЕЗ ИЗМЕНЕНИЙ.</small>
          <button type="button" onClick={finishSave}>СОХРАНИТЬ ПРОБЕЛЫ</button>
        </div>
      )}
    </form>
  )
}

export function EventCard({ event }: { event: CalendarEvent }) {
  const day = Number(event.date.slice(-2))
  return (
    <article className="event-card" aria-label="Созданная встреча">
      <div className="event-date"><span>СЕН</span><strong>{day}</strong></div>
      <div><p className="eyebrow">ВСТРЕЧА СОЗДАНА</p><h2>{event.title}</h2><p>{day} сентября 2026 · {event.time} · {event.duration} минут</p></div>
      <span className="event-state">ЛОКАЛЬНО</span>
    </article>
  )
}
