import { useContext, useEffect, useRef, useState } from 'react'
import { LanguageContext, t } from '../../i18n/index.js'
import { reducedMotion } from '../../utils/motion.js'
import Paperclip from '../ui/Paperclip.jsx'
import Stamp from '../ui/Stamp.jsx'
import StampButton from '../ui/StampButton.jsx'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
]

const CASE_NUMBER = String(1000 + Math.floor(Math.random() * 9000))

export default function CoverScreen({ onOpen }) {
  const { lang, setLang } = useContext(LanguageContext)
  const [opening, setOpening] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleOpen() {
    if (reducedMotion()) {
      onOpen()
      return
    }
    setOpening(true)
    timer.current = setTimeout(onOpen, 380)
  }

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col justify-center gap-5 px-4"
      style={{ paddingTop: 'calc(20px + var(--safe-top))', paddingBottom: 'calc(20px + var(--safe-bottom))' }}
    >
      <div className={`cover-wrap ${opening ? 'is-opening' : ''}`}>
        <div className="cover-flap">
          <div className="folder-tab t-label px-7 pb-2 pt-2.5 ml-3">
            {t(lang, 'caseFile')} № {CASE_NUMBER}
          </div>
          <div className="folder thud overflow-hidden px-5 pb-6 pt-8 sm:px-8" style={{ '--slam-delay': '0.39s' }}>
            <Paperclip className="right-6 -top-3" />
            <div className="coffee -bottom-24 -right-20 h-64 w-64 opacity-60" />

            <h1 className="t-display relative text-manila-ink">{t(lang, 'title')}</h1>

            <div className="relative -mt-1 mb-8 flex justify-center">
              <Stamp slam delay={0.25} tilt={-5} className="text-[clamp(1.75rem,10.5vw,2.75rem)]">
                {t(lang, 'topSecret')}
              </Stamp>
            </div>

            <dl className="relative space-y-2.5 text-[0.9375rem] leading-snug">
              <div className="grid grid-cols-[5.75rem_1fr] gap-2 border-b border-manila-ink/40 pb-1.5">
                <dt className="t-label pt-0.5">{t(lang, 'fieldSubject')}</dt>
                <dd>{t(lang, 'subtitle')}</dd>
              </div>
              <div className="grid grid-cols-[5.75rem_1fr] gap-2 border-b border-manila-ink/40 pb-1.5">
                <dt className="t-label pt-0.5">{t(lang, 'fieldClearance')}</dt>
                <dd>{t(lang, 'coverClearance')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div role="group" aria-label={t(lang, 'language')} className="px-1">
        <p className="t-label mb-2 text-desk-muted">{t(lang, 'language')}</p>
        <div className="flex gap-2.5">
          {LANGUAGES.map(({ code, name }) => (
            <button
              key={code}
              type="button"
              className="typekey"
              lang={code}
              aria-label={name}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <StampButton onClick={handleOpen}>{t(lang, 'openFile')}</StampButton>
    </div>
  )
}
