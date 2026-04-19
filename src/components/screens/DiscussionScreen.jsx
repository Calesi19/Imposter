import Button from '../ui/Button.jsx'

export default function DiscussionScreen({ state, actions }) {
  return (
    <div className="min-h-dvh min-h-screen bg-apple-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-2">
          <h2 className="text-[34px] font-semibold tracking-tight text-apple-label">Discussion</h2>
          <p className="text-apple-gray-500 text-[17px]">Take turns before you vote</p>
        </div>

        <div className="space-y-3">
          {[
            'Say one word related to the secret word on your turn.',
            "The Imposter doesn't know the word — they're bluffing.",
            'When ready, vote for who you think the Imposter is.',
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start bg-white rounded-2xl px-4 py-4 border border-apple-gray-200">
              <span className="text-apple-blue font-semibold text-[15px] mt-0.5 shrink-0">{i + 1}</span>
              <p className="text-apple-label text-[15px] leading-snug">{text}</p>
            </div>
          ))}
        </div>

        <Button onClick={actions.startVoting}>
          Start Voting
        </Button>
      </div>
    </div>
  )
}
