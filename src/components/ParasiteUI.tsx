import { useState } from 'react'
import type { Phase } from '../phase'

const ads: Record<Phase, string> = {
  home: 'STOP BROWSER FINGERPRINTING — Protect yourself from sites like this one.',
  handshake: 'ARE YOU BEING TRACKED? Yes. FIND OUT MORE',
  range: 'PREMIUM AMMUNITION — Up to 12% fewer blanks.',
  lockpick: 'BUY THURSDAY — Limited availability.',
  details: 'CALENDAR PRO — Still contains advertisements.',
  farewell: 'VPN FOR TOR — Add another layer for no particular reason.',
  done: 'HOT SINGLES IN YOUR TIMEZONE — UTC+3.',
}

export function ParasiteUI({ phase, notice }: { phase: Phase; notice: string }) {
  const [adVisible, setAdVisible] = useState(true)
  return (
    <>
      <div className="fingerprint-toast" role="status">
        <span className="scan-dot" />
        <div><small>LOCAL OBSERVATION</small><p>{notice}</p></div>
      </div>
      {adVisible && (
        <aside className="fake-ad" aria-label="Advertisement">
          <small>ADVERTISEMENT // LOCAL</small>
          <p>{ads[phase]}</p>
          <button type="button" aria-label="Dismiss advertisement" onClick={() => setAdVisible(false)}>×</button>
        </aside>
      )}
    </>
  )
}
