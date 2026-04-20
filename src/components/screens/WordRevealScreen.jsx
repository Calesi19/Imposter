import { useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'

export default function WordRevealScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, revealStep, revealPhase, imposterIndices, secretWord, showHints } = state
  const currentPlayer = players[revealStep]
  const isImposter = imposterIndices.includes(revealStep)
  const isLastPlayer = revealStep === players.length - 1

  return (
    <div
      className="min-h-dvh min-h-screen bg-apple-gray-50 dark:bg-black flex flex-col items-center justify-center px-8 select-none"
      onClick={actions.advanceTap}
    >
      <button
        onClick={e => { e.stopPropagation(); actions.resetGame() }}
        className="absolute top-14 left-6 flex items-center gap-2 text-apple-blue text-[17px] font-medium"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {revealPhase === 'NAME' && (
        <div className="text-center space-y-4">
          <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[13px] uppercase tracking-widest font-medium">{t(lang, 'nextUp')}</p>
          <h2 className="text-[40px] font-semibold tracking-tight text-apple-label dark:text-white leading-tight">{currentPlayer}</h2>
          <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[17px]">{t(lang, 'tapToSeeWord')}</p>
        </div>
      )}

      {revealPhase === 'WORD' && (
        <div className="text-center space-y-6">
          <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[15px] font-medium">{currentPlayer}</p>
          {isImposter ? (
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
      )}

      {revealPhase === 'HIDDEN' && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-apple-gray-100 dark:bg-apple-gray-800 border border-apple-gray-200 dark:border-apple-gray-700 flex items-center justify-center mx-auto text-apple-gray-500 dark:text-apple-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-[28px] font-semibold tracking-tight text-apple-label dark:text-white">{t(lang, 'coverScreen')}</h2>
            <p className="text-apple-gray-500 dark:text-apple-gray-400 text-[17px]">
              {isLastPlayer
                ? t(lang, 'tapWhenReady')
                : t(lang, 'passTo', { name: players[revealStep + 1] })}
            </p>
          </div>
          <p className="text-apple-gray-300 dark:text-apple-gray-600 text-[15px]">{t(lang, 'tapToContinue')}</p>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
        {players.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < revealStep
                ? 'w-1.5 h-1.5 bg-apple-gray-200 dark:bg-apple-gray-700'
                : i === revealStep
                ? 'w-4 h-1.5 bg-apple-blue'
                : 'w-1.5 h-1.5 bg-apple-gray-200 dark:bg-apple-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
