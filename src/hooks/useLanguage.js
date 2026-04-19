import { useState } from 'react'

function detectLang() {
  const saved = localStorage.getItem('imposter_language')
  if (saved === 'en' || saved === 'es') return saved
  return navigator.language?.startsWith('es') ? 'es' : 'en'
}

export function useLanguage() {
  const [lang, setLangState] = useState(detectLang)

  function setLang(l) {
    setLangState(l)
    localStorage.setItem('imposter_language', l)
  }

  return { lang, setLang }
}
