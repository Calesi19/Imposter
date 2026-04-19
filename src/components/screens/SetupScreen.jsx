import { useState } from 'react'
import { CATEGORIES } from '../../data/words.js'
import Button from '../ui/Button.jsx'
import PlayerChip from '../ui/PlayerChip.jsx'
import CategoryCard from '../ui/CategoryCard.jsx'

export default function SetupScreen({ state, actions }) {
  const [input, setInput] = useState('')

  function handleAdd() {
    if (!input.trim()) return
    actions.addPlayer(input)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  const canStart = state.players.length >= 2 && state.selectedCategories.length >= 1

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-6 space-y-8">

        <div>
          <h1 className="text-[34px] font-semibold tracking-tight text-apple-label">Imposter</h1>
          <p className="text-apple-gray-500 mt-1 text-[15px]">The word bluffing game</p>
        </div>

        {/* Players */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-400">
            Players
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a player"
              maxLength={20}
              className="flex-1 bg-white border border-apple-gray-200 rounded-xl px-4 py-3 text-apple-label text-[17px] placeholder-apple-gray-300 outline-none focus:border-apple-blue transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="bg-apple-blue text-white px-5 rounded-xl font-medium text-[17px] disabled:opacity-40 active:scale-95 transition-all"
            >
              Add
            </button>
          </div>
          {state.players.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {state.players.map((name, i) => (
                <PlayerChip key={i} name={name} onRemove={() => actions.removePlayer(i)} />
              ))}
            </div>
          ) : (
            <p className="text-apple-gray-300 text-[13px]">At least 2 players required</p>
          )}
        </section>

        {/* Categories */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-400">
            Word Themes
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <CategoryCard
                key={key}
                label={cat.label}
                emoji={cat.emoji}
                selected={state.selectedCategories.includes(key)}
                onToggle={() => actions.toggleCategory(key)}
              />
            ))}
          </div>
          {state.selectedCategories.length === 0 && (
            <p className="text-apple-gray-300 text-[13px]">Select at least one theme</p>
          )}
        </section>
      </div>

      <div className="px-5 pb-10 pt-2">
        <Button onClick={actions.startGame} disabled={!canStart}>
          Start Game
        </Button>
      </div>
    </div>
  )
}
