export default function CategoryCard({ label, emoji, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2 transition-all active:scale-95 select-none min-h-[80px] ${
        selected
          ? 'border-indigo-500 bg-indigo-900/50 text-indigo-200'
          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
