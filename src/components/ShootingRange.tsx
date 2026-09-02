import { useEffect, useRef, useState } from 'react'
import './ShootingRange.css'

type WeaponState = 'READY' | 'BLANK' | 'JAMMED' | 'EMPTY'

type ShootingRangeProps = {
  ammo: number
  onAmmoChange: (next: number) => void
  onDateHit: (day: number) => void
}

const days = Array.from({ length: 30 }, (_, index) => index + 1)
const SUCCESS_HOLD_MS = 500

export default function ShootingRange({ ammo, onAmmoChange, onDateHit }: ShootingRangeProps) {
  const [weapon, setWeapon] = useState<WeaponState>(ammo > 0 ? 'READY' : 'EMPTY')
  const [message, setMessage] = useState(ammo > 0 ? 'Select a date.' : 'No ammunition. Feed Pet to continue.')
  const [shotStep, setShotStep] = useState(0)
  const [servicing, setServicing] = useState(false)
  const [firing, setFiring] = useState(false)
  const [transitionPending, setTransitionPending] = useState(false)
  const recoilTimer = useRef<number | undefined>(undefined)
  const transitionTimer = useRef<number | undefined>(undefined)
  const previousAmmo = useRef(ammo)

  useEffect(() => {
    if (previousAmmo.current === 0 && ammo > 0 && weapon === 'EMPTY') {
      setWeapon('READY')
      setMessage('Select a date.')
    }
    if (previousAmmo.current > 0 && ammo === 0 && weapon === 'READY') {
      setWeapon('EMPTY')
      setMessage('No ammunition. Feed Pet to continue.')
    }
    previousAmmo.current = ammo
  }, [ammo, weapon])

  useEffect(() => () => {
    window.clearTimeout(recoilTimer.current)
    window.clearTimeout(transitionTimer.current)
  }, [])

  function flash() {
    setFiring(true)
    window.clearTimeout(recoilTimer.current)
    recoilTimer.current = window.setTimeout(() => setFiring(false), 180)
  }

  function shoot(day: number) {
    if (weapon !== 'READY' || servicing || transitionPending) return

    if (ammo <= 0) {
      setWeapon('EMPTY')
      setMessage('No ammunition. Feed Pet to continue.')
      return
    }

    const remaining = ammo - 1
    onAmmoChange(remaining)
    flash()

    if (shotStep === 0) {
      setShotStep(1)
      setWeapon('BLANK')
      setMessage('Blank round.')
      return
    }

    if (shotStep === 1) {
      setShotStep(2)
      setWeapon('JAMMED')
      setMessage('Weapon jammed.')
      return
    }

    setWeapon(remaining > 0 ? 'READY' : 'EMPTY')
    setMessage(`September ${day} selected.`)
    setTransitionPending(true)
    transitionTimer.current = window.setTimeout(() => onDateHit(day), SUCCESS_HOLD_MS)
  }

  function service() {
    if (servicing || (weapon !== 'BLANK' && weapon !== 'JAMMED')) return

    setServicing(true)
    setMessage(weapon === 'JAMMED' ? 'Fixing.' : 'Reloading.')
    window.setTimeout(() => {
      setServicing(false)
      if (ammo > 0) {
        setWeapon('READY')
        setMessage('Select a date.')
      } else {
        setWeapon('EMPTY')
        setMessage('No ammunition. Feed Pet to continue.')
      }
    }, 1000)
  }

  const action = weapon === 'JAMMED' ? 'FIX' : weapon === 'BLANK' ? 'RELOAD' : null

  return (
    <section className={`shooting-range ${firing ? 'shooting-range--recoil' : ''}`} aria-label="September 2026 date range">
      <div className="shooting-range__header">
        <div>
          <p className="shooting-range__eyebrow">SEPTEMBER 2026 // DATE ACQUISITION</p>
          <h2>Select a date.</h2>
        </div>
        <div className={`shooting-range__weapon shooting-range__weapon--${weapon.toLowerCase()}`}>
          <span>AMMO {ammo}</span>
          <strong>{weapon}</strong>
        </div>
      </div>

      <p className="shooting-range__message" role="status">{message}</p>

      <div className="shooting-range__targets">
        {days.map((day) => (
          <button
            className="shooting-range__target"
            key={day}
            aria-label={`September ${day}`}
            disabled={weapon !== 'READY' || servicing || transitionPending}
            style={weapon === 'READY' && !servicing && !transitionPending ? { cursor: 'crosshair' } : undefined}
            onClick={() => shoot(day)}
          >
            <span>{day}</span>
          </button>
        ))}
        {firing && <span className="shooting-range__muzzle" aria-hidden="true" />}
      </div>

      <div className="shooting-range__controls">
        {action && (
          <button className="shooting-range__service" onClick={service} disabled={servicing}>
            {servicing ? 'PLEASE WAIT' : action}
          </button>
        )}
        {weapon === 'EMPTY' && <span>Feed Pet to continue.</span>}
      </div>
    </section>
  )
}
