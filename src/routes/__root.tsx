import { HeadContent, Scripts, createRootRoute, useParams } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { DEFAULT_LANGUAGE, isLanguage } from '#/lib/seo'
import { NotFound } from '#/components/NotFound'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon-dark.svg' },
      { rel: 'icon', type: 'image/svg+xml', media: '(prefers-color-scheme: light)', href: '/favicon-dark.svg' },
      { rel: 'icon', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)', href: '/favicon-white.svg' },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/manrope.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/instrument-serif-italic.woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const lang = useParams({ strict: false, select: (params) => params.lang })

  return (
    <html lang={lang && isLanguage(lang) ? lang : DEFAULT_LANGUAGE}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
