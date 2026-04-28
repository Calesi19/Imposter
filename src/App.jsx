import { useGameState } from './hooks/useGameState.js'
import { useLanguage } from './hooks/useLanguage.js'
import { useTheme } from './hooks/useTheme.js'
import { ThemeContext } from './hooks/useTheme.js'
import { LanguageContext } from './i18n/index.js'
import SetupScreen from './components/screens/SetupScreen.jsx'
import WordRevealScreen from './components/screens/WordRevealScreen.jsx'
import DiscussionScreen from './components/screens/DiscussionScreen.jsx'
import RevealScreen from './components/screens/RevealScreen.jsx'
import VotingScreen from './components/screens/VotingScreen.jsx'
import ImposterGuessScreen from './components/screens/ImposterGuessScreen.jsx'
import GameOverScreen from './components/screens/GameOverScreen.jsx'

export default function App() {
  const { lang, setLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { state, actions } = useGameState(lang)

  const screens = {
    SETUP: <SetupScreen state={state} actions={actions} />,
    REVEAL_SEQUENCE: <WordRevealScreen state={state} actions={actions} />,
    DISCUSSION: <DiscussionScreen state={state} actions={actions} />,
    VOTING: <VotingScreen state={state} actions={actions} />,
    RESULT: <RevealScreen state={state} actions={actions} />,
    IMPOSTER_GUESS: <ImposterGuessScreen state={state} actions={actions} />,
    GAME_OVER: <GameOverScreen state={state} actions={actions} />,
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ lang, setLang }}>
        <div className="min-h-screen bg-black sm:flex sm:justify-center">
          <div className="bg-red-glow" />
          <div className="w-full sm:max-w-sm sm:min-h-screen overflow-hidden relative" style={{ zIndex: 1 }}>
            {screens[state.phase]}
          </div>
        </div>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}
