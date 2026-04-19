import Button from '../ui/Button.jsx'

export default function DiscussionScreen({ state, actions }) {
  return (
    <div className="min-h-dvh min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-100">Discussion Time</h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 text-left space-y-3">
          <p className="text-slate-300 text-sm leading-relaxed">
            Take turns saying <span className="text-indigo-400 font-semibold">one word</span> related to the secret word.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            The <span className="text-red-400 font-semibold">Imposter</span> doesn't know the word — they must bluff.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            After a few rounds, you'll vote on who you think the Imposter is.
          </p>
        </div>

        <div className="text-slate-500 text-sm">
          {state.players.length} players · {state.selectedCategories.length} theme{state.selectedCategories.length !== 1 ? 's' : ''}
        </div>

        <Button onClick={actions.startVoting}>
          Start Voting
        </Button>
      </div>
    </div>
  )
}
