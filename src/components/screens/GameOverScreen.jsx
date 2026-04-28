import { useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import Button from '../ui/Button.jsx'

export default function GameOverScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, imposterIndices, imposterCaught, imposterGuessCorrect, secretWord, accusedPlayer } = state
  const imposterNames = imposterIndices.map(i => players[i]).join(' & ')

  const imposterWins = !imposterCaught || imposterGuessCorrect === true

  return (
    <div className="min-h-dvh min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-2">
          <p className={`text-[13px] uppercase tracking-widest font-medium ${imposterWins ? 'text-apple-red' : 'text-apple-blue'}`}>
            {imposterWins ? t(lang, 'imposterWins') : t(lang, 'playersWin')}
          </p>
          <h2 className="text-[36px] font-semibold tracking-tight text-apple-label dark:text-white leading-tight">
            {imposterWins
              ? t(lang, 'fooledEveryone', { names: imposterNames })
              : t(lang, 'imposterCaught')}
          </h2>
        </div>

        <div className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          {[
            { label: t(lang, 'secretWord'), value: secretWord?.word ?? secretWord, valueClass: 'text-apple-label dark:text-white font-semibold' },
            { label: imposterIndices.length === 1 ? t(lang, 'imposter') : t(lang, 'impostersLabel'), value: imposterNames, valueClass: 'text-apple-red font-medium' },
            { label: t(lang, 'mostVotes'), value: accusedPlayer, valueClass: 'text-apple-label dark:text-white' },
            ...(imposterGuessCorrect !== null
              ? [{ label: t(lang, 'imposterGuess'), value: imposterGuessCorrect ? t(lang, 'correct') : t(lang, 'wrong'), valueClass: imposterGuessCorrect ? 'text-apple-green font-medium' : 'text-apple-red font-medium' }]
              : []),
          ].map((row, i, arr) => (
            <div
              key={i}
              className={`flex justify-between items-center px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <span className="text-apple-gray-500 dark:text-apple-gray-400 text-[15px]">{row.label}</span>
              <span className={`text-[15px] ${row.valueClass}`}>{row.value}</span>
            </div>
          ))}
        </div>

        <Button onClick={actions.resetGame}>
          {t(lang, 'playAgain')}
        </Button>
      </div>
    </div>
  )
}
