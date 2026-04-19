import Button from '../ui/Button.jsx'

export default function RevealScreen({ state, actions }) {
  const { players, imposterIndex } = state
  const imposterName = players[imposterIndex]

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">

        <div className="space-y-2">
          <p className="text-apple-gray-400 text-[13px] uppercase tracking-widest font-medium">The Imposter was</p>
          <h2 className="text-[48px] font-semibold tracking-tight text-apple-red leading-none">{imposterName}</h2>
        </div>

        <Button onClick={actions.resetGame}>
          New Round
        </Button>

      </div>
    </div>
  )
}
