export default function PlayerChip({ name, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-slate-700 rounded-full px-4 py-2">
      <span className="text-slate-100 text-sm font-medium">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-400 transition-colors ml-1 leading-none select-none"
          aria-label={`Remove ${name}`}
        >
          ×
        </button>
      )}
    </div>
  )
}
