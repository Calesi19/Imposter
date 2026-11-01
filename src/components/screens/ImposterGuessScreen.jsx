import { useState, useContext } from 'react'
import { CATEGORIES } from '../../data/words.js'
import { CATEGORIES_ES } from '../../data/words_es.js'
import { CATEGORIES_PT } from '../../data/words_pt.js'
import { LanguageContext, t } from '../../i18n/index.js'
import { sfx } from '../../utils/sound.js'
import BottomBar from '../ui/BottomBar.jsx'
import StampButton from '../ui/StampButton.jsx'

export default function ImposterGuessScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
  const { players, imposterIndices, selectedCategories } = state
  const imposterNames = imposterIndices.map(i => players[i]).join(' & ')

  const categories = lang === 'es' ? CATEGORIES_ES : lang === 'pt' ? CATEGORIES_PT : CATEGORIES
  const wordPool = [...new Set(selectedCategories.flatMap(k => categories[k].words.map(w => w.word)))].sort((a, b) =>
    a.localeCompare(b, lang),
  )
  const needle = query.trim().toLocaleLowerCase(lang)
  const matches = needle ? wordPool.filter(word => word.toLocaleLowerCase(lang).includes(needle)) : wordPool

  return (
    <div
      className="mx-auto w-full max-w-[30rem] px-3 lg:max-w-[44rem]"
      style={{ paddingTop: 'calc(22px + var(--safe-top))', paddingBottom: 'calc(112px + var(--safe-bottom))' }}
    >
      <article className="sheet sheet-stack on-paper relative isolate px-4 pb-5 pt-5 sm:px-6">
        <p className="t-label text-center text-blood">{t(lang, 'lastChance')}</p>
        <h1 className="t-h1 mt-1 text-center" style={{ fontSize: 'clamp(2.25rem, 10.5vw, 3.25rem)' }}>
          {t(lang, 'guessTheWord', { names: imposterNames })}
        </h1>
        <p className="t-body mt-1 text-center text-ink-soft">{t(lang, 'guessToWin')}</p>
        <div className="sheet-rule my-4" />

        <h2 className="t-label">{t(lang, 'interceptedList')}</h2>
        <label className="mt-1 block">
          <span className="sr-only">{t(lang, 'searchWords')}</span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t(lang, 'searchWords')}
            autoComplete="off"
            className="typed-input"
          />
        </label>

        {matches.length > 0 ? (
          <ul className="mt-2 grid grid-cols-2 gap-x-3 sm:grid-cols-3">
            {matches.map(word => (
              <li key={word}>
                <button
                  type="button"
                  aria-pressed={selected === word}
                  onClick={() => {
                    sfx.key()
                    setSelected(word)
                  }}
                  className="word-option text-[0.9375rem] leading-tight"
                >
                  {word}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="t-body mt-4 text-ink-soft">{t(lang, 'noWords')}</p>
        )}
      </article>

      <BottomBar>
          <StampButton onClick={() => actions.submitImposterGuess(selected)} disabled={!selected}>
            {t(lang, 'submitGuess')}
          </StampButton>
        </BottomBar>
    </div>
  )
}
