import { useContext, useEffect, useState } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import { sfx } from '../../utils/sound.js'
import Paperclip from '../ui/Paperclip.jsx'
import Polaroid from '../ui/Polaroid.jsx'
import RedactionStrip from '../ui/RedactionStrip.jsx'
import Stamp from '../ui/Stamp.jsx'
import StampButton from '../ui/StampButton.jsx'

export default function RevealScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, imposterIndices, accusedIndex, imposterCaught, votes } = state
  const [declassified, setDeclassified] = useState(false)

  const imposterNames = imposterIndices.map(i => players[i])
  const voted = accusedIndex !== null
  const accusedVotes = Object.values(votes).filter(v => v === accusedIndex).length

  useEffect(() => {
    if (declassified) sfx.stamp()
  }, [declassified])

  const heading =
    imposterNames.length === 1
      ? t(lang, 'theImposterWas')
      : imposterNames.length === 0
        ? t(lang, 'noImposters')
        : t(lang, 'theImpostersWere')

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col justify-center gap-5 px-4"
      style={{ paddingTop: 'calc(26px + var(--safe-top))', paddingBottom: 'calc(20px + var(--safe-bottom))' }}
    >
      <article
        className={`sheet sheet-stack on-paper relative isolate overflow-visible px-4 pb-6 pt-5 sm:px-6 ${declassified ? 'thud' : ''}`}
      >
        <Paperclip className="left-8 -top-4" />
        <h1 className="t-h2 pl-9">{t(lang, 'caseResults')}</h1>
        <div className="sheet-rule my-4" />

        {voted && (
          <div className="mb-5 flex items-center gap-4">
            <Polaroid name={players[accusedIndex]} showName={false} tilt="-3deg" className="w-24 flex-none" />
            <div className="min-w-0 flex-1">
              <p className="t-label text-ink-soft">{t(lang, 'accused')}</p>
              <p className="t-h2 mt-1 break-words">{players[accusedIndex]}</p>
              <p className="mt-1 text-[0.9375rem] tabular-nums text-ink-soft">
                {t(lang, 'voteCount', { count: accusedVotes })}
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          <RedactionStrip
            keepOpen
            barLabel={t(lang, 'dragToDeclassify')}
            ariaLabel={t(lang, 'declassifyLabel')}
            onRead={() => setDeclassified(true)}
            className="bg-paper-deep/40"
          >
            <span className="t-label text-ink-soft">{heading}</span>
            {imposterNames.length > 0 && (
              <span className="t-h1 mt-2 block break-words" style={{ fontSize: 'min(4rem, 17cqw)', lineHeight: 1 }}>
                {imposterNames.join(' & ')}
              </span>
            )}
          </RedactionStrip>
        </div>

        {declassified && (
          <div className="mt-4 flex justify-center">
            <Stamp
              slam
              tilt={-4}
              tone={voted && !imposterCaught ? 'olive' : 'blood'}
              className="text-[2.5rem]"
            >
              {voted ? t(lang, imposterCaught ? 'guilty' : 'notGuilty') : t(lang, 'declassified')}
            </Stamp>
          </div>
        )}
      </article>

      {declassified && (
        <div className="deal-in">
          {!voted && <StampButton onClick={actions.resetGame}>{t(lang, 'newRound')}</StampButton>}
          {voted && imposterCaught && (
            <StampButton onClick={actions.goToImposterGuess}>{t(lang, 'lastChanceAction')}</StampButton>
          )}
          {voted && !imposterCaught && <StampButton onClick={actions.goToGameOver}>{t(lang, 'closeCase')}</StampButton>}
        </div>
      )}
    </div>
  )
}
