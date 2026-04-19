export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const base = 'w-full min-h-[56px] rounded-2xl font-semibold text-lg select-none transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
    danger: 'bg-red-700 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200',
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
