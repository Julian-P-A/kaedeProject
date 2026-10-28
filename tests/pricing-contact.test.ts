import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatPlanPrice, PLAN_PRICES } from '../src/data/pricing.ts'
import { WHATSAPP_URL, whatsappUrl } from '../src/lib/contact.ts'

test('published prices and custom quotes retain their values and labels', () => {
  const ids = ['landing', 'corporate', 'ecommerce'] as const
  assert.deepEqual(
    ids.map((id) => formatPlanPrice('en', id)),
    ['300 USD', '450 USD', '600 USD'],
  )
  assert.deepEqual(
    ids.map((id) => formatPlanPrice('es', id)),
    ['900.000 COP', "1'400.000 COP", "1'900.000 COP"],
  )
  assert.equal(PLAN_PRICES.en.custom, null)
  assert.equal(PLAN_PRICES.es.custom, null)
})

test('WhatsApp encodes translated messages once, including reserved characters', () => {
  for (const message of ['Hola. ¿Cómo podemos empezar?', 'Hello. Can we start?', 'IA & CRM + web = 100% #equipo']) {
    const url = new URL(whatsappUrl(message))
    assert.equal(url.origin + url.pathname, WHATSAPP_URL)
    assert.equal(url.searchParams.get('text'), message)
    assert.equal([...url.searchParams].length, 1)
  }
})
