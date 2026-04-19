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
    <div className="min-h-dvh min-h-screen bg-slate-900 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 pt-10 pb-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Imposter</h1>
          <p className="text-slate-400 mt-1 text-sm">The word bluffing game</p>
        </div>

        {/* Players */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Players <span className="text-slate-600">({state.players.length})</span>
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Player name"
              maxLength={20}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="bg-indigo-600 text-white px-5 rounded-xl font-semibold disabled:opacity-40 active:scale-95 transition-all"
            >
              Add
            </button>
          </div>
          {state.players.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {state.players.map((name, i) => (
                <PlayerChip key={i} name={name} onRemove={() => actions.removePlayer(i)} />
              ))}
            </div>
          )}
          {state.players.length < 2 && (
            <p className="text-slate-600 text-xs">Need at least 2 players</p>
          )}
        </section>

        {/* Categories */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
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
            <p className="text-slate-600 text-xs">Select at least one theme</p>
          )}
        </section>
      </div>

      <div className="px-4 pb-8 pt-2">
        <Button onClick={actions.startGame} disabled={!canStart}>
          Start Game
        </Button>
      </div>
    </div>
  )
}
