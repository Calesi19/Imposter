import { createContext } from 'react'

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

document.documentElement.classList.add('dark')

export function useTheme() {
  return { theme: 'dark', toggleTheme: () => {} }
}
