import { test, expect, type Page } from '@playwright/test'

const errors = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', (error) => messages.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat/i.test(message.text())) messages.push(message.text())
  })
  await page.route('**/gtagmetrics/**', (route) => route.fulfill({ contentType: 'application/javascript', body: '' }))
  // A test must never send a real contact request.
  await page.route('https://api.web3forms.com/**', (route) => route.abort())
})

test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([])
})

async function navigate(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
}

async function openDiagnostic(page: Page, lang: 'en' | 'es' = 'en') {
  await navigate(page, `/${lang}`)
  const trigger = page.getByRole('button', {
    name: lang === 'en' ? 'Take the quick diagnostic' : 'Hacer diagnóstico rápido',
    exact: true,
  })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  return { dialog, trigger }
}

async function fillDiagnostic(page: Page, lang: 'en' | 'es' = 'en') {
  const opened = await openDiagnostic(page, lang)
  const { dialog } = opened
  for (let index = 0; index < 7; index++) {
    await expect(
      dialog.getByText(`${lang === 'en' ? 'Question' : 'Pregunta'} ${index + 1} / 7`, { exact: true }),
    ).toBeVisible()
    await dialog.locator('button[aria-pressed]').first().click()
    await dialog.getByRole('button', { name: lang === 'en' ? 'Next' : 'Siguiente', exact: true }).click()
  }
  await dialog
    .getByRole('textbox', { name: lang === 'en' ? 'Email' : 'Correo electrónico', exact: true })
    .fill('test@example.com')
  await dialog
    .getByRole('textbox', { name: lang === 'en' ? 'Phone number' : 'Número telefónico', exact: true })
    .fill('+57 300 000 0000')
  return opened
}

test('pending delivery shows the diagnosis, rejects false success and retries once with the same data', async ({
  page,
}) => {
  let release!: () => void
  const pending = new Promise<void>((resolve) => {
    release = resolve
  })
  const payloads: Record<string, unknown>[] = []
  await page.route('https://api.web3forms.com/submit', async (route) => {
    payloads.push(route.request().postDataJSON())
    if (payloads.length === 1) {
      await pending
      await route.fulfill({ status: 200, json: { success: false } })
    } else {
      await route.fulfill({ status: 200, json: { success: true } })
    }
  })
  const { dialog } = await fillDiagnostic(page)
  await dialog.getByRole('button', { name: 'See my diagnosis', exact: true }).evaluate((button) => {
    if (button instanceof HTMLButtonElement) {
      button.click()
      button.click()
    }
  })
  await expect(dialog.getByRole('status')).toContainText('Sending your contact details')
  await expect(dialog.getByText('Robust Ecosystem / E-commerce', { exact: true })).toBeVisible()
  await expect.poll(() => payloads.length).toBe(1)
  release()
  await expect(dialog.getByRole('status')).toContainText('could not confirm receipt')
  await dialog.getByRole('button', { name: 'Retry sending' }).click()
  await expect(dialog.getByRole('status')).toContainText('We received your details')
  expect(payloads).toHaveLength(2)
  expect(payloads[0]).toEqual(payloads[1])
  expect(payloads[1].email).toBe('test@example.com')
  expect(payloads[1].question_7).toBeTruthy()
})

test('an old delivery cannot update a reopened diagnosis', async ({ page }) => {
  let release!: () => void
  const pending = new Promise<void>((resolve) => {
    release = resolve
  })
  let fulfilled!: () => void
  const finished = new Promise<void>((resolve) => {
    fulfilled = resolve
  })
  await page.route('https://api.web3forms.com/submit', async (route) => {
    await pending
    await route.fulfill({ json: { success: true } })
    fulfilled()
  })
  const { dialog, trigger } = await fillDiagnostic(page)
  await dialog.getByRole('button', { name: 'See my diagnosis', exact: true }).click()
  await expect(dialog.getByRole('status')).toContainText('Sending')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await trigger.click()
  release()
  await finished
  await expect(page.getByRole('dialog').getByText('Question 1 / 7', { exact: true })).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0)
})

