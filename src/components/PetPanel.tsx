import { useState } from 'react'

type PetPanelProps = {
  ammo: number
  canFeed: boolean
  onFeed: (rounds: number, food: string) => void
}

type Food = { name: string; rounds: number }

const foods: Food[] = [
  { name: 'Печенье', rounds: 1 },
  { name: 'Луковица', rounds: 2 },
  { name: 'История браузера', rounds: 3 },
]

const INITIAL_HUNGER = 87
const INITIAL_LOYALTY = 3

export function PetPanel({ ammo, canFeed, onFeed }: PetPanelProps) {
  const [lastFood, setLastFood] = useState<Food | null>(null)
  const orderedFoods = lastFood ? [...foods.filter((food) => food !== lastFood), lastFood] : foods
  const hunger = lastFood ? INITIAL_HUNGER - 53 : INITIAL_HUNGER
  const loyalty = lastFood ? INITIAL_LOYALTY + 8 : INITIAL_LOYALTY
  const feed = (food: Food) => {
    if (!canFeed) return
    setLastFood(food)
    onFeed(food.rounds, food.name)
  }

  return (
    <aside className={`pet-panel ${lastFood ? 'pet-panel--fed' : ''}`} aria-label="Питомец и боеприпасы">
      <div className="pet-face" aria-hidden="true"><span>•</span><i /><span>•</span></div>
      <div>
        <p className="pet-label">ПИТОМЕЦ // {lastFood ? 'НАСТРОЕНИЕ: ОСТОРОЖНОЕ' : 'НАСТРОЕНИЕ: ОСУЖДАЮЩЕЕ'}</p>
        <strong>{ammo} ПАТРОНА</strong>
        <p className="pet-label">ГОЛОД: {hunger}%</p>
        <p className="pet-label">ЛОЯЛЬНОСТЬ: {loyalty}/100</p>
      </div>
      {ammo === 0 && <p className="pet-warning">Нет боеприпасов. Покормите Питомца.</p>}
      {lastFood && <p className="pet-result">Питомец получил «{lastFood.name.toLowerCase()}». +{lastFood.rounds} патрона.</p>}
      <div className="feed-actions">
        {orderedFoods.map((food) => (
          <button key={food.name} onClick={() => feed(food)} disabled={!canFeed || ammo > 0}>{food.name} · {food.rounds}</button>
        ))}
      </div>
    </aside>
  )
}
