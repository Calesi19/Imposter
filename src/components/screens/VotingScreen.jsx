import { useState, useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import Button from '../ui/Button.jsx'

const VoteStep = {
  PROMPT: 'PROMPT',
  VOTING: 'VOTING',
  DONE: 'DONE',
}

export default function VotingScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, currentVoterIndex } = state
  const [step, setStep] = useState(VoteStep.PROMPT)
  const currentVoter = players[currentVoterIndex]
  const isLastVoter = currentVoterIndex === players.length - 1

  function handleReady() {
    setStep(VoteStep.VOTING)
  }

  function handleVote(suspect) {
    setStep(VoteStep.DONE)
    setTimeout(() => {
      actions.castVote(currentVoter, suspect)
      setStep(VoteStep.PROMPT)
    }, 1200)
  }

  return (
    <div className="min-h-dvh min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">

        {step === VoteStep.PROMPT && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[13px] uppercase tracking-widest font-medium">
                {t(lang, 'voteProgress', { current: currentVoterIndex + 1, total: players.length })}
              </p>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 text-[17px]">{t(lang, 'passPhone')}</p>
              <h2 className="text-[40px] font-semibold tracking-tight text-apple-label dark:text-white">{currentVoter}</h2>
            </div>
            <Button onClick={handleReady}>
              {t(lang, 'readyToVote')}
            </Button>
          </div>
        )}

        {step === VoteStep.VOTING && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-[22px] font-semibold tracking-tight text-apple-label dark:text-white">{t(lang, 'whoIsImposter')}</h2>
              <p className="text-apple-gray-500 dark:text-apple-gray-400 text-[15px]">{t(lang, 'castVote', { name: currentVoter })}</p>
            </div>
            <div className="space-y-2">
              {players
                .filter(p => p !== currentVoter)
                .map(player => (
                  <button
                    key={player}
                    onClick={() => handleVote(player)}
                    className="w-full min-h-[54px] bg-white dark:bg-apple-gray-900 border border-apple-gray-200 dark:border-apple-gray-700 text-apple-label dark:text-white rounded-xl font-medium text-[17px] active:scale-[0.98] active:bg-apple-gray-50 dark:active:bg-apple-gray-800 transition-all select-none tracking-tight"
                  >
                    {player}
                  </button>
                ))}
            </div>
          </div>
        )}

        {step === VoteStep.DONE && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-white dark:bg-apple-gray-900 border border-apple-gray-200 dark:border-apple-gray-700 flex items-center justify-center mx-auto">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-apple-label dark:text-white text-[17px] font-medium">{t(lang, 'voteRecorded')}</p>
              {!isLastVoter && (
                <p className="text-apple-gray-500 dark:text-apple-gray-400 text-[15px]">{t(lang, 'passTo', { name: players[currentVoterIndex + 1] })}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
