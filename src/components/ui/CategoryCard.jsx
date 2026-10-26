import GlassSurface from './GlassSurface.jsx'

export default function CategoryCard({ label, emoji, selected, onToggle }) {
  return (
    <GlassSurface
      as="button"
      onClick={onToggle}
      radius={16}
      material={selected ? 'regular' : 'thin'}
      tintOpacity={selected ? 0.22 : undefined}
      className={`rounded-2xl border-2 transition-all duration-150 active:scale-95 select-none ${
        selected ? 'border-white text-white' : 'border-white/10 text-apple-gray-400'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-1.5 p-3 min-h-[76px]">
        <span className="text-2xl">{emoji}</span>
        <span className="text-[12px] font-medium leading-tight">{label}</span>
      </div>
    </GlassSurface>
  )
}
