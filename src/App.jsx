import { useEffect, useRef, useState } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { useLanguage } from './hooks/useLanguage.js'
import { LanguageContext } from './i18n/index.js'
import Desk from './components/ui/Desk.jsx'
import { MugshotDefs } from './components/ui/Polaroid.jsx'
import CoverScreen from './components/screens/CoverScreen.jsx'
import SetupScreen from './components/screens/SetupScreen.jsx'
import WordRevealScreen from './components/screens/WordRevealScreen.jsx'
import DiscussionScreen from './components/screens/DiscussionScreen.jsx'
import RevealScreen from './components/screens/RevealScreen.jsx'

export default function App() {
  const { lang, setLang } = useLanguage()
  const { state, actions } = useGameState(lang)
  const [coverOpen, setCoverOpen] = useState(false)
  const main = useRef(null)

  const screens = {
    COVER: <CoverScreen onOpen={() => setCoverOpen(true)} />,
    SETUP: <SetupScreen state={state} actions={actions} />,
    REVEAL_SEQUENCE: <WordRevealScreen state={state} actions={actions} />,
    DISCUSSION: <DiscussionScreen state={state} actions={actions} />,
    RESULT: <RevealScreen state={state} actions={actions} />,
  }
  const scene = state.phase === 'SETUP' && !coverOpen ? 'COVER' : state.phase

  // New paper, new start: top of the page, and focus moves with the player.
  const firstScene = useRef(true)
  useEffect(() => {
    if (firstScene.current) {
      firstScene.current = false
      return
    }
    window.scrollTo(0, 0)
    main.current?.focus({ preventScroll: true })
  }, [scene])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <MugshotDefs />
      <Desk />
      <main ref={main} tabIndex={-1} className="relative z-10 min-h-dvh">
        <div key={scene} className="deal-in">
          {screens[scene]}
        </div>
      </main>
    </LanguageContext.Provider>
  )
}
