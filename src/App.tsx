import { useState } from 'react'
import { EventCard, MeetingDetails, type CalendarEvent } from './components/MeetingDetails'
import { HandshakeGate } from './components/HandshakeGate'
import { Lockpick } from './components/Lockpick'
import { ParasiteUI } from './components/ParasiteUI'
import { PetPanel } from './components/PetPanel'
import ShootingRange from './components/ShootingRange'
import type { Phase } from './phase'

type Completion = 'idle' | 'revealed' | 'confirm'

const trustByHandshake: Record<string, number> = {
  'Твёрдое': 41,
  'Слабое': 7,
  'Неприлично долгое': 88,
}

const finalChoices = ['Создать всё-таки', 'Признать неизбежность', 'Прекратить сопротивление']

function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const [ammo, setAmmo] = useState(0)
  const [selectedDay, setSelectedDay] = useState(17)
  const [trust, setTrust] = useState<number | null>(null)
  const [completion, setCompletion] = useState<Completion>('idle')
  const [pendingEvent, setPendingEvent] = useState<CalendarEvent | null>(null)
  const [createdEvent, setCreatedEvent] = useState<CalendarEvent | null>(null)
  const [notice, setNotice] = useState('Ваш браузер идентифицирован.')

  const acceptHandshake = (choice: string) => {
    setTrust(trustByHandshake[choice] ?? 41)
    setNotice('Рукопожатие принято. Мнение Календаря о вас изменилось.')
    setPhase('range')
  }

  const feedPet = (rounds: number, food: string) => {
    setAmmo((current) => current + rounds)
    setNotice(`Предпочтения «${food.toLowerCase()}» идентифицированы.`)
  }

  const selectDate = (day: number) => {
    setSelectedDay(day)
    setNotice('Ваш стиль стрельбы идентифицирован.')
    setPhase('lockpick')
  }

  const confirmDate = () => {
    setNotice('Ваше поведение при вскрытии замка идентифицировано.')
    setPhase('details')
  }

  const requestSave = (event: CalendarEvent) => {
    setPendingEvent(event)
    setNotice('Календарь ожидал прощания.')
    setPhase('farewell')
  }

  const revealIncompletion = () => {
    setCompletion('revealed')
    setNotice('Прощание принято. Встреча не создана.')
  }

  const finish = () => {
    if (!pendingEvent) return
    setCreatedEvent(pendingEvent)
    setNotice('Ваша встреча идентифицирована.')
    setPhase('done')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Главная Календаря">
          <span className="brand-mark">К</span><span>Календарь</span>
        </a>
        <div className="connection"><span /> ONION-МАРШРУТ АКТИВЕН</div>
      </header>

      <ParasiteUI phase={phase} notice={notice} />
      {(phase === 'home' || phase === 'range') && (
        <PetPanel ammo={ammo} canFeed={phase === 'range'} onFeed={feedPet} />
      )}

      <section className="workspace" data-phase={phase}>
        <div className="status-rail">
          <p>ПРОТОКОЛ 09.02</p><p>ЛОКАЛЬНАЯ СЕССИЯ</p><p>БЕЗ СИНХРОНИЗАЦИИ</p>
          {trust !== null && <p>ДОВЕРИЕ {trust}/100</p>}
        </div>

        {phase === 'home' && (
          <article className="phase-card">
            <p className="eyebrow">ЗАЩИЩЁННОЕ СОЕДИНЕНИЕ УСТАНОВЛЕНО</p>
            <h1>Календарь ожидает.</h1>
            <p className="lede">В данный момент может быть создана одна встреча.</p>
            <button className="primary" onClick={() => setPhase('handshake')}>СОЗДАТЬ ВСТРЕЧУ</button>
          </article>
        )}
        {phase === 'handshake' && <HandshakeGate mode="handshake" onComplete={acceptHandshake} />}
        {phase === 'range' && <ShootingRange ammo={ammo} onAmmoChange={setAmmo} onDateHit={selectDate} />}
        {phase === 'lockpick' && <Lockpick selectedDay={selectedDay} onSuccess={confirmDate} />}
        {phase === 'details' && <MeetingDetails selectedDay={selectedDay} onSave={requestSave} />}
        {phase === 'farewell' && completion === 'idle' && (
          <HandshakeGate mode="farewell" onComplete={revealIncompletion} />
        )}
        {phase === 'farewell' && completion === 'revealed' && (
          <section className="panel">
            <p className="eyebrow">ЗАВЕРШЕНИЕ СЕССИИ // ОТЛОЖЕНО</p>
            <h1>Встреча ещё не создана.</h1>
            <p className="lede">Прощание принято, но недостаточно. Кнопка завершения перемещена в служебную зону.</p>
          </section>
        )}
        {phase === 'farewell' && completion === 'confirm' && (
          <section className="panel">
            <p className="eyebrow">ФИНАЛЬНАЯ ИНСТАНЦИЯ</p>
            <h1>Последнее подтверждение.</h1>
            <p className="lede">Календарь обязан убедиться, что вы подтверждаете подтверждение.</p>
            <div className="choice-grid">
              {finalChoices.map((choice) => (
                <button className="choice" key={choice} onClick={finish}>{choice}</button>
              ))}
            </div>
          </section>
        )}
        {phase === 'done' && createdEvent && (
          <section className="done-panel panel">
            <p className="eyebrow">ЗАПИСЬ ПРИНЯТА</p>
            <h1>Встреча создана.</h1>
            <p className="lede">Благодарим за уважение к Календарю.</p>
            <EventCard event={createdEvent} />
          </section>
        )}
      </section>

      {phase === 'farewell' && completion === 'revealed' && (
        <div className="finalize-strip">
          <small>СЛУЖЕБНАЯ ЗОНА // НЕ ЯВЛЯЕТСЯ КНОПКОЙ СОХРАНЕНИЯ</small>
          <button type="button" onClick={() => setCompletion('confirm')}>ЗАВЕРШИТЬ СОЗДАНИЕ</button>
        </div>
      )}

      <footer>
        <span>СИСТЕМЫ КАЛЕНДАРЯ // ЧАСТНАЯ ИНФРАСТРУКТУРА ВСТРЕЧ</span>
        <span>СЕССИЯ: ЛОКАЛЬНАЯ</span>
      </footer>
    </main>
  )
}

export default App
