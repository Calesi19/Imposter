export default function CategoryCard({ label, emoji, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150 active:scale-95 select-none min-h-[76px] ${
        selected
          ? 'border-white bg-apple-gray-900 text-white'
          : 'border-apple-gray-700 bg-apple-gray-900 text-apple-gray-400'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-[12px] font-medium leading-tight">{label}</span>
    </button>
  )
}
