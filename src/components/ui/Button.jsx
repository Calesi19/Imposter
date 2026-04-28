export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const base = 'w-full min-h-[50px] rounded-xl font-medium text-[17px] select-none transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none tracking-tight'
  const variants = {
    primary: 'bg-white text-black',
    secondary: 'bg-apple-gray-900 text-white border border-apple-gray-700',
    danger: 'bg-apple-red text-white',
    ghost: 'bg-transparent text-white',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
