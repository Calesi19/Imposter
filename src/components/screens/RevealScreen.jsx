import { useContext } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import Button from '../ui/Button.jsx'

export default function RevealScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext)
  const { players, imposterIndices } = state
  const imposterNames = imposterIndices.map(i => players[i])

  return (
    <div className="min-h-dvh min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">

        <div className="space-y-2">
          <p className="text-apple-gray-400 dark:text-apple-gray-500 text-[13px] uppercase tracking-widest font-medium">
            {imposterNames.length === 1
              ? t(lang, 'theImposterWas')
              : imposterNames.length === 0
              ? t(lang, 'noImposters')
              : t(lang, 'theImpostersWere')}
          </p>
          {imposterNames.length > 0 && (
            <h2 className="text-[48px] font-semibold tracking-tight text-apple-red leading-none">
              {imposterNames.join(' & ')}
            </h2>
          )}
        </div>

        <Button onClick={actions.resetGame}>
          {t(lang, 'newRound')}
        </Button>

      </div>
    </div>
  )
}
