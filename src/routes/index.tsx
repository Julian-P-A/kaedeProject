import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { preferredLanguage } from '#/lib/language'

const getPreferredLanguage = createServerFn({ method: 'GET' }).handler(() =>
  preferredLanguage(getRequestHeader('accept-language') ?? ''),
)

// `/` is the hreflang x-default: it only routes visitors to the matching language version.
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const lang = await getPreferredLanguage()
    throw redirect({ to: '/$lang', params: { lang } })
  },
})
