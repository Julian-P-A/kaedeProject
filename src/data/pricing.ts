import type { Language, WebDevOptionId } from './translations'

type Price = { amount: number; currency: 'USD' | 'COP' }

export const PLAN_PRICES = {
  en: {
    landing: { amount: 300, currency: 'USD' },
    corporate: { amount: 450, currency: 'USD' },
    ecommerce: { amount: 600, currency: 'USD' },
    custom: null,
  },
  es: {
    landing: { amount: 900000, currency: 'COP' },
    corporate: { amount: 1400000, currency: 'COP' },
    ecommerce: { amount: 1900000, currency: 'COP' },
    custom: null,
  },
} satisfies Record<Language, Record<WebDevOptionId, Price | null>>

/** Preserve the published price labels; these are separate market prices, not conversions. */
export function formatPlanPrice(lang: Language, id: Exclude<WebDevOptionId, 'custom'>): string {
  const price = PLAN_PRICES[lang][id]
  const amount =
    price.currency === 'COP'
      ? price.amount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          .replace(/\.(?=\d{3}\.\d{3}$)/, "'")
      : price.amount.toString()
  return `${amount} ${price.currency}`
}
