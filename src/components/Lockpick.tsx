import { useState, type KeyboardEvent, type PointerEvent } from 'react'
import './Lockpick.css'

type LockpickProps = {
  selectedDay: number
  onSuccess: () => void
}

const PICK_MIN_ANGLE = -60
const PICK_MAX_ANGLE = 60
const MAX_WRONG_ANSWERS = 2
export function Lockpick({ selectedDay, onSuccess }: LockpickProps) {
  const [memoryAnswered, setMemoryAnswered] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [pickAngle, setPickAngle] = useState(PICK_MIN_ANGLE)
  const [failedAttempt, setFailedAttempt] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const sweetSpot = ((selectedDay * 7) % 46) - 23
  const memoryOptions = [selectedDay - 1, selectedDay, selectedDay + 1]

  function answerMemory(day: number) {
    if (memoryAnswered) return
    if (day === selectedDay || wrongAnswers >= MAX_WRONG_ANSWERS) {
      setMemoryAnswered(true)
      return
    }
    setWrongAnswers((count) => count + 1)
  }

  function setAngleFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const progress = (event.clientX - bounds.left) / (bounds.width || 1)
    const nextAngle = Math.round(PICK_MIN_ANGLE + progress * (PICK_MAX_ANGLE - PICK_MIN_ANGLE))
    setPickAngle(Math.max(PICK_MIN_ANGLE, Math.min(PICK_MAX_ANGLE, nextAngle)))
  }

  function attempt() {
    if (isOpen) return

    const aligned = Math.abs(pickAngle - sweetSpot) <= 22
    if (aligned || failedAttempt) {
      setIsOpen(true)
      return
    }

    setFailedAttempt(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      attempt()
    }
  }

  return (
    <section className="lockpick" aria-labelledby="lockpick-title">
      <p className="lockpick__eyebrow">ПРОВЕРКА ДАТЫ // {selectedDay}</p>
      {!memoryAnswered ? (
        <>
          <h2 id="lockpick-title">Контрольный вопрос памяти.</h2>
          <p className="lockpick__lede">Какое число сентября было выбрано?</p>
          <div className="lockpick__memory-options">
            {memoryOptions.map((day) => (
              <button type="button" key={day} onClick={() => answerMemory(day)}>{day}</button>
            ))}
          </div>
          <p className="lockpick__feedback" role="status">
            {wrongAnswers === 0
              ? 'Ответ обязателен. Подсказки отсутствуют.'
              : wrongAnswers >= MAX_WRONG_ANSWERS
                ? 'Память признана несостоятельной. Допуск вынужденно расширен.'
                : 'Ответ отклонён. Попытка записана.'}
          </p>
        </>
      ) : (
        <>
          <h2 id="lockpick-title">Подтвердите дату.</h2>
          <p className="lockpick__lede">Дата заперта.</p>
          <p className="lockpick__memory-note">Ответ принят без улучшения рейтинга.</p>

          <div
        className={`lockpick__stage ${failedAttempt && !isOpen ? 'lockpick__stage--rattle' : ''} ${isOpen ? 'lockpick__stage--open' : ''}`}
        data-testid="lockpick-stage"
        tabIndex={0}
        role="application"
        aria-label="Замок. Перемещайте указатель, затем нажмите или используйте пробел."
        onPointerMove={setAngleFromPointer}
        onClick={attempt}
        onKeyDown={handleKeyDown}
      >
        <span className="lockpick__halo" aria-hidden="true" />
        <span className="lockpick__body" aria-hidden="true">
          <span className="lockpick__keyway" />
          <span className="lockpick__notch" />
        </span>
        <span
          className="lockpick__pick"
          data-testid="pick"
          data-angle={pickAngle}
          style={{ transform: `translateX(-50%) rotate(${pickAngle}deg)` }}
          aria-hidden="true"
        >
          <span />
        </span>
        <span className="lockpick__instruction" aria-hidden="true">ДВИГАЙТЕ ОТМЫЧКУ / ПОВЕРНИТЕ ЗАМОК</span>
      </div>

      {isOpen ? (
        <p className="lockpick__result" role="status">Дата подтверждена.</p>
      ) : (
        <p className="lockpick__feedback" role="status">
          {failedAttempt ? 'Замок сопротивляется. Измените угол.' : 'Найдите допустимое положение.'}
        </p>
      )}

      {!isOpen && (
        <button className="lockpick__turn" type="button" onClick={attempt}>
          ПОВЕРНУТЬ ЗАМОК
        </button>
      )}
      {isOpen && (
        <div className="lockpick__confirm" aria-label="Подтверждение даты">
          <small>ДАТА ОТКРЫТА. ПРОДОЛЖИТЬ?</small>
          {['Да', 'Вероятно', 'Я уже не уверен'].map((choice) => (
            <button
              type="button"
              key={choice}
              disabled={confirmed}
              onClick={() => {
                if (confirmed) return
                setConfirmed(true)
                onSuccess()
              }}
            >{choice}</button>
          ))}
        </div>
      )}
        </>
      )}
    </section>
  )
}
