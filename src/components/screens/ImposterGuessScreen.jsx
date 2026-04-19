import { useState } from 'react'
import { CATEGORIES } from '../../data/words.js'
import Button from '../ui/Button.jsx'

export default function ImposterGuessScreen({ state, actions }) {
  const [selected, setSelected] = useState('')
  const { players, imposterIndex, selectedCategories } = state
  const imposterName = players[imposterIndex]

  const wordPool = [...new Set(selectedCategories.flatMap(k => CATEGORIES[k].words))].sort()

  return (
    <div className="min-h-dvh min-h-screen bg-slate-900 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 pt-10 pb-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🕵️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">{imposterName}'s Last Chance</h2>
          <p className="text-slate-400 mt-1 text-sm">Guess the secret word to win</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {wordPool.map(word => (
            <button
              key={word}
              onClick={() => setSelected(word)}
              className={`min-h-[48px] rounded-xl text-sm font-medium transition-all active:scale-95 select-none px-3 py-2 ${
                selected === word
                  ? 'bg-indigo-600 text-white border-2 border-indigo-400'
                  : 'bg-slate-800 text-slate-300 border-2 border-transparent hover:border-slate-600'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8 pt-2">
        <Button
          onClick={() => actions.submitImposterGuess(selected)}
          disabled={!selected}
        >
          Submit Guess
        </Button>
      </div>
    </div>
  )
}
