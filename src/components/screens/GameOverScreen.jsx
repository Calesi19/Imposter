import Button from '../ui/Button.jsx'

export default function GameOverScreen({ state, actions }) {
  const { players, imposterIndex, imposterCaught, imposterGuessCorrect, secretWord, accusedPlayer } = state
  const imposterName = players[imposterIndex]

  // Determine winner
  let imposterWins = false
  if (!imposterCaught) {
    imposterWins = true
  } else if (imposterGuessCorrect === true) {
    imposterWins = true
  }

  const winnerText = imposterWins ? 'Imposter Wins!' : 'Players Win!'
  const winnerEmoji = imposterWins ? '🕵️' : '🎉'
  const winnerColor = imposterWins ? 'text-red-400' : 'text-green-400'

  return (
    <div className="min-h-dvh min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">

        <div className="space-y-3">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
            <span className="text-5xl">{winnerEmoji}</span>
          </div>
          <h2 className={`text-4xl font-bold ${winnerColor}`}>{winnerText}</h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 space-y-3 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Secret word</span>
            <span className="text-slate-100 font-semibold">{secretWord}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Imposter</span>
            <span className="text-red-400 font-semibold">{imposterName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Most votes</span>
            <span className="text-slate-100">{accusedPlayer}</span>
          </div>
          {imposterGuessCorrect !== null && (
            <div className="flex justify-between">
              <span className="text-slate-500">Imposter's guess</span>
              <span className={imposterGuessCorrect ? 'text-green-400' : 'text-red-400'}>
                {imposterGuessCorrect ? 'Correct!' : 'Wrong'}
              </span>
            </div>
          )}
        </div>

        <Button onClick={actions.resetGame}>
          Play Again
        </Button>
      </div>
    </div>
  )
}
