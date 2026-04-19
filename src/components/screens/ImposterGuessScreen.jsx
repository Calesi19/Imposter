import { useState, useContext } from 'react'
import { CATEGORIES } from '../../data/words.js'
import { CATEGORIES_ES } from '../../data/words_es.js'
import { CATEGORIES_PT } from '../../data/words_pt.js'
import { LanguageContext, t } from '../../i18n/index.js'
import Button from '../ui/Button.jsx'

export default function ImposterGuessScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const [selected, setSelected] = useState('')
  const { players, imposterIndices, selectedCategories } = state
  const imposterNames = imposterIndices.map(i => players[i]).join(' & ')

  const categories = lang === 'es' ? CATEGORIES_ES : lang === 'pt' ? CATEGORIES_PT : CATEGORIES
  const wordPool = [...new Set(selectedCategories.flatMap(k => categories[k].words.map(w => w.word)))].sort()

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-6">
        <div className="text-center mb-8 space-y-1">
          <p className="text-apple-gray-400 text-[13px] uppercase tracking-widest font-medium">{t(lang, 'lastChance')}</p>
          <h2 className="text-[28px] font-semibold tracking-tight text-apple-label">{t(lang, 'guessTheWord', { names: imposterNames })}</h2>
          <p className="text-apple-gray-500 text-[15px]">{t(lang, 'guessToWin')}</p>
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
          {t(lang, 'submitGuess')}
        </Button>
      </div>
    </div>
  )
}
