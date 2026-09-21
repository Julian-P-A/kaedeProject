import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { DEFAULT_LANGUAGE } from '#/lib/seo'
import type { Language } from '#/data/translations'

/** Picks the first supported language in the browser's Accept-Language header, falling back to English. */
const getPreferredLanguage = createServerFn({ method: 'GET' }).handler((): Language => {
  const header = getRequestHeader('accept-language') ?? ''
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase().slice(0, 2))
    .find((code) => code === 'en' || code === 'es')

  return (preferred as Language | undefined) ?? DEFAULT_LANGUAGE
})

// `/` is the hreflang x-default: it only routes visitors to the matching language version.
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const lang = await getPreferredLanguage()
    throw redirect({ to: '/$lang', params: { lang } })
  },
})
