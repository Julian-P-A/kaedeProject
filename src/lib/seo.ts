import { translations, type Language } from '#/data/translations'

export const SITE_URL = 'https://kaedeproject.com'
export const LANGUAGES: readonly Language[] = ['en', 'es']
export const DEFAULT_LANGUAGE: Language = 'en'

const LOCALES: Record<Language, string> = { en: 'en_US', es: 'es_CO' }
const OG_IMAGE = `${SITE_URL}/og-image.png`

const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/kaedeproject/',
  'https://www.instagram.com/kaedeproject_/',
  'https://www.behance.net/KaedeProjectCol',
]

export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value)
}

export function pageUrl(lang: Language) {
  return `${SITE_URL}/${lang}`
}

/** Head tags for one language version of the page: meta, canonical, hreflang and structured data. */
export function buildHead(lang: Language) {
  const t = translations[lang]
  const other = lang === 'en' ? 'es' : 'en'
  const url = pageUrl(lang)

  return {
    meta: [
      { title: t.seo.title },
      { name: 'description', content: t.seo.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Kaede Project' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: t.seo.title },
      { property: 'og:description', content: t.seo.description },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: LOCALES[lang] },
      { property: 'og:locale:alternate', content: LOCALES[other] },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: t.seo.title },
      { name: 'twitter:description', content: t.seo.description },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [
      { rel: 'canonical', href: url },
      ...LANGUAGES.map((code) => ({ rel: 'alternate', hrefLang: code, href: pageUrl(code) })),
      { rel: 'alternate', hrefLang: 'x-default', href: `${SITE_URL}/` },
    ],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(buildSchema(lang)) }],
  }
}

function buildSchema(lang: Language) {
  const t = translations[lang]
  const url = pageUrl(lang)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Kaede Project',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon-white.svg`,
        description: t.seo.description,
        sameAs: SOCIAL_PROFILES,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Kaede Project',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: LANGUAGES,
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: t.seo.title,
        description: t.seo.description,
        inLanguage: lang,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      ...t.services.map((service) => ({
        '@type': 'Service',
        name: service.title,
        description: service.headline,
        serviceType: service.title,
        provider: { '@id': `${SITE_URL}/#organization` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: service.title,
          itemListElement: service.items.map((item) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: item },
          })),
        },
      })),
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: lang,
        mainEntity: t.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  }
}
