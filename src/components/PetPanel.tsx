import { useState } from 'react'

type PetPanelProps = {
  ammo: number
  canFeed: boolean
  onFeed: (rounds: number, food: string) => void
}

export function PetPanel({ ammo, canFeed, onFeed }: PetPanelProps) {
  const [lastFood, setLastFood] = useState<string | null>(null)
  const foods = ['Печенье', 'Луковица', 'История браузера']
  const orderedFoods = lastFood ? [...foods.filter((food) => food !== lastFood), lastFood] : foods
  const feed = (food: string) => {
    if (!canFeed) return
    setLastFood(food)
    onFeed(3, food)
  }

  return (
    <aside className={`pet-panel ${lastFood ? 'pet-panel--fed' : ''}`} aria-label="Питомец и боеприпасы">
      <div className="pet-face" aria-hidden="true"><span>•</span><i /><span>•</span></div>
      <div>
        <p className="pet-label">ПИТОМЕЦ // {lastFood ? 'ДОВОЛЕН' : 'ГОЛОДЕН'}</p>
        <strong>{ammo} ПАТРОНА</strong>
      </div>
      {ammo === 0 && <p className="pet-warning">Нет боеприпасов. Покормите Питомца.</p>}
      {lastFood && <p className="pet-result">Питомец получил «{lastFood.toLowerCase()}». +3 патрона.</p>}
      <div className="feed-actions">
        {orderedFoods.map((food) => (
          <button key={food} onClick={() => feed(food)} disabled={!canFeed || ammo > 0}>{food}</button>
        ))}
      </div>
    </aside>
  )
}
