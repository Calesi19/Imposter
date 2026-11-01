// The room everything sits in. The lamp and vignette follow the player to every
// screen; the larger props only appear when a wide window leaves desk to fill.
export default function Desk() {
  return (
    <div className="desk" aria-hidden="true">
      <div className="desk-ring" />

      {/* Pencil */}
      <svg className="desk-prop" style={{ left: '5%', top: '56%', transform: 'rotate(-58deg)' }} width="300" height="16" viewBox="0 0 300 16">
        <rect x="26" y="1" width="244" height="14" fill="#7c6a2e" />
        <rect x="26" y="1" width="244" height="5" fill="#a78f46" />
        <rect x="26" y="11" width="244" height="4" fill="#5a4c20" />
        <rect x="268" y="1" width="12" height="14" fill="#b4914b" />
        <rect x="280" y="1" width="16" height="14" rx="3" fill="#7d3a30" />
        <path d="M26 1 0 8l26 7z" fill="#cfae84" />
        <path d="M9 5.6 0 8l9 2.4z" fill="#1d1a16" />
      </svg>

      {/* Stack of closed case files */}
      <div
        className="desk-prop folder"
        style={{ right: '-70px', top: '10%', width: '300px', height: '200px', transform: 'rotate(7deg)', filter: 'brightness(0.55)' }}
      />
      <div
        className="desk-prop folder"
        style={{ right: '-46px', top: '13%', width: '300px', height: '200px', transform: 'rotate(-3deg)', filter: 'brightness(0.68)' }}
      />

      {/* Brass letter opener */}
      <svg className="desk-prop" style={{ left: '9%', top: '12%', transform: 'rotate(24deg)' }} width="26" height="230" viewBox="0 0 26 230">
        <path d="M13 0c7 26 9 120 9 150H4C4 120 6 26 13 0z" fill="#8d7339" />
        <path d="M13 0c-7 26-9 120-9 150h9z" fill="#c9aa63" />
        <rect x="1" y="150" width="24" height="8" fill="#5d4b22" />
        <rect x="7" y="158" width="12" height="62" rx="3" fill="#2c261c" />
        <circle cx="13" cy="222" r="7" fill="#b4914b" />
      </svg>

      <div className="desk-lamp" />
      <div className="desk-vignette" />
    </div>
  )
}
