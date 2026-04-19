import { useState } from 'react'
import { CATEGORIES } from '../../data/words.js'
import Button from '../ui/Button.jsx'

export default function ImposterGuessScreen({ state, actions }) {
  const [selected, setSelected] = useState('')
  const { players, imposterIndex, selectedCategories } = state
  const imposterName = players[imposterIndex]

  const wordPool = [...new Set(selectedCategories.flatMap(k => CATEGORIES[k].words))].sort()

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-6">
        <div className="text-center mb-8 space-y-1">
          <p className="text-apple-gray-400 text-[13px] uppercase tracking-widest font-medium">Last Chance</p>
          <h2 className="text-[28px] font-semibold tracking-tight text-apple-label">{imposterName}, guess the word</h2>
          <p className="text-apple-gray-500 text-[15px]">Guess correctly to win</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {wordPool.map(word => (
            <button
              key={word}
              onClick={() => setSelected(word)}
              className={`min-h-[48px] rounded-xl text-[15px] font-medium transition-all duration-150 active:scale-95 select-none px-3 py-3 border ${
                selected === word
                  ? 'bg-apple-blue text-white border-apple-blue'
                  : 'bg-white text-apple-label border-apple-gray-200'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-10 pt-3 border-t border-apple-gray-200 bg-apple-gray-50">
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
