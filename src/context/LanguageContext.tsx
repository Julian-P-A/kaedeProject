import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { translations, type Language, type Translations } from '#/data/translations'

interface LanguageContextValue {
  lang: Language
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

/** The language is owned by the URL (`/en`, `/es`), so it is passed in rather than kept in state. */
export function LanguageProvider({ lang, children }: { lang: Language; children: ReactNode }) {
  const value = useMemo<LanguageContextValue>(() => ({ lang, t: translations[lang] }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
