import { useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'

export default function WordRevealScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, activeRevealIndex, revealedPlayers, imposterIndices, secretWord, showHints } = state

  const allRevealed = revealedPlayers.length === players.length

  return (
    <div className="min-h-dvh min-h-screen flex flex-col select-none">
      {activeRevealIndex === null ? (
        <>
          {/* Header */}
          <div className="pt-14 px-6">
            <button
              onClick={actions.resetGame}
              className="flex items-center gap-2 text-apple-blue text-[17px] font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <p className="mt-4 text-apple-gray-400 dark:text-apple-gray-500 text-[15px] font-medium text-center">
              {t(lang, 'tapNameToReveal')}
            </p>
          </div>

          {/* Player list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-2 gap-3 content-start">
            {players.map((name, i) => {
              const done = revealedPlayers.includes(i)
              return (
                <button
                  key={i}
                  disabled={done}
                  onClick={() => actions.openReveal(i)}
                  className={`px-4 py-5 h-28 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border border-white/10 bg-white/8 backdrop-blur-md ${
                    done ? 'opacity-40' : 'active:scale-[0.98]'
                  }`}
                >
                  <span className={`text-[17px] font-medium leading-snug text-center ${done ? 'text-apple-gray-400 dark:text-apple-gray-500' : 'text-apple-label dark:text-white'}`}>
                    {name}
                  </span>
                  {done ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-apple-gray-400 dark:text-apple-gray-600">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>
              )
            })}
          </div>

          {/* Start discussion button */}
          {allRevealed && (
            <div className="px-6 pb-10 pt-4">
              <button
                onClick={actions.startDiscussion}
                className="w-full bg-apple-blue text-white text-[17px] font-semibold py-4 rounded-2xl"
              >
                {t(lang, 'tapWhenReady')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className="flex-1 flex flex-col items-center justify-center px-8"
          onClick={actions.closeReveal}
        >
          <div className="text-center space-y-6">
            <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[15px] font-medium">
              {players[activeRevealIndex]}
            </p>
            {imposterIndices.includes(activeRevealIndex) ? (
              <div className="space-y-4">
                <h2 className="text-[36px] font-semibold tracking-tight text-apple-red leading-tight">
                  {t(lang, 'youAreImposterLine1')}<br />{t(lang, 'youAreImposterLine2')}
                </h2>
                {showHints ? (
                  <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[15px] max-w-[260px] mx-auto leading-relaxed">
                    {t(lang, 'hintLabel', { hint: secretWord.hint })}
                  </p>
                ) : (
                  <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[15px] max-w-[260px] mx-auto leading-relaxed">
                    {t(lang, 'imposterBlend')}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[15px]">{t(lang, 'secretWordIs')}</p>
                <h2 className="text-[52px] font-semibold tracking-tight text-apple-label dark:text-white leading-none">{secretWord.word}</h2>
              </div>
            )}
            <p className="text-apple-gray-300 dark:text-apple-gray-600 text-[15px] pt-4">{t(lang, 'tapToHide')}</p>
          </div>
        </div>
      )}
    </div>
  )

}
