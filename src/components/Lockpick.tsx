import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import './Lockpick.css'

type LockpickProps = {
  selectedDay: number
  onSuccess: () => void
}

const PICK_MIN_ANGLE = -60
const PICK_MAX_ANGLE = 60
const SUCCESS_HOLD_MS = 500

export function Lockpick({ selectedDay, onSuccess }: LockpickProps) {
  const [pickAngle, setPickAngle] = useState(PICK_MIN_ANGLE)
  const [failedAttempt, setFailedAttempt] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const successTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(successTimer.current), [])

  const sweetSpot = ((selectedDay * 7) % 46) - 23

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
      successTimer.current = window.setTimeout(onSuccess, SUCCESS_HOLD_MS)
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
      <p className="lockpick__eyebrow">DATE VERIFICATION // {selectedDay}</p>
      <h2 id="lockpick-title">Confirm selected date.</h2>
      <p className="lockpick__lede">Date is locked.</p>

      <div
        className={`lockpick__stage ${failedAttempt && !isOpen ? 'lockpick__stage--rattle' : ''} ${isOpen ? 'lockpick__stage--open' : ''}`}
        data-testid="lockpick-stage"
        tabIndex={0}
        role="application"
        aria-label="Lock pick. Move the pointer to position the pick, then click or press Space to turn the lock."
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
        <span className="lockpick__instruction" aria-hidden="true">MOVE PICK / TURN LOCK</span>
      </div>

      {isOpen ? (
        <p className="lockpick__result" role="status">Date confirmed.</p>
      ) : (
        <p className="lockpick__feedback" role="status">
          {failedAttempt ? 'Lock rattles. Adjust the pick.' : 'Find the lock’s acceptable position.'}
        </p>
      )}

      {!isOpen && (
        <button className="lockpick__turn" type="button" onClick={attempt}>
          TURN LOCK
        </button>
      )}
    </section>
  )
}
