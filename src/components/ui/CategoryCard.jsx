import { hashName, tiltFor } from '../../utils/motion.js'
import Stamp from './Stamp.jsx'

export default function CategoryCard({ label, imageKey, selected, onToggle, stampLabel }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className="file-card select-none"
      style={{ '--tilt': tiltFor(hashName(imageKey), 1.6) }}
    >
      <span className="relative block overflow-hidden">
        <img src={`${import.meta.env.BASE_URL}categories/${imageKey}.webp`} alt="" draggable={false} />
        {selected && (
          <span className="absolute inset-0 grid place-items-center bg-[rgb(239_234_219/0.3)]">
            <Stamp slam tilt={-12} className="bg-[rgb(239_234_219/0.82)] text-[1.125rem]">
              {stampLabel}
            </Stamp>
          </span>
        )}
      </span>
      <span className="block px-0.5 py-1.5 text-center text-[0.8125rem] leading-tight">{label}</span>
    </button>
  )
}
