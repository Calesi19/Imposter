export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="toggle"
      onClick={onChange}
    >
      <span className="toggle-collar" />
      <span className="toggle-bat" />
    </button>
  )
}
