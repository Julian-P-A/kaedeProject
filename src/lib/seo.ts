import { translations, type Language } from '#/data/translations'
import { CONTACT_PHONE, WHATSAPP_URL } from '#/lib/contact'
import { PLAN_PRICES } from '#/data/pricing'
import { LANGUAGES } from '#/lib/language'
export { DEFAULT_LANGUAGE, LANGUAGES, isLanguage } from '#/lib/language'

export const SITE_URL = 'https://www.kaedeproject.com'

const LOCALES: Record<Language, string> = { en: 'en_US', es: 'es_CO' }
const ogImage = (lang: Language) => `${SITE_URL}/og-image-${lang}.png`

const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/kaedeproject/',
  'https://www.instagram.com/kaedeproject_/',
  'https://www.behance.net/KaedeProjectCol',
]

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
      { property: 'og:image', content: ogImage(lang) },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:alt', content: t.seo.title },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: LOCALES[lang] },
      { property: 'og:locale:alternate', content: LOCALES[other] },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: t.seo.title },
      { name: 'twitter:description', content: t.seo.description },
      { name: 'twitter:image', content: ogImage(lang) },
      { name: 'twitter:image:alt', content: t.seo.title },
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
        logo: `${SITE_URL}/logo.png`,
        image: ogImage(lang),
        description: t.seo.description,
        telephone: CONTACT_PHONE,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: CONTACT_PHONE,
          url: WHATSAPP_URL,
          availableLanguage: ['English', 'Spanish'],
        },
        sameAs: SOCIAL_PROFILES,
        hasOfferCatalog: { '@id': `${url}#web-plans` },
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
      // Fixed-price web plans as Offers; quote-only options are left out.
      {
        '@type': 'OfferCatalog',
        '@id': `${url}#web-plans`,
        name: t.webDev.tag.replace(/^\(\s*\d+\s*\)\s*/, ''),
        itemListElement: t.webDev.options.flatMap((option) => {
          const price = PLAN_PRICES[lang][option.id]
          if (!price) return []
          return [
            {
              '@type': 'Offer',
              name: option.name,
              description: option.description,
              price: price.amount,
              priceCurrency: price.currency,
              url: `${url}#pricing`,
              seller: { '@id': `${SITE_URL}/#organization` },
              itemOffered: {
                '@type': 'Service',
                name: option.name,
                description: option.description,
                provider: { '@id': `${SITE_URL}/#organization` },
              },
            },
          ]
        }),
      },
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

