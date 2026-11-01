import { useEffect, useState } from 'react'
import { reducedMotion } from '../../utils/motion.js'

// The untyped remainder stays in the flow, invisible, so lines wrap in their
// final position and nothing shifts while the text is being typed.
export default function Typewriter({ text, delay = 0, speed = 24, className = '' }) {
  const [count, setCount] = useState(() => (reducedMotion() ? text.length : 0))

  useEffect(() => {
    if (reducedMotion()) {
      setCount(text.length)
      return
    }
    setCount(0)
    let typed = 0
    let timer
    const type = () => {
      typed += 1
      setCount(typed)
      if (typed < text.length) timer = setTimeout(type, speed + Math.random() * speed * 0.7)
    }
    timer = setTimeout(type, delay)
    return () => clearTimeout(timer)
  }, [text, delay, speed])

  const typing = count < text.length && count > 0

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {typing && <span className="caret" style={{ marginRight: '-0.5em' }} />}
        <span className="invisible">{text.slice(count)}</span>
      </span>
    </span>
  )
}
