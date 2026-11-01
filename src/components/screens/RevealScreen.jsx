import { useContext, useState } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import Paperclip from '../ui/Paperclip.jsx'
import RedactionStrip from '../ui/RedactionStrip.jsx'
import Stamp from '../ui/Stamp.jsx'
import StampButton from '../ui/StampButton.jsx'

export default function RevealScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, imposterIndices } = state
  const [declassified, setDeclassified] = useState(false)

  const imposterNames = imposterIndices.map(i => players[i])

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

        {declassified && (
          <div className="mt-4 flex justify-center">
            <Stamp slam tilt={-4} className="text-[2.5rem]">
              {t(lang, 'declassified')}
            </Stamp>
          </div>
        )}
      </article>

      {declassified && (
        <div className="deal-in">
          <StampButton onClick={actions.resetGame}>{t(lang, 'newRound')}</StampButton>
        </div>
      )}
    </div>
  )
}
