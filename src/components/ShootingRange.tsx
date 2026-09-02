import { useEffect, useRef, useState } from 'react'
import './ShootingRange.css'

type WeaponState = 'READY' | 'BLANK' | 'JAMMED' | 'EMPTY'
const weaponLabels: Record<WeaponState, string> = { READY: 'ГОТОВ', BLANK: 'ХОЛОСТОЙ', JAMMED: 'ЗАКЛИНИЛО', EMPTY: 'ПУСТО' }

type ShootingRangeProps = {
  ammo: number
  onAmmoChange: (next: number) => void
  onDateHit: (day: number) => void
}

const days = Array.from({ length: 30 }, (_, index) => index + 1)
const SUCCESS_HOLD_MS = 1500

export default function ShootingRange({ ammo, onAmmoChange, onDateHit }: ShootingRangeProps) {
  const [weapon, setWeapon] = useState<WeaponState>(ammo > 0 ? 'READY' : 'EMPTY')
  const [message, setMessage] = useState(ammo > 0 ? 'Выберите дату.' : 'Нет боеприпасов. Покормите Питомца.')
  const [shotStep, setShotStep] = useState(0)
  const [servicing, setServicing] = useState(false)
  const [firing, setFiring] = useState(false)
  const [transitionPending, setTransitionPending] = useState(false)
  const [maskDates, setMaskDates] = useState(false)
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0 })
  const recoilTimer = useRef<number | undefined>(undefined)
  const transitionTimer = useRef<number | undefined>(undefined)
  const maskTimer = useRef<number | undefined>(undefined)
  const unmaskTimer = useRef<number | undefined>(undefined)
  const previousAmmo = useRef(ammo)

  useEffect(() => {
    if (previousAmmo.current === 0 && ammo > 0 && weapon === 'EMPTY') {
      setWeapon('READY')
      setMessage('Выберите дату.')
    }
    if (previousAmmo.current > 0 && ammo === 0 && weapon === 'READY') {
      setWeapon('EMPTY')
      setMessage('Нет боеприпасов. Покормите Питомца.')
    }
    previousAmmo.current = ammo
  }, [ammo, weapon])

  useEffect(() => {
    maskTimer.current = window.setInterval(() => {
      setMaskDates(true)
      unmaskTimer.current = window.setTimeout(() => setMaskDates(false), 700)
    }, 4000)
    return () => {
      window.clearTimeout(recoilTimer.current)
      window.clearTimeout(transitionTimer.current)
      window.clearInterval(maskTimer.current)
      window.clearTimeout(unmaskTimer.current)
    }
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
      setMessage('Нет боеприпасов. Покормите Питомца.')
      return
    }

    const remaining = ammo - 1
    onAmmoChange(remaining)
    flash()

    if (shotStep === 0) {
      setShotStep(1)
      setWeapon('BLANK')
      setMessage('Холостой патрон.')
      return
    }

    if (shotStep === 1) {
      setShotStep(2)
      setWeapon('JAMMED')
      setMessage('Механизм заклинило.')
      return
    }

    setWeapon(remaining > 0 ? 'READY' : 'EMPTY')
    setMessage(`${day} сентября выбрано.`)
    setTransitionPending(true)
    transitionTimer.current = window.setTimeout(() => onDateHit(day), SUCCESS_HOLD_MS)
  }

  function service() {
    if (servicing || (weapon !== 'BLANK' && weapon !== 'JAMMED')) return

    setServicing(true)
    setMessage(weapon === 'JAMMED' ? 'Устранение неполадки.' : 'Перезарядка.')
    window.setTimeout(() => {
      setServicing(false)
      if (ammo > 0) {
        setWeapon('READY')
        setMessage('Выберите дату.')
      } else {
        setWeapon('EMPTY')
        setMessage('Нет боеприпасов. Покормите Питомца.')
      }
    }, 1000)
  }

  const action = weapon === 'JAMMED' ? 'УСТРАНИТЬ' : weapon === 'BLANK' ? 'ПЕРЕЗАРЯДИТЬ' : null

  return (
    <section className={`shooting-range ${firing ? 'shooting-range--recoil' : ''}`} aria-label="Выбор даты на сентябрь 2026">
      <div className="shooting-range__header">
        <div>
          <p className="shooting-range__eyebrow">СЕНТЯБРЬ 2026 // ВЫБОР ДАТЫ</p>
          <h2>Выберите дату.</h2>
        </div>
        <div className={`shooting-range__weapon shooting-range__weapon--${weapon.toLowerCase()}`}>
          <span>ПАТРОНЫ · {ammo}</span>
          <strong>{weaponLabels[weapon]}</strong>
        </div>
      </div>

      <p className="shooting-range__message" role="status">{message}</p>
      {transitionPending && <p className="shooting-range__verification">ПРОВЕРКА СОВПАДЕНИЯ ДАТЫ · 1,5 СЕК.</p>}

      <div
        className="shooting-range__targets"
        data-testid="range-targets"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect()
          setCrosshair({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })
        }}
      >
        {days.map((day) => (
          <button
            className="shooting-range__target"
            key={day}
            aria-label={`${day} сентября`}
            disabled={weapon !== 'READY' || servicing || transitionPending}
            style={weapon === 'READY' && !servicing && !transitionPending ? { cursor: 'crosshair' } : undefined}
            onClick={() => shoot(day)}
          >
            <span>{maskDates ? '?' : day}</span>
          </button>
        ))}
        <span
          className="shooting-range__crosshair"
          data-testid="range-crosshair"
          style={{ left: `${crosshair.x}px`, top: `${crosshair.y}px` }}
          aria-hidden="true"
        />
        {firing && <span className="shooting-range__muzzle" aria-hidden="true" />}
      </div>

      <div className="shooting-range__controls">
        {action && (
          <button className="shooting-range__service" onClick={service} disabled={servicing}>
            {servicing ? 'ПОДОЖДИТЕ' : action}
          </button>
        )}
        {weapon === 'EMPTY' && <span>Покормите Питомца, чтобы продолжить.</span>}
      </div>
    </section>
  )
}
