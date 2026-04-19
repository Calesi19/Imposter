import Button from '../ui/Button.jsx'

export default function RevealScreen({ state, actions }) {
  const { accusedPlayer, imposterCaught, players, imposterIndex } = state
  const imposterName = players[imposterIndex]

  return (
    <div className="min-h-dvh min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">

        <div className="space-y-2">
          <p className="text-slate-500 text-xs uppercase tracking-widest">Most votes</p>
          <h2 className="text-5xl font-bold text-slate-100">{accusedPlayer}</h2>
        </div>

        {imposterCaught ? (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-red-900/50 flex items-center justify-center mx-auto">
              <span className="text-4xl">🕵️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">They ARE the Imposter!</p>
              <p className="text-slate-400 mt-2 text-sm">
                But {imposterName} still has one chance to win…
              </p>
            </div>
            <Button onClick={actions.goToImposterGuess}>
              Imposter's Last Chance
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mx-auto">
              <span className="text-4xl">😅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">They are NOT the Imposter!</p>
              <p className="text-slate-400 mt-2 text-sm">
                The real Imposter was <span className="text-red-400 font-semibold">{imposterName}</span>
              </p>
            </div>
            <Button onClick={actions.goToGameOver}>
              See Results
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
