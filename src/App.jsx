import { useGameState } from './hooks/useGameState.js'
import SetupScreen from './components/screens/SetupScreen.jsx'
import WordRevealScreen from './components/screens/WordRevealScreen.jsx'
import DiscussionScreen from './components/screens/DiscussionScreen.jsx'
import VotingScreen from './components/screens/VotingScreen.jsx'
import RevealScreen from './components/screens/RevealScreen.jsx'
import ImposterGuessScreen from './components/screens/ImposterGuessScreen.jsx'
import GameOverScreen from './components/screens/GameOverScreen.jsx'

export default function App() {
  const { state, actions } = useGameState()

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
    <div className="min-h-screen bg-apple-gray-50 sm:flex sm:justify-center">
      <div className="w-full sm:max-w-sm sm:min-h-screen overflow-hidden relative">
        {screens[state.phase]}
      </div>
    </div>
  )
}
