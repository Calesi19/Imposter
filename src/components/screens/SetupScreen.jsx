import { useState, useContext } from 'react'
import { CATEGORIES } from '../../data/words.js'
import { CATEGORIES_ES } from '../../data/words_es.js'
import { LanguageContext, t } from '../../i18n/index.js'
import Button from '../ui/Button.jsx'
import PlayerChip from '../ui/PlayerChip.jsx'
import CategoryCard from '../ui/CategoryCard.jsx'

export default function SetupScreen({ state, actions }) {
  const { lang, setLang } = useContext(LanguageContext)
  const [input, setInput] = useState('')

  function handleAdd() {
    if (!input.trim()) return
    actions.addPlayer(input)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
  }

  const canStart = state.players.length >= 3 && state.selectedCategories.length >= 1
  const categories = lang === 'es' ? CATEGORIES_ES : CATEGORIES

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-32 space-y-8">

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[34px] font-semibold tracking-tight text-apple-label">{t(lang, 'title')}</h1>
            <p className="text-apple-gray-500 mt-1 text-[15px]">{t(lang, 'subtitle')}</p>
          </div>
          <div className="flex bg-apple-gray-200 rounded-full p-0.5 mt-2 shrink-0">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-[13px] font-semibold transition-all ${lang === 'en' ? 'bg-white text-apple-label shadow-sm' : 'text-apple-gray-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-3 py-1 rounded-full text-[13px] font-semibold transition-all ${lang === 'es' ? 'bg-white text-apple-label shadow-sm' : 'text-apple-gray-400'}`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Players */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-400">
            {t(lang, 'players')}
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t(lang, 'addPlayerPlaceholder')}
              maxLength={20}
              className="flex-1 bg-white border border-apple-gray-200 rounded-xl px-4 py-3 text-apple-label text-[17px] placeholder-apple-gray-300 outline-none focus:border-apple-blue transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="bg-apple-blue text-white px-5 rounded-xl font-medium text-[17px] disabled:opacity-40 active:scale-95 transition-all"
            >
              {t(lang, 'add')}
            </button>
          </div>
          {state.players.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {state.players.map((name, i) => (
                <PlayerChip key={i} name={name} onRemove={() => actions.removePlayer(i)} />
              ))}
            </div>
          ) : (
            <p className="text-apple-gray-300 text-[13px]">{t(lang, 'minPlayersHint')}</p>
          )}
        </section>

        {/* Categories */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-400">
            {t(lang, 'wordThemes')}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(categories).map(([key, cat]) => (
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
            <p className="text-apple-gray-300 text-[13px]">{t(lang, 'minThemeHint')}</p>
          )}
        </section>

        {/* Imposters */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-400">
            {t(lang, 'imposters')}
          </h2>
          <div className="bg-white border border-apple-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-apple-label text-[17px]">{t(lang, 'numberOfImposters')}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => actions.setImposterCount(state.imposterCount - 1)}
                disabled={state.imposterCount <= 0}
                className="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center text-apple-label text-[20px] font-medium disabled:opacity-30 active:scale-95 transition-all select-none"
                aria-label="Decrease imposter count"
              >
                −
              </button>
              <span className="text-apple-label text-[20px] font-semibold w-6 text-center select-none">
                {state.imposterCount}
              </span>
              <button
                onClick={() => actions.setImposterCount(state.imposterCount + 1)}
                disabled={state.imposterCount >= 25}
                className="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center text-apple-label text-[20px] font-medium disabled:opacity-30 active:scale-95 transition-all select-none"
                aria-label="Increase imposter count"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Options */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-400">
            {t(lang, 'options')}
          </h2>
          <div className="bg-white border border-apple-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-apple-label text-[17px]">{t(lang, 'imposterHints')}</p>
              <p className="text-apple-gray-400 text-[13px] mt-0.5">{t(lang, 'imposterHintsDesc')}</p>
            </div>
            <button
              onClick={actions.toggleShowHints}
              role="switch"
              aria-checked={state.showHints}
              className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ml-4 ${
                state.showHints ? 'bg-apple-blue' : 'bg-apple-gray-200'
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  state.showHints ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-apple-gray-50/90 backdrop-blur-sm">
        <Button onClick={actions.startGame} disabled={!canStart}>
          {t(lang, 'startGame')}
        </Button>
      </div>
    </div>
  )
}
