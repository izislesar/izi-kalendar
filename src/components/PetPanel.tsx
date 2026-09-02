import { useState } from 'react'

type PetPanelProps = {
  ammo: number
  onFeed: (rounds: number, food: string) => void
}

export function PetPanel({ ammo, onFeed }: PetPanelProps) {
  const [lastFood, setLastFood] = useState<string | null>(null)
  const feed = (food: string) => {
    setLastFood(food)
    onFeed(3, food)
  }

  return (
    <aside className="pet-panel" aria-label="Pet and ammunition">
      <div className="pet-face" aria-hidden="true"><span>•</span><i /><span>•</span></div>
      <div>
        <p className="pet-label">PET // {lastFood ? 'CONTENT' : 'HUNGRY'}</p>
        <strong>{ammo} ROUNDS</strong>
      </div>
      {ammo === 0 && <p className="pet-warning">No ammunition. Feed Pet to continue.</p>}
      {lastFood && <p className="pet-result">Pet consumed {lastFood.toLowerCase()}. +3 ammunition.</p>}
      <div className="feed-actions">
        {['Cookie', 'Onion', 'Browser history'].map((food) => (
          <button key={food} onClick={() => feed(food)} disabled={ammo > 0}>{food}</button>
        ))}
      </div>
    </aside>
  )
}
