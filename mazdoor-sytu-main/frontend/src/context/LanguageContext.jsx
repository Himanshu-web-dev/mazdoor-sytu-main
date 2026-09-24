import { createContext, useContext, useState, useEffect } from 'react'
import { getTranslation } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mazdoor_language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('mazdoor_language', language)
    document.documentElement.lang = language
  }, [language])

  const changeLanguage = (newLang) => {
    setLanguage(newLang)
    localStorage.setItem('mazdoor_language', newLang)
    window.dispatchEvent(new CustomEvent('mazdoor_language_changed', { detail: { language: newLang } }))
  }

  const t = (key, fallback) => {
    const val = getTranslation(language, key)
    return val !== key ? val : (fallback || key)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Graceful fallback if used outside provider
    const fallbackLang = localStorage.getItem('mazdoor_language') || 'en'
    return {
      language: fallbackLang,
      changeLanguage: () => {},
      t: (key, fallback) => getTranslation(fallbackLang, key) || fallback || key,
    }
  }
  return context
}
