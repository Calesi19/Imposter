import { useEffect, useRef, useState } from 'react'
import { sfx } from '../../utils/sound.js'

// How far the bar must travel to count as "read".
const READ_AT = 0.72
// Screen readers activate with a click and cannot hold; give them time to listen.
const ASSISTED_MS = 6000

// The signature gesture. A black ink bar sits over the secret, and the secret
// exists only while a thumb holds the bar off it. With `keepOpen` the bar stays
// off once dragged far enough (the group declassifying the case).
export default function RedactionStrip({ children, barLabel, ariaLabel, keepOpen = false, onRead, className = '' }) {
  const root = useRef(null)
  const drag = useRef(null)
  const lift = useRef(0)
  const assisted = useRef(null)
  const [held, setHeld] = useState(false)
  const [open, setOpen] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => () => clearTimeout(assisted.current), [])

  function paint(value) {
    lift.current = value
    root.current?.style.setProperty('--lift', value)
    if (value >= READ_AT) markRead()
  }

  function markRead() {
    if (drag.current?.read) return
    if (drag.current) drag.current.read = true
    onRead?.()
  }

  function close() {
    setHeld(false)
    if (keepOpen && lift.current >= READ_AT) {
      setOpen(true)
      paint(1)
      return
    }
    lift.current = 0
    root.current?.style.setProperty('--lift', 0)
  }

  function handlePointerDown(e) {
    if (open) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, width: root.current.offsetWidth, read: false }
    setHeld(true)
    setTouched(true)
    sfx.peel()
  }

  function handlePointerMove(e) {
    if (!drag.current) return
    const travel = (e.clientX - drag.current.x) / (drag.current.width * 0.86)
    paint(Math.max(0, Math.min(1, travel)))
  }

  function handlePointerUp() {
    if (!drag.current) return
    drag.current = null
    close()
  }

  function holdFromKeyboard() {
    setHeld(true)
    setTouched(true)
    sfx.peel()
    paint(1)
  }

  function handleKeyDown(e) {
    if (open || e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return
    e.preventDefault()
    drag.current = { x: 0, width: 1, read: false }
    holdFromKeyboard()
  }

  function handleKeyUp(e) {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    drag.current = null
    close()
  }

  // Keyboard holds are handled above and pointers report a detail, so a click
  // with detail 0 can only come from assistive tech.
  function handleClick(e) {
    if (open || e.detail !== 0 || held) return
    holdFromKeyboard()
    assisted.current = setTimeout(close, ASSISTED_MS)
  }

  return (
    <>
    <button
      ref={root}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={held || open}
      aria-disabled={open}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClick={handleClick}
      onContextMenu={e => e.preventDefault()}
      className={`strip ${held ? 'is-held' : ''} ${open ? 'is-open' : ''} ${touched ? '' : 'strip-hint'} ${className}`}
    >
      <span className="strip-secret" aria-hidden={!(held || open)}>
        {children}
      </span>
      <span className="strip-ink" aria-hidden="true">
        <span className="strip-ink-face">
          <span className="strip-grip">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
              <path d="m6 5 7 7-7 7M13 5l7 7-7 7" />
            </svg>
          </span>
          <span className="t-label flex-1 text-center text-desk-text">{barLabel}</span>
        </span>
      </span>
    </button>
    <span className="sr-only" aria-live="polite">
      {held || open ? children : ''}
    </span>
    </>
  )
}
