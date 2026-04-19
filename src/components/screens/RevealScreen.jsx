import Button from '../ui/Button.jsx'

export default function RevealScreen({ state, actions }) {
  const { accusedPlayer, imposterCaught, players, imposterIndex } = state
  const imposterName = players[imposterIndex]

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">

        <div className="space-y-2">
          <p className="text-apple-gray-400 text-[13px] uppercase tracking-widest font-medium">Most votes</p>
          <h2 className="text-[48px] font-semibold tracking-tight text-apple-label leading-none">{accusedPlayer}</h2>
        </div>

        <div className="w-px h-8 bg-apple-gray-200 mx-auto" />

        {imposterCaught ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-[13px] uppercase tracking-widest font-medium text-apple-red">Caught</p>
              <h3 className="text-[28px] font-semibold tracking-tight text-apple-label">
                They are the Imposter.
              </h3>
              <p className="text-apple-gray-500 text-[15px]">
                But {imposterName} still has one final chance…
              </p>
            </div>
            <Button onClick={actions.goToImposterGuess}>
              Imposter's Last Chance
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-[13px] uppercase tracking-widest font-medium text-apple-green">Not Guilty</p>
              <h3 className="text-[28px] font-semibold tracking-tight text-apple-label">
                They are not the Imposter.
              </h3>
              <p className="text-apple-gray-500 text-[15px]">
                The real Imposter was{' '}
                <span className="text-apple-red font-medium">{imposterName}</span>.
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
