import { hashName, tiltFor } from '../../utils/motion.js'

const SKIN = '#26231f'
const RIM = '#6a665b'

// Hat, hair and collar are drawn from the name's hash: a procedural mugshot
// for every agent, always the same one for the same name.
const HEADWEAR = [
  // Fedora
  <g key="fedora" fill="#141210">
    <path d="M22 44c8-4 48-4 56 0 3 2-3 5-9 5H31c-6 0-12-3-9-5z" />
    <path d="M33 45c0-12 3-22 8-23 4-1 6 3 9 3s5-4 9-3c5 1 8 11 8 23z" />
    <path d="M33 39h34v6H33z" fill="#3a3730" />
  </g>,
  // Flat cap
  <path key="cap" d="M31 46c-1-13 8-21 20-21 13 0 21 8 24 18l-8 2c-11-3-24-3-36 1z" fill="#141210" />,
  // Side-parted hair
  <path key="parted" d="M32 50c-4-16 6-27 19-27 12 0 21 10 17 27-1-6-3-10-6-13-9 2-20 3-26 1-2 3-3 7-4 12z" fill="#0f0e0c" />,
  // Long hair
  <path key="long" d="M30 78c-5-20-5-55 20-55s25 35 20 55c-5 2-8-1-9-3 4-13 2-30-3-36-6 2-12 2-17 1-5 7-6 22-2 35-1 2-4 5-9 3z" fill="#0f0e0c" />,
  // Bare head
  null,
]

const COLLARS = [
  // Trench coat, turned-up lapels
  <path key="trench" d="M50 80 34 72l-4 10 12 18h16l12-18-4-10z" fill="#5d594f" />,
  // Shirt and tie
  <g key="tie">
    <path d="M42 76h16l-8 12z" fill="#b6b0a0" />
    <path d="M48 84h4l2 16h-8z" fill="#0f0e0c" />
  </g>,
  // Roll neck
  <path key="roll" d="M40 72c6 3 14 3 20 0l3 9c-8 4-18 4-26 0z" fill="#46433b" />,
]

function Mugshot({ seed }) {
  const headwear = HEADWEAR[seed % HEADWEAR.length]
  const collar = COLLARS[(seed >>> 4) % COLLARS.length]
  const glasses = (seed >>> 8) % 4 === 0
  const shift = ((seed >>> 12) % 7) - 3
  const light = 150 + ((seed >>> 16) % 40)

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill={`rgb(${light} ${light - 4} ${light - 14})`} />
      {[18, 36, 54, 72, 90].map(y => (
        <path key={y} d={`M0 ${y}h100`} stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
      ))}
      <rect width="100" height="100" fill="url(#mug-falloff)" />
      <g transform={`translate(${shift} 0)`}>
        <path d="M6 100c1-16 10-23 26-27l12-3h12l12 3c16 4 25 11 26 27z" fill="#1a1815" />
        <path d="M42 62h16v14c-5 4-11 4-16 0z" fill={SKIN} />
        <ellipse cx="50" cy="49" rx="17" ry="21" fill={SKIN} />
        <path d="M34 42c-2 8 0 19 6 24" stroke={RIM} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {collar}
        {headwear}
        {glasses && (
          <g stroke="#a9a596" strokeWidth="1.4" fill="none">
            <circle cx="43" cy="51" r="5" />
            <circle cx="57" cy="51" r="5" />
            <path d="M48 51h4" />
          </g>
        )}
      </g>
    </svg>
  )
}

export function MugshotDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <radialGradient id="mug-falloff" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function Polaroid({ name, showName = true, tilt, className = '', children }) {
  const seed = hashName(name)
  return (
    <span className={`polaroid ${className}`} style={{ '--tilt': tilt ?? tiltFor(seed) }}>
      <span className="polaroid-photo">
        <Mugshot seed={seed} />
      </span>
      {showName ? <span className="polaroid-name">{name}</span> : <span className="block h-3" />}
      {children}
    </span>
  )
}

export function PolaroidSlot({ label }) {
  return (
    <span className="polaroid polaroid-empty" aria-hidden="true">
      <span className="polaroid-photo text-[0.6875rem] leading-tight">{label}</span>
      <span className="polaroid-name">&nbsp;</span>
    </span>
  )
}
