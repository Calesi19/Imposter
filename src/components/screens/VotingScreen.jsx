import { useContext, useEffect, useRef, useState } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import { sfx } from '../../utils/sound.js'
import Paperclip from '../ui/Paperclip.jsx'
import Polaroid from '../ui/Polaroid.jsx'
import Stamp from '../ui/Stamp.jsx'
import BottomBar from '../ui/BottomBar.jsx'
import StampButton from '../ui/StampButton.jsx'

const VoteStep = {
  PROMPT: 'PROMPT',
  VOTING: 'VOTING',
  DONE: 'DONE',
}

export default function VotingScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, currentVoterIndex } = state
  const [step, setStep] = useState(VoteStep.PROMPT)
  const [choice, setChoice] = useState(null)
  const timer = useRef(null)
  const currentVoter = players[currentVoterIndex]
  const isLastVoter = currentVoterIndex === players.length - 1

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleVote() {
    setStep(VoteStep.DONE)
    timer.current = setTimeout(() => {
      actions.castVote(choice)
      setChoice(null)
      setStep(VoteStep.PROMPT)
    }, 1500)
  }

  if (step === VoteStep.PROMPT) {
    return (
      <div
        key={currentVoterIndex}
        className="deal-in mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col justify-center px-5"
        style={{ paddingTop: 'calc(20px + var(--safe-top))', paddingBottom: 'calc(20px + var(--safe-bottom))' }}
      >
        <div className="folder-tab t-label ml-3 px-7 pb-2 pt-2.5 tabular-nums">
          {t(lang, 'voteProgress', { current: currentVoterIndex + 1, total: players.length })}
        </div>
        <div className="folder overflow-hidden px-5 pb-6 pt-6 text-center">
          <Paperclip className="right-8 -top-3" />
          <p className="t-body">{t(lang, 'passPhone')}</p>
          <h1 className="t-h1 mt-1 break-words">{currentVoter}</h1>
          <Polaroid name={currentVoter} showName={false} tilt="2deg" className="mx-auto my-5 w-36" />
          <StampButton tone="olive" onClick={() => setStep(VoteStep.VOTING)}>
            {t(lang, 'readyToVote')}
          </StampButton>
        </div>
      </div>
    )
  }

  if (step === VoteStep.VOTING) {
    return (
      <div
        className="deal-in mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col justify-center px-3 lg:max-w-[40rem]"
        style={{ paddingTop: 'calc(22px + var(--safe-top))', paddingBottom: 'calc(112px + var(--safe-bottom))' }}
      >
        <article className="sheet sheet-stack on-paper relative isolate px-4 pb-6 pt-5 sm:px-6">
          <p className="t-label text-center text-ink-soft">{t(lang, 'secretBallot')}</p>
          <h1 className="t-h1 mt-1 text-center" style={{ fontSize: 'clamp(2.5rem, 11.5vw, 3.5rem)' }}>
            {t(lang, 'whoIsImposter')}
          </h1>
          <p className="t-body mt-1 text-center text-ink-soft">{t(lang, 'castVote', { name: currentVoter })}</p>
          <div className="sheet-rule my-4" />

          <ul className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
            {players.map((player, i) =>
              i === currentVoterIndex ? null : (
                <li key={i}>
                  <button
                    type="button"
                    aria-pressed={choice === i}
                    onClick={() => {
                      sfx.key()
                      setChoice(i)
                    }}
                    className="relative block w-full transition-transform duration-100 active:scale-95"
                  >
                    <Polaroid name={player} />
                    {choice === i && (
                      <span className="absolute inset-0 grid place-items-center">
                        <Stamp slam tilt={-14} className="bg-paper/75 text-[1.375rem]">
                          {t(lang, 'suspect')}
                        </Stamp>
                      </span>
                    )}
                  </button>
                </li>
              ),
            )}
          </ul>
        </article>

        <BottomBar>
          <StampButton onClick={handleVote} disabled={choice === null}>
              {t(lang, 'fileVote')}
            </StampButton>
        </BottomBar>
      </div>
    )
  }

  return (
    <div className="deal-in mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col justify-center px-5 text-center">
      <div className="sheet sheet-stack thud on-paper relative isolate px-6 py-10">
        <Stamp tone="olive" slam tilt={-7} delay={0.05} className="text-[3rem]">
          {t(lang, 'voteRecorded')}
        </Stamp>
        {!isLastVoter && (
          <p className="t-body mt-6 text-ink-soft">{t(lang, 'passTo', { name: players[currentVoterIndex + 1] })}</p>
        )}
      </div>
    </div>
  )
}
