import { useState } from 'react'

const VoteStep = {
  PROMPT: 'PROMPT',
  VOTING: 'VOTING',
  DONE: 'DONE',
}

export default function VotingScreen({ state, actions }) {
  const { players, currentVoterIndex } = state
  const [step, setStep] = useState(VoteStep.PROMPT)
  const currentVoter = players[currentVoterIndex]

  function handleReady() {
    setStep(VoteStep.VOTING)
  }

  function handleVote(suspect) {
    setStep(VoteStep.DONE)
    setTimeout(() => {
      actions.castVote(currentVoter, suspect)
      setStep(VoteStep.PROMPT)
    }, 1200)
  }

  const isLastVoter = currentVoterIndex === players.length - 1

  return (
    <div className="min-h-dvh min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">

        {step === VoteStep.PROMPT && (
          <div className="text-center space-y-6">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">
                Voting · {currentVoterIndex + 1} of {players.length}
              </p>
              <p className="text-slate-400 text-base">Pass the phone to</p>
              <h2 className="text-4xl font-bold text-slate-100 mt-1">{currentVoter}</h2>
            </div>
            <button
              onClick={handleReady}
              className="w-full min-h-[64px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-lg active:scale-95 transition-all select-none"
            >
              I'm Ready to Vote
            </button>
          </div>
        )}

        {step === VoteStep.VOTING && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">{currentVoter}, who is the Imposter?</p>
            </div>
            <div className="space-y-2">
              {players
                .filter(p => p !== currentVoter)
                .map(player => (
                  <button
                    key={player}
                    onClick={() => handleVote(player)}
                    className="w-full min-h-[56px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-100 rounded-2xl font-medium text-lg active:scale-95 transition-all select-none"
                  >
                    {player}
                  </button>
                ))}
            </div>
          </div>
        )}

        {step === VoteStep.DONE && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-900/50 flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-slate-300 text-lg font-medium">Vote recorded</p>
            {!isLastVoter && (
              <p className="text-slate-500 text-sm">
                Pass to {players[currentVoterIndex + 1]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
