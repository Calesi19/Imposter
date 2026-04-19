import { createContext, useState } from 'react'

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

function init() {
  const saved = localStorage.getItem('imposter_theme')
  const theme = saved === 'dark' ? 'dark' : 'light'
  if (theme === 'dark') document.documentElement.classList.add('dark')
  return theme
}

export function useTheme() {
  const [theme, setThemeState] = useState(init)

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setThemeState(next)
    localStorage.setItem('imposter_theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { theme, toggleTheme }
}
