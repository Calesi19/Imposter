import { useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import Paperclip from '../ui/Paperclip.jsx'
import Polaroid from '../ui/Polaroid.jsx'
import StampButton from '../ui/StampButton.jsx'
import Typewriter from '../ui/Typewriter.jsx'

export default function DiscussionScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const rules = [t(lang, 'discussionRule1'), t(lang, 'discussionRule2'), t(lang, 'discussionRule3')]

  // Each order starts once the one before has finished typing.
  let typedChars = 0
  const delays = rules.map(rule => {
    const delay = 300 + typedChars * 15
    typedChars += rule.length
    return delay
  })

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col justify-center gap-5 px-4 lg:max-w-[36rem]"
      style={{ paddingTop: 'calc(26px + var(--safe-top))', paddingBottom: 'calc(16px + var(--safe-bottom))' }}
    >
      <article className="sheet sheet-stack on-paper relative isolate overflow-visible px-5 pb-6 pt-6 sm:px-7">
        <Paperclip className="right-8 -top-4" />
        <div className="coffee -left-16 -top-14 h-52 w-52 opacity-45" />

        <div className="relative">
          <h1 className="t-h1">{t(lang, 'discussion')}</h1>
          <p className="t-body mt-1 text-ink-soft">{t(lang, 'takeTurns')}</p>
        </div>

        <div className="sheet-rule my-4" />

        <h2 className="t-label mb-3">{t(lang, 'standingOrders')}</h2>
        <ol className="space-y-3">
          {rules.map((rule, i) => (
            <li key={i} className="t-body flex gap-3">
              <span className="font-[family-name:var(--font-display)] text-[1.5rem] leading-none text-blood">{i + 1}.</span>
              <Typewriter text={rule} delay={delays[i]} speed={11} className="min-w-0 flex-1" />
            </li>
          ))}
        </ol>

        <h2 className="t-label mb-3 mt-5">{t(lang, 'suspects')}</h2>
        <ul className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-3 pt-1">
          {state.players.map((name, i) => (
            <li key={i} className="w-[5.5rem] flex-none">
              <Polaroid name={name} />
            </li>
          ))}
        </ul>
      </article>

      <StampButton onClick={actions.revealImposter}>{t(lang, 'revealImposter')}</StampButton>
    </div>
  )
}