test('dialog contains focus, blocks the background, preserves the cursor and restores both invokers', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const { dialog, trigger } = await openDiagnostic(page)
  await expect(dialog).toHaveAttribute('aria-modal', 'true')
  await expect(dialog).toHaveAccessibleName('Quick diagnosis')
  for (let index = 0; index < 20; index++) {
    await page.keyboard.press(index < 10 ? 'Tab' : 'Shift+Tab')
    await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await expect(page.getByRole('main')).toHaveCount(0)
  const bounds = await dialog.boundingBox()
  await page.mouse.move(bounds!.x + 50, bounds!.y + 80)
  await expect(page.locator('.brand-cursor')).toHaveCSS('opacity', '1')
  await expect(page.locator('.brand-cursor-shape')).toHaveCSS('height', '26px')
  await page.screenshot({ path: '/private/tmp/kaede-diagnostic-desktop.png' })
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(page.getByRole('main')).toHaveCount(1)
  const secondTrigger = page.locator('#contact').getByRole('button')
  await secondTrigger.click()
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Close', exact: true }).first().click()
  await expect(dialog).toHaveCount(0)
  await expect(secondTrigger).toBeFocused()
  await trigger.click()
  await page.mouse.click(10, 10)
  await expect(dialog).toHaveCount(0)
})

test('Spanish diagnostic reports network failure without claiming receipt', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const { dialog } = await fillDiagnostic(page, 'es')
  await dialog.getByRole('button', { name: 'Ver mi diagnóstico', exact: true }).click()
  await expect(dialog.getByRole('status')).toContainText('no pudimos confirmar')
  await expect(dialog.getByRole('button', { name: 'Reintentar envío' })).toBeVisible()
  await page.screenshot({ path: '/private/tmp/kaede-diagnostic-mobile.png' })
})

test('mobile menu closes at the CSS breakpoint and restores the previous scroll style', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 800 })
  await navigate(page, '/en')
  await page.evaluate(() => {
    document.body.style.overflow = 'auto'
  })
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
  // rem media queries use the browser initial font, independently of html's font size.
  await page.setViewportSize({ width: 1023, height: 800 })
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
  await page.setViewportSize({ width: 1024, height: 800 })
  await expect(page.locator('body')).toHaveCSS('overflow', 'auto')
  await page.setViewportSize({ width: 800, height: 800 })
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveCount(0)
})

test('explicit URLs override the browser language and root negotiates priority', async ({ page, request }) => {
  for (const [header, path] of [
    ['es;q=0,en;q=1', '/en'],
    ['en;q=0.2,es;q=0.9', '/es'],
  ]) {
    const response = await request.get('/', { headers: { 'Accept-Language': header }, maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(response.headers().location).toBe(path)
  }
  // The browser context prefers en-US; the explicit Spanish URL must still win.
  await navigate(page, '/es')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await page.reload()
  await expect(page).toHaveURL(/\/es$/)
  await navigate(page, '/en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('scroll advances each process stage with normal motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await navigate(page, '/es')
  for (let index = 0; index < 6; index++) {
    await page.evaluate((stage) => {
      const bounds = document.querySelector('#process')!.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + bounds.top + (bounds.height - window.innerHeight) * ((stage + 0.3) / 6),
        behavior: 'instant',
      })
    }, index)
    await expect(page.locator('#process ol button').nth(index)).toHaveAttribute('aria-current', 'step')
  }
})

test('all process IDs select the matching diagram and structured prices match visible labels', async ({ page }) => {
  for (const lang of ['en', 'es']) {
    await navigate(page, `/${lang}`)
    const buttons = page.locator('#process ol button')
    const ids = ['brief', 'scope', 'design', 'build', 'connect', 'launch']
    for (let index = 0; index < ids.length; index++) {
      await buttons.nth(index).click()
      await expect(buttons.nth(index)).toHaveAttribute('aria-current', 'step')
      await expect(page.locator('#process figure')).toContainText(`kaede.${ids[index]}`)
      await expect(page.locator('#process svg[role="img"]')).toHaveCount(1)
    }
    const catalog = await page.locator('script[type="application/ld+json"]').evaluateAll((elements) => {
      const graphs = elements.flatMap((element) => JSON.parse(element.textContent ?? '{}')['@graph'] ?? [])
      return graphs.find((item) => item['@type'] === 'OfferCatalog').itemListElement
    })
    expect(catalog.map((offer: { price: number }) => offer.price)).toEqual(
      lang === 'en' ? [300, 450, 600] : [900000, 1400000, 1900000],
    )
    expect(
      catalog.every((offer: { priceCurrency: string }) => offer.priceCurrency === (lang === 'en' ? 'USD' : 'COP')),
    ).toBe(true)
    const prices = page.locator('#pricing .text-accent').filter({ hasText: /USD|COP/ })
    await expect(prices).toHaveText(
      lang === 'en' ? ['300 USD', '450 USD', '600 USD'] : ['900.000 COP', "1'400.000 COP", "1'900.000 COP"],
    )
  }
})
