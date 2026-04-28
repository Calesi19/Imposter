import { useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import Button from '../ui/Button.jsx'

export default function DiscussionScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)

  return (
    <div className="min-h-dvh min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-2">
          <h2 className="text-[34px] font-semibold tracking-tight text-apple-label dark:text-white">{t(lang, 'discussion')}</h2>
          <p className="text-apple-gray-500 dark:text-apple-gray-400 text-[17px]">{t(lang, 'takeTurns')}</p>
        </div>

        <div className="space-y-3">
          {[
            t(lang, 'discussionRule1'),
            t(lang, 'discussionRule2'),
            t(lang, 'discussionRule3'),
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start bg-white/8 backdrop-blur-md rounded-2xl px-4 py-4 border border-white/10">
              <span className="text-apple-blue font-semibold text-[15px] mt-0.5 shrink-0">{i + 1}</span>
              <p className="text-apple-label dark:text-white text-[15px] leading-snug">{text}</p>
            </div>
          ))}
        </div>

        <Button onClick={actions.revealImposter}>
          {t(lang, 'revealImposter')}
        </Button>
      </div>
    </div>
  )
}
