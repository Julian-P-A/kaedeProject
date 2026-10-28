import { HeadContent, Scripts, createRootRoute, useParams } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { DEFAULT_LANGUAGE, isLanguage } from '#/lib/seo'
import { NotFound } from '#/components/NotFound'
import { BrandCursor } from '#/components/animations/BrandCursor'

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
    scripts: [
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'/gtagmetrics/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MBZHNK5P');`,
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MBZHNK5P"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <BrandCursor />
        <Scripts />
      </body>
    </html>
  )
}
