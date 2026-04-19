import { createContext } from 'react'
import en from './en.json'
import es from './es.json'
import pt from './pt.json'

export const LanguageContext = createContext({ lang: 'en', setLang: () => {} })

export function t(lang, key, vars = {}) {
  const strings = lang === 'es' ? es : lang === 'pt' ? pt : en
  let str = strings[key] ?? key
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{{${k}}}`, String(v))
  }
  return str
}
