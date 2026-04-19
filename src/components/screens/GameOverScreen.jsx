import Button from '../ui/Button.jsx'

export default function GameOverScreen({ state, actions }) {
  const { players, imposterIndices, imposterCaught, imposterGuessCorrect, secretWord, accusedPlayer } = state
  const imposterNames = imposterIndices.map(i => players[i]).join(' & ')

  const imposterWins = !imposterCaught || imposterGuessCorrect === true

  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-2">
          <p className={`text-[13px] uppercase tracking-widest font-medium ${imposterWins ? 'text-apple-red' : 'text-apple-blue'}`}>
            {imposterWins ? 'Imposter wins' : 'Players win'}
          </p>
          <h2 className="text-[36px] font-semibold tracking-tight text-apple-label leading-tight">
            {imposterWins ? `${imposterNames} fooled everyone.` : 'The Imposter was caught.'}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-apple-gray-200 overflow-hidden">
          {[
            { label: 'Secret word', value: secretWord?.word ?? secretWord, valueClass: 'text-apple-label font-semibold' },
            { label: imposterIndices.length === 1 ? 'Imposter' : 'Imposters', value: imposterNames, valueClass: 'text-apple-red font-medium' },
            { label: 'Most votes', value: accusedPlayer, valueClass: 'text-apple-label' },
            ...(imposterGuessCorrect !== null
              ? [{ label: "Imposter's guess", value: imposterGuessCorrect ? 'Correct' : 'Wrong', valueClass: imposterGuessCorrect ? 'text-apple-green font-medium' : 'text-apple-red font-medium' }]
              : []),
          ].map((row, i, arr) => (
            <div
              key={i}
              className={`flex justify-between items-center px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-apple-gray-100' : ''}`}
            >
              <span className="text-apple-gray-500 text-[15px]">{row.label}</span>
              <span className={`text-[15px] ${row.valueClass}`}>{row.value}</span>
            </div>
          ))}
        </div>

        <Button onClick={actions.resetGame}>
          Play Again
        </Button>
      </div>
    </div>
  )
}
