import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translations, type Language, type Translations } from '#/data/translations'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'kaede-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'en' || stored === 'es') setLangState(stored)
    } catch {
      // localStorage unavailable, keep default
    }
  }, [])

  const setLang = (next: Language) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore write failures
    }
  }

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
