export default function PlayerChip({ name, onRemove }) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-apple-gray-200 rounded-full px-3 py-1.5">
      <span className="text-apple-label text-[15px] font-medium">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="w-5 h-5 rounded-full bg-apple-gray-300 flex items-center justify-center hover:bg-apple-gray-400 transition-colors select-none ml-0.5 shrink-0"
          aria-label={`Remove ${name}`}
        >
          <span className="text-white text-[13px] font-bold leading-none">×</span>
        </button>
      )}
    </div>
  )
}
