import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { LanguageProvider } from '#/context/LanguageContext'

const SITE_URL = 'https://kaedeproject.com/'
const SITE_TITLE = 'Kaede Project — Digital Development, AI & Automation'
const SITE_DESCRIPTION =
  'Kaede Project designs and builds websites, AI solutions, automations, CRM systems and custom digital platforms focused on real business growth.'
const OG_IMAGE = `${SITE_URL}og-image.png`

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kaede Project',
  url: SITE_URL,
  logo: `${SITE_URL}favicon-white.svg`,
  description: SITE_DESCRIPTION,
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
      { title: SITE_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      { name: 'robots', content: 'index, follow' },

      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Kaede Project' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:locale:alternate', content: 'es_ES' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'canonical', href: SITE_URL },
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
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Scripts />
      </body>
    </html>
  )
}
