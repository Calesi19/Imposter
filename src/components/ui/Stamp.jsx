export default function Stamp({ children, tone = 'blood', tilt = -6, slam = false, delay = 0, className = '', style }) {
  const toneClass = tone === 'olive' ? 'stamp-olive' : tone === 'brass' ? 'stamp-brass' : ''
  return (
    <span
      className={`stamp ${toneClass} ${slam ? 'stamp-slam' : ''} ${className}`}
      style={{ '--tilt': `${tilt}deg`, '--slam-delay': `${delay}s`, ...style }}
    >
      {children}
    </span>
  )
}
