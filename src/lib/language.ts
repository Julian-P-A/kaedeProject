import type { Language } from '../data/translations'

export const LANGUAGES: readonly Language[] = ['en', 'es']
export const DEFAULT_LANGUAGE: Language = 'en'

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value)
}

/** Negotiate only the language-neutral entry point; explicit language URLs win. */
export function preferredLanguage(header: string): Language {
  const preferences = header.split(',').flatMap((part, order) => {
    const match = part
      .trim()
      .match(/^(\*|[a-z]{1,8}(?:-[a-z0-9]{1,8})*)(?:\s*;\s*q=(0(?:\.\d{0,3})?|1(?:\.0{0,3})?))?$/i)
    return match ? [{ range: match[1].toLowerCase(), quality: Number(match[2] ?? 1), order }] : []
  })
  const candidates = preferences
    .filter(({ range, quality }) => quality > 0 && isLanguage(range.split('-')[0]))
    .sort((a, b) => b.quality - a.quality || a.order - b.order)

  if (candidates.length) return candidates[0].range.split('-')[0] as Language

  if (preferences.some(({ range, quality }) => range === '*' && quality > 0)) {
    const available = LANGUAGES.find(
      (lang) => !preferences.some(({ range, quality }) => range.split('-')[0] === lang && quality === 0),
    )
    if (available) return available
  }
  // Serve the default rather than rejecting the page when no language matches.
  return DEFAULT_LANGUAGE
}
