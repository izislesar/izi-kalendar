import { useEffect, useState } from 'react'
import type { Phase } from '../phase'

const ads: Record<Phase, string> = {
  home: 'ОСТАНОВИТЕ ИДЕНТИФИКАЦИЮ — Защититесь от сайтов вроде этого.',
  handshake: 'ВАС ОТСЛЕЖИВАЮТ? Да. УЗНАТЬ БОЛЬШЕ',
  range: 'ПРЕМИАЛЬНЫЕ ПАТРОНЫ — До 12% меньше холостых.',
  lockpick: 'КУПИТЬ ЧЕТВЕРГ — Предложение ограничено.',
  details: 'КАЛЕНДАРЬ PRO — Реклама всё ещё включена.',
  farewell: 'VPN ДЛЯ TOR — Ещё один слой без особой причины.',
  done: 'ГОРЯЧИЕ ЗНАКОМСТВА В ВАШЕМ ЧАСОВОМ ПОЯСЕ — UTC+3.',
}
const interruptions = [
  'Ваше поведение мыши идентифицировано.',
  'Календарь заметил промедление.',
  'Ваше предпочтение вторников записано.',
]

export function ParasiteUI({ phase, notice }: { phase: Phase; notice: string }) {
  const [adVisible, setAdVisible] = useState(true)
  const [interruption, setInterruption] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setInterruption((value) => (value + 1) % interruptions.length), 3500)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <>
      <div className="fingerprint-toast" role="status">
        <span className="scan-dot" />
        <div><small>ЛОКАЛЬНОЕ НАБЛЮДЕНИЕ</small><p>{notice}</p></div>
      </div>
      <div className="interruption-toast" role="status">
        <small>СЛУЖЕБНОЕ УВЕДОМЛЕНИЕ</small>
        <p>{interruptions[interruption]}</p>
      </div>
      {adVisible && (
        <aside className="fake-ad" aria-label="Реклама">
          <small>РЕКЛАМА // ЛОКАЛЬНАЯ</small>
          <p>{ads[phase]}</p>
          <button type="button" aria-label="Закрыть рекламу" onClick={() => setAdVisible(false)}>×</button>
        </aside>
      )}
    </>
  )
}
