import { useContext, useEffect, useRef, useState } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import { sfx } from '../../utils/sound.js'
import Paperclip from '../ui/Paperclip.jsx'
import Polaroid from '../ui/Polaroid.jsx'
import RedactionStrip from '../ui/RedactionStrip.jsx'
import Stamp from '../ui/Stamp.jsx'
import StampButton from '../ui/StampButton.jsx'

// Word and Imposter sheets share one ink, one layout and one sound, so nothing
// about a player's phone gives their role away across the table.
function wordSize(word) {
  return `min(5.25rem, ${Math.round(230 / Math.max(word.length, 1))}cqw)`
}

function FileSheet({ name, isImposter, word, hint, showHints, onSeal, lang }) {
  const [read, setRead] = useState(false)

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col justify-center px-4"
      style={{ paddingTop: 'calc(26px + var(--safe-top))', paddingBottom: 'calc(20px + var(--safe-bottom))' }}
    >
      <article className="sheet sheet-stack on-paper relative isolate px-4 pb-4 pt-5 sm:px-6">
        <Paperclip className="left-7 -top-4" />

        <header className="flex items-start justify-between gap-3">
          <p className="t-label pl-8 pt-1">{t(lang, 'personnelFile')}</p>
          <Stamp tilt={4} className="text-[1.5rem]">{t(lang, 'eyesOnly')}</Stamp>
        </header>

        <div className="mt-4 flex items-center gap-4">
          <Polaroid name={name} showName={false} tilt="-3deg" className="w-24 flex-none" />
          <dl className="min-w-0 flex-1">
            <dt className="t-label text-ink-soft">{t(lang, 'fieldAgent')}</dt>
            <dd>
              <h1 className="t-h2 break-words">{name}</h1>
            </dd>
          </dl>
        </div>

        <div className="sheet-rule my-4" />

        <RedactionStrip
          barLabel={t(lang, 'dragToRead')}
          ariaLabel={t(lang, 'readStripLabel')}
          onRead={() => setRead(true)}
          className="bg-paper-deep/40"
        >
          <span className="t-label text-ink-soft">{t(lang, 'secretWordIs')}</span>
          {isImposter ? (
            <span className="t-h1 my-1 block" style={{ fontSize: 'min(3.75rem, 17cqw)', lineHeight: 1 }}>
              {t(lang, 'youAreImposterLine1')}
              <br />
              {t(lang, 'youAreImposterLine2')}
            </span>
          ) : (
            <span className="t-h1 my-2 block" style={{ fontSize: wordSize(word), lineHeight: 1 }}>
              {word}
            </span>
          )}
          <span className="text-[0.9375rem] leading-snug text-ink-soft">
            {isImposter ? (showHints ? t(lang, 'hintLabel', { hint }) : t(lang, 'imposterBlend')) : t(lang, 'memorize')}
          </span>
        </RedactionStrip>

        <p className="mt-3 text-center text-[0.9375rem] leading-snug text-ink-soft">{t(lang, 'dragHelp')}</p>

        <div className="mt-4">
          <StampButton tone="olive" onClick={onSeal} disabled={!read}>
            {t(lang, 'sealFile')}
          </StampButton>
        </div>
      </article>
    </div>
  )
}

function FileSlot({ name, index, done, justSealed, onOpen, lang }) {
  return (
    <button
      type="button"
      className="file-slot"
      disabled={done}
      onClick={() => {
        sfx.paper()
        onOpen()
      }}
      aria-label={done ? `${name}: ${t(lang, 'sealed')}` : t(lang, 'fileOf', { name })}
    >
      <span className="folder-tab t-label px-4 pb-1 pt-1.5 text-[0.6875rem]">
        № {String(index + 1).padStart(2, '0')}
      </span>
      <span className={`folder relative block overflow-hidden px-2.5 pb-2.5 pt-3 ${justSealed ? 'thud' : ''}`}>
        <Polaroid name={name} showName={false} tilt="-2deg" className="w-[4.25rem]" />
        <span className="mt-2 block break-words text-[1.0625rem] leading-tight">{name}</span>
        {done && (
          <span className="absolute inset-0 grid place-items-center bg-manila-deep/25">
            <Stamp tone="olive" slam={justSealed} tilt={-9} className="text-[1.625rem]">
              {t(lang, 'sealed')}
            </Stamp>
          </span>
        )}
      </span>
    </button>
  )
}

function AbortButton({ onAbort, lang }) {
  const [armed, setArmed] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleClick() {
    if (armed) {
      onAbort()
      return
    }
    sfx.clack()
    setArmed(true)
    timer.current = setTimeout(() => setArmed(false), 3000)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`t-label min-h-[44px] px-1 ${armed ? 'text-ember' : 'text-desk-muted'}`}
    >
      {armed ? t(lang, 'abortConfirm') : `× ${t(lang, 'abort')}`}
    </button>
  )
}

export default function WordRevealScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, activeRevealIndex, revealedPlayers, imposterIndices, secretWord, showHints } = state

  if (activeRevealIndex !== null) {
    return (
      <div key={activeRevealIndex} className="deal-in select-none">
        <FileSheet
          lang={lang}
          name={players[activeRevealIndex]}
          isImposter={imposterIndices.includes(activeRevealIndex)}
          word={secretWord.word}
          hint={secretWord.hint}
          showHints={showHints}
          onSeal={actions.closeReveal}
        />
      </div>
    )
  }

  const lastSealed = revealedPlayers[revealedPlayers.length - 1]

  return (
    <div
      className="deal-in mx-auto min-h-dvh w-full max-w-[30rem] select-none px-4 pb-8 lg:max-w-[60rem]"
      style={{ paddingTop: 'calc(10px + var(--safe-top))' }}
    >
      <div className="flex items-center justify-between gap-3">
        <AbortButton onAbort={actions.resetGame} lang={lang} />
        <p className="t-label tabular-nums text-desk-muted" aria-live="polite">
          {t(lang, 'filesRead', { done: revealedPlayers.length, total: players.length })}
        </p>
      </div>

      <h1 className="t-h1 mb-5 mt-3 text-center text-desk-text">{t(lang, 'tapNameToReveal')}</h1>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
        {players.map((name, i) => (
          <FileSlot
            key={i}
            lang={lang}
            name={name}
            index={i}
            done={revealedPlayers.includes(i)}
            justSealed={lastSealed === i}
            onOpen={() => actions.openReveal(i)}
          />
        ))}
      </div>
    </div>
  )
}
