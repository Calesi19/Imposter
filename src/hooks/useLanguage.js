import { useState } from 'react'

function detectLang() {
  const saved = localStorage.getItem('imposter_language')
  if (saved === 'en' || saved === 'es' || saved === 'pt') return saved
  if (navigator.language?.startsWith('pt')) return 'pt'
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
