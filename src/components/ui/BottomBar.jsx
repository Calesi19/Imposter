import { createPortal } from 'react-dom'

// Portalled to <body>: the scene's deal-in transform would otherwise become the
// containing block for position: fixed and float the bar up the page.
export default function BottomBar({ children, className = '' }) {
  return createPortal(
    <div className="bottom-bar">
      <div className={`mx-auto max-w-[30rem] ${className}`}>{children}</div>
    </div>,
    document.body,
  )
}
