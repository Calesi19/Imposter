import { useRef } from 'react'
import { sfx } from '../../utils/sound.js'

const DEGREES_PER_STEP = 12
const SWEEP_START = -150

function polar(angle, radius) {
  const rad = ((angle - 90) * Math.PI) / 180
  return [50 + radius * Math.cos(rad), 50 + radius * Math.sin(rad)]
}

export default function RotaryDial({ value, min = 0, max = 25, onChange, label }) {
  const dial = useRef(null)
  const drag = useRef(null)
  const current = useRef(value)
  current.current = value

  function angleOf(e) {
    const box = dial.current.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    return (Math.atan2(y, x) * 180) / Math.PI
  }

  function step(next) {
    const clamped = Math.max(min, Math.min(max, next))
    if (clamped === current.current) return
    current.current = clamped
    sfx.detent()
    onChange(clamped)
  }

  function handlePointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { angle: angleOf(e), carry: 0 }
  }

  function handlePointerMove(e) {
    if (!drag.current) return
    const angle = angleOf(e)
    // Unwrap across the ±180° seam so a turn past 9 o'clock stays continuous.
    const delta = ((angle - drag.current.angle + 540) % 360) - 180
    drag.current.angle = angle
    drag.current.carry += delta
    const steps = Math.trunc(drag.current.carry / DEGREES_PER_STEP)
    if (steps !== 0) {
      drag.current.carry -= steps * DEGREES_PER_STEP
      step(current.current + steps)
    }
  }

  function handlePointerUp() {
    drag.current = null
  }

  function handleKeyDown(e) {
    const moves = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 5,
      PageDown: -5,
    }
    if (e.key === 'Home') step(min)
    else if (e.key === 'End') step(max)
    else if (moves[e.key]) step(current.current + moves[e.key])
    else return
    e.preventDefault()
  }

  const ticks = Array.from({ length: max - min + 1 }, (_, i) => i)

  return (
    <div
      ref={dial}
      className="dial"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <svg className="dial-scale" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="49" fill="#1b1a13" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="#6d6e4a" strokeWidth="0.8" />
        {ticks.map(i => {
          const angle = SWEEP_START + i * DEGREES_PER_STEP
          const major = i % 5 === 0
          const [x1, y1] = polar(angle, major ? 33 : 34.5)
          const [x2, y2] = polar(angle, 37)
          const [lx, ly] = polar(angle, 43)
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i === value ? '#ef6a55' : '#d6d0b4'}
                strokeWidth={major ? 1.3 : 0.8}
              />
              {major && (
                <text x={lx} y={ly + 2.2} textAnchor="middle" fontSize="6.4" fill="#e6dcc3" fontFamily="var(--font-typed)">
                  {i}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <span className="dial-knob" style={{ '--turn': `${SWEEP_START + value * DEGREES_PER_STEP}deg` }} />
      <span className="dial-window">{value}</span>
    </div>
  )
}
