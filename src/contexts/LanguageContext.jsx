import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language')
      if (stored && (stored === 'zh-TW' || stored === 'en')) return stored
      // Default to zh-TW for Traditional Chinese users
      const browserLang = navigator.language
      if (browserLang.startsWith('zh')) return 'zh-TW'
      return 'en'
    }
    return 'zh-TW'
  })

  useEffect(() => {
    localStorage.setItem('language', lang)
  }, [lang])

  const t = (key, vars = {}) => {
    let text = translations[lang][key] || key
    Object.keys(vars).forEach(k => {
      text = text.replace(`{${k}}`, vars[k])
    })
    return text
  }

  const toggle = () => setLang(lang === 'zh-TW' ? 'en' : 'zh-TW')

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
