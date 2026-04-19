export default function WordRevealScreen({ state, actions }) {
  const { players, revealStep, revealPhase, imposterIndex, secretWord } = state
  const currentPlayer = players[revealStep]
  const isImposter = revealStep === imposterIndex
  const isLastPlayer = revealStep === players.length - 1

  return (
    <div
      className="min-h-dvh min-h-screen bg-white flex flex-col items-center justify-center px-8 select-none"
      onClick={actions.advanceTap}
    >
      {revealPhase === 'NAME' && (
        <div className="text-center space-y-4">
          <p className="text-apple-gray-400 text-[13px] uppercase tracking-widest font-medium">Next up</p>
          <h2 className="text-[40px] font-semibold tracking-tight text-apple-label leading-tight">{currentPlayer}</h2>
          <p className="text-apple-gray-400 text-[17px]">Tap to see your word</p>
        </div>
      )}

      {revealPhase === 'WORD' && (
        <div className="text-center space-y-6">
          <p className="text-apple-gray-400 text-[15px] font-medium">{currentPlayer}</p>
          {isImposter ? (
            <div className="space-y-4">
              <h2 className="text-[36px] font-semibold tracking-tight text-apple-red leading-tight">
                You are the<br />Imposter.
              </h2>
              <p className="text-apple-gray-400 text-[15px] max-w-[260px] mx-auto leading-relaxed">
                Blend in. Don't reveal you don't know the word.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-apple-gray-400 text-[15px]">The secret word is</p>
              <h2 className="text-[52px] font-semibold tracking-tight text-apple-label leading-none">{secretWord}</h2>
            </div>
          )}
          <p className="text-apple-gray-300 text-[15px] pt-4">Tap to hide</p>
        </div>
      )}

      {revealPhase === 'HIDDEN' && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-apple-gray-100 border border-apple-gray-200 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="1.5" strokeLinecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-[28px] font-semibold tracking-tight text-apple-label">Cover the screen</h2>
            <p className="text-apple-gray-500 text-[17px]">
              {isLastPlayer ? 'Tap when everyone is ready' : `Pass to ${players[revealStep + 1]}`}
            </p>
          </div>
          <p className="text-apple-gray-300 text-[15px]">Tap to continue</p>
        </div>
      )}

      {/* Progress dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
        {players.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < revealStep
                ? 'w-1.5 h-1.5 bg-apple-gray-200'
                : i === revealStep
                ? 'w-4 h-1.5 bg-apple-blue'
                : 'w-1.5 h-1.5 bg-apple-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
