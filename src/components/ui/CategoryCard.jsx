export default function CategoryCard({ label, emoji, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150 active:scale-95 select-none min-h-[76px] ${
        selected
          ? 'border-white bg-white/12 backdrop-blur-md text-white'
          : 'border-white/10 bg-white/8 backdrop-blur-md text-apple-gray-400'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-[12px] font-medium leading-tight">{label}</span>
    </button>
  )
}
