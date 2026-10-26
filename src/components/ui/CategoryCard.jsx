export default function CategoryCard({ label, imageKey, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={selected}
      className={`relative overflow-hidden rounded-2xl border-2 min-h-[104px] text-left transition-all duration-150 active:scale-95 select-none ${
        selected ? 'border-white' : 'border-white/10'
      }`}
    >
      <img
        src={`${import.meta.env.BASE_URL}categories/${imageKey}.webp`}
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ${
          selected ? 'opacity-100' : 'opacity-75'
        }`}
      />
      {/* Gradient that fades up from the corner, with a matching fading
          blur, so the label stays readable over the photo. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_45%,transparent)]"
      />
      <span className="absolute left-2.5 bottom-2 text-[13px] font-semibold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        {label}
      </span>
    </button>
  )
}
