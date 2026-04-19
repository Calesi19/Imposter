export default function WordRevealScreen({ state, actions }) {
  const { players, revealStep, revealPhase, imposterIndex, secretWord } = state
  const currentPlayer = players[revealStep]
  const isImposter = revealStep === imposterIndex
  const isLastPlayer = revealStep === players.length - 1

  return (
    <div
      className="min-h-dvh min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 select-none"
      onClick={actions.advanceTap}
    >
      {revealPhase === 'NAME' && (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-slate-300">
              {currentPlayer.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Next up</p>
            <h2 className="text-4xl font-bold text-slate-100">{currentPlayer}</h2>
          </div>
          <p className="text-slate-500 text-base">Tap to see your word</p>
        </div>
      )}

      {revealPhase === 'WORD' && (
        <div className="text-center space-y-6">
          <p className="text-slate-400 text-sm uppercase tracking-widest">{currentPlayer}</p>
          {isImposter ? (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-900/50 flex items-center justify-center mx-auto">
                <span className="text-3xl">🕵️</span>
              </div>
              <h2 className="text-3xl font-bold text-red-400">You are the Imposter!</h2>
              <p className="text-slate-500 text-sm">Blend in. Don't reveal you don't know the word.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-500 text-sm">The secret word is</p>
              <h2 className="text-5xl font-bold text-slate-100 leading-tight">{secretWord}</h2>
            </div>
          )}
          <p className="text-slate-600 text-sm mt-8">Tap to hide</p>
        </div>
      )}

      {revealPhase === 'HIDDEN' && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
            <span className="text-2xl">👁️‍🗨️</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-300">Cover the screen</h2>
          <p className="text-slate-500">
            {isLastPlayer ? 'Tap when everyone is ready' : `Pass to ${players[revealStep + 1]}`}
          </p>
          <p className="text-slate-600 text-sm">Tap to continue</p>
        </div>
      )}

      {/* Progress */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
        {players.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < revealStep
                ? 'w-4 bg-indigo-500'
                : i === revealStep
                ? 'w-6 bg-indigo-400'
                : 'w-4 bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
