export default function CategoryCard({ label, emoji, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150 active:scale-95 select-none min-h-[76px] ${
        selected
          ? 'border-apple-blue bg-white text-apple-blue'
          : 'border-apple-gray-200 bg-white text-apple-gray-500'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-[12px] font-medium leading-tight">{label}</span>
    </button>
  )
}
