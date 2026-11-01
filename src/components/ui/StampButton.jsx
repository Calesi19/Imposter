import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../../utils/motion.js'

// Lets the ink land before the screen changes. Feedback is instant; the action
// follows a beat later, so the press feels heavy without feeling slow.
const SLAM_MS = 210

export default function StampButton({ children, onClick, disabled = false, tone = 'blood', className = '' }) {
  const [slam, setSlam] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleClick() {
    if (slam) return
    if (reducedMotion()) {
      onClick?.()
      return
    }
    setSlam(true)
    timer.current = setTimeout(() => {
      setSlam(false)
      onClick?.()
    }, SLAM_MS)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`stamp-button ${tone === 'olive' ? 'stamp-button-olive' : ''} ${slam ? 'is-slam' : ''} ${className}`}
    >
      <span className="stamp-button-ink">{children}</span>
    </button>
  )
}
