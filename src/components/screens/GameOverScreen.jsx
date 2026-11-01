import { useContext, useEffect } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import { sfx } from '../../utils/sound.js'
import Paperclip from '../ui/Paperclip.jsx'
import Stamp from '../ui/Stamp.jsx'
import StampButton from '../ui/StampButton.jsx'
import Typewriter from '../ui/Typewriter.jsx'

export default function GameOverScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, imposterIndices, imposterCaught, imposterGuessCorrect, secretWord, accusedIndex, votes } = state
  const imposterNames = imposterIndices.map(i => players[i]).join(' & ')

  const noImposters = imposterIndices.length === 0
  const imposterWins = !noImposters && (!imposterCaught || imposterGuessCorrect === true)

  useEffect(() => {
    const timer = setTimeout(sfx.stamp, 240)
    return () => clearTimeout(timer)
  }, [])

  const verdict = noImposters ? t(lang, 'falseAlarm') : t(lang, imposterWins ? 'imposterWins' : 'playersWin')
  const headline = noImposters
    ? t(lang, 'nobodyLied')
    : imposterGuessCorrect === true
      ? t(lang, 'wordCracked', { names: imposterNames })
      : imposterWins
        ? t(lang, 'fooledEveryone', { names: imposterNames })
        : t(lang, 'imposterCaught')

  const log = [
    { label: t(lang, 'secretWord'), value: secretWord.word },
    ...(noImposters
      ? []
      : [{ label: imposterIndices.length === 1 ? t(lang, 'imposter') : t(lang, 'impostersLabel'), value: imposterNames }]),
    { label: t(lang, 'mostVotes'), value: accusedIndex === null ? t(lang, 'noVoteHeld') : players[accusedIndex] },
    ...(imposterGuessCorrect !== null
      ? [{ label: t(lang, 'imposterGuess'), value: t(lang, imposterGuessCorrect ? 'correct' : 'wrong') }]
      : []),
  ]

  const tally = players
    .map((name, i) => ({ name, count: Object.values(votes).filter(v => v === i).length }))
    .filter(row => row.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col justify-center gap-5 px-4"
      style={{ paddingTop: 'calc(26px + var(--safe-top))', paddingBottom: 'calc(20px + var(--safe-bottom))' }}
    >
      <article
        className="sheet sheet-stack thud on-paper relative isolate overflow-visible px-5 pb-6 pt-6 sm:px-7"
        style={{ '--slam-delay': '0.29s' }}
      >
        <Paperclip className="right-8 -top-4" />
        <div className="coffee -bottom-16 -right-14 h-48 w-48 opacity-40" />

        <p className="t-label text-ink-soft">{t(lang, 'caseClosed')}</p>
        <div className="my-3">
          <Stamp slam tilt={-3} delay={0.15} tone={imposterWins ? 'blood' : 'olive'} className="text-[3rem]">
            {verdict}
          </Stamp>
        </div>
        <h1 className="t-h2 relative">{headline}</h1>
        <div className="sheet-rule my-4" />

        <dl className="relative text-[1rem] leading-snug">
          {log.map((row, i) => (
            <div key={row.label} className="grid grid-cols-[42%_1fr] gap-3 border-b border-dashed border-ink/35 py-2">
              <dt className="text-ink-soft">{row.label}</dt>
              <dd className="min-w-0 break-words">
                <Typewriter text={row.value} delay={500 + i * 340} speed={26} sound />
              </dd>
            </div>
          ))}
        </dl>

        {tally.length > 0 && (
          <>
            <h2 className="t-label mb-1 mt-5">{t(lang, 'ballotCount')}</h2>
            <ul className="relative text-[1rem]">
              {tally.map(row => (
                <li key={row.name} className="flex items-baseline justify-between gap-3 py-0.5">
                  <span className="min-w-0 break-words">{row.name}</span>
                  <span className="text-blood" aria-label={t(lang, 'voteCount', { count: row.count })}>
                    {'|'.repeat(row.count)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </article>

      <StampButton onClick={actions.resetGame}>{t(lang, 'playAgain')}</StampButton>
    </div>
  )
}
