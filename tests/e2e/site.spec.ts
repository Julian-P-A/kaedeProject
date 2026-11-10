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
  await expect(dialog).toBeVisible()
  await dialog.locator('..').click({ position: { x: 10, y: 10 } })
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

test('menu opens from the lower-left on desktop and mobile, and restores scrolling and focus', async ({ page }) => {
  for (const width of [1920, 1440, 390, 320]) {
    await page.setViewportSize({ width, height: 800 })
    await navigate(page, '/en')
    await page.evaluate(() => {
      document.body.style.overflow = 'auto'
    })
    const trigger = page.getByRole('button', { name: 'Open menu', exact: true })
    await expect(trigger).toHaveText('Menu')
    const bounds = await trigger.boundingBox()
    expect(bounds!.y).toBeGreaterThan(700)
    expect(bounds!.height).toBeGreaterThanOrEqual(44)
    const headerLogo = page.locator('header a').first()
    await expect(headerLogo.locator('..')).toHaveCSS('transform', 'none')
    const logoBefore = await headerLogo.boundingBox()
    expect(bounds!.x).toBeCloseTo(logoBefore!.x, 1)
    const languages = page.getByRole('group', { name: 'Language selector', exact: true })
    await expect(languages).toHaveCSS('border-width', '0px')
    await expect(languages).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(languages.getByRole('link', { name: 'ES', exact: true })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(languages.getByRole('link', { name: 'EN', exact: true })).toHaveCSS('background-color', 'rgb(215, 255, 92)')
    const floatingWhatsApp = page.getByRole('link', { name: 'Chat with us on WhatsApp', exact: true })
    await expect(floatingWhatsApp).toHaveText('Message us')
    expect((await floatingWhatsApp.boundingBox())!.height).toBeLessThanOrEqual(52)
    await page.screenshot({ path: `/private/tmp/kaede-menu-${width}-closed.png` })

    await trigger.click()
    const menu = page.getByRole('dialog', { name: 'Navigation menu', exact: true })
    await expect(menu).toBeVisible()
    const logoOpen = await menu.getByRole('link', { name: 'Kaede Project', exact: true }).boundingBox()
    expect(logoOpen!.x).toBeCloseTo(logoBefore!.x, 1)
    expect(logoOpen!.y).toBeCloseTo(logoBefore!.y, 1)
    expect(logoOpen!.width).toBeCloseTo(logoBefore!.width, 1)
    const navigation = menu.getByRole('navigation', { name: 'Mobile', exact: true })
    await expect(navigation.getByRole('link', { name: 'Home', exact: true })).toBeVisible()
    const email = menu.getByRole('link', { name: 'hello@kaedeproject.com', exact: true })
    await expect(email).toHaveAttribute('href', 'mailto:hello@kaedeproject.com')
    await expect(email).toBeInViewport()
    const menuWhatsApp = menu.getByRole('link', { name: 'Chat with us on WhatsApp', exact: true })
    await expect(menuWhatsApp).toBeInViewport()
    await expect(menuWhatsApp).toHaveAttribute('href', /^https:\/\/wa\.me\/573151883229/)
    const menuWhatsAppBounds = await menuWhatsApp.boundingBox()
    expect(menuWhatsAppBounds!.y + menuWhatsAppBounds!.height).toBeLessThan((await email.boundingBox())!.y)
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
    await expect(page.getByRole('main')).toHaveCount(0)
    for (let index = 0; index < 10; index++) {
      await page.keyboard.press(index < 5 ? 'Tab' : 'Shift+Tab')
      await expect.poll(() => menu.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
    await expect(menu.getByRole('link', { name: 'Contact', exact: true })).toHaveCSS('opacity', '1')
    for (const link of await navigation.getByRole('link').all()) {
      const linkBounds = await link.boundingBox()
      expect(linkBounds!.x + linkBounds!.width / 2).toBeCloseTo(width / 2, 1)
    }
    await page.screenshot({ path: `/private/tmp/kaede-menu-${width}-open.png` })

    // The same menu remains open when switching between mobile and desktop.
    await page.setViewportSize({ width: width < 1024 ? 1440 : 390, height: 800 })
    await expect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toHaveCount(0)
    await expect(page.locator('body')).toHaveCSS('overflow', 'auto')
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    await page.getByRole('button', { name: 'Close menu', exact: true }).click()
    await expect(menu).toHaveCount(0)
    await expect(trigger).toBeFocused()

    await trigger.click()
    await menu.getByRole('link', { name: 'Solutions', exact: true }).click()
    await expect(menu).toHaveCount(0)
    await expect(page).toHaveURL(/\/en#solutions$/)
    await expect(page.locator('body')).toHaveCSS('overflow', 'auto')
  }

  await navigate(page, '/es')
  await expect(page.getByRole('link', { name: 'Escríbenos por WhatsApp', exact: true })).toHaveText('Escríbenos')
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  const spanishMenu = page.getByRole('dialog', { name: 'Menú de navegación', exact: true })
  await expect(spanishMenu.getByRole('link', { name: 'Contacto', exact: true })).toHaveCSS('opacity', '1')
  await expect(spanishMenu.getByRole('link', { name: 'Escríbenos por WhatsApp', exact: true })).toBeInViewport()
  await page.screenshot({ path: '/private/tmp/kaede-menu-es-open.png' })
  await page.keyboard.press('Escape')
  await expect(spanishMenu).toHaveCount(0)
})

test('hero sharpens and shrinks on return, and blurs and grows as it leaves upward', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await navigate(page, '/es')
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    const hero = page.locator('main > section').first()
    const stage = hero.locator(':scope > div')
    const entrance = stage.locator(':scope > div')
    const state = () => stage.evaluate((element) => {
      const css = getComputedStyle(element)
      const transform = new DOMMatrixReadOnly(css.transform)
      return { blur: Number(/blur\(([\d.]+)px\)/.exec(css.filter)?.[1] || 0), scale: transform.a, y: transform.f }
    })

    await expect(entrance).toHaveCSS('filter', 'blur(0px)')
    await expect.poll(async () => (await state()).scale).toBeCloseTo(1, 2)
    await page.screenshot({ path: `/private/tmp/kaede-hero-focus-${width}.png` })
    const height = await hero.evaluate((element) => element.getBoundingClientRect().height)
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), height * 0.4)
    await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    expect((await state()).scale).toBeCloseTo(1, 2)
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), height * 0.7)
    await expect.poll(async () => (await state()).blur).toBeGreaterThan(2)
    const exit = await state()
    expect(exit.scale).toBeGreaterThan(1.01)
    expect(exit.y).toBeLessThan(0)

    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    expect((await state()).scale).toBeCloseTo(1, 2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), height * 0.4)
    await expect(stage).toHaveCSS('filter', 'none')
    await expect(stage).toHaveCSS('opacity', '1')
    expect((await state()).scale).toBeCloseTo(1, 2)
  }
})

test('second section sharpens while shrinking in, then blurs and grows as it leaves upward', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await navigate(page, '/es')
    const about = page.locator('#about')
    await expect(page.locator('main > section').nth(1)).toHaveAttribute('id', 'about')
    const geometry = await about.evaluate((element) => ({ top: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height }))
    const panel = about.locator(':scope > div')
    expect((await panel.boundingBox())!.height).toBeCloseTo(900, 0)
    const copy = about.locator('.about-frame')
    const state = () => copy.evaluate((element) => {
      const css = getComputedStyle(element)
      const transform = new DOMMatrixReadOnly(css.transform)
      return { blur: Number(/blur\(([\d.]+)px\)/.exec(css.filter)?.[1] || 0), scale: transform.a, y: transform.f }
    })

    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), geometry.top - 585)
    await expect.poll(async () => (await state()).blur).toBeGreaterThan(2)
    await expect.poll(async () => (await state()).scale).toBeGreaterThan(1.08)
    const entrance = await state()
    expect(entrance.scale).toBeGreaterThan(1.08)
    expect(entrance.y).toBeGreaterThan(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)

    // It is already sharp on arrival and stays fixed through a short reading pause.
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), geometry.top - 180)
    await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), geometry.top + 72)
    await expect.poll(async () => (await panel.boundingBox())!.y).toBeCloseTo(0, 0)
    const pinned = await copy.boundingBox()
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), geometry.top + 288)
    await expect.poll(async () => (await copy.boundingBox())!.y).toBeCloseTo(pinned!.y, 0)
    await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    await page.screenshot({ path: `/private/tmp/kaede-about-pinned-${width}.png` })

    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), geometry.top + 540)
    await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    expect((await panel.boundingBox())!.y).toBeLessThan(0)
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), geometry.top + 900)
    await expect.poll(async () => (await state()).blur).toBeGreaterThan(2)
    const exit = await state()
    expect(exit.scale).toBeGreaterThan(1.08)
    expect(exit.y).toBeLessThan(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(copy).toHaveCSS('filter', 'none')
    await expect(copy).toHaveCSS('opacity', '1')
    await expect.poll(async () => (await about.boundingBox())!.height).toBeCloseTo(900, 0)
  }
})

test('mobile footer keeps the legal copy closer to its bounded fire', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await navigate(page, '/es')
    const footer = page.locator('footer')
    await footer.evaluate((element) => element.scrollIntoView({ block: 'end', behavior: 'instant' }))
    const geometry = await footer.evaluate((element) => {
      const paragraphs = element.querySelectorAll('p')
      const last = paragraphs[paragraphs.length - 1]
      return {
        gap: element.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom,
        fireHeight: element.querySelector('canvas')!.getBoundingClientRect().height,
        height: element.getBoundingClientRect().height,
      }
    })
    expect(geometry.fireHeight).toBe(180)
    expect(geometry.gap).toBeGreaterThan(140)
    if (width === 390) {
      expect(geometry.gap).toBeLessThan(160)
      await page.screenshot({ path: '/private/tmp/kaede-footer-closer-mobile.png' })
    } else {
      expect(geometry.gap).toBeGreaterThan(170)
      expect(geometry.height).toBeCloseTo(900, 0)
    }
  }
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
  const count = await page.locator('#process ol button').count()
  for (let index = 0; index < count; index++) {
    await page.evaluate(({ stage, count }) => {
      const bounds = document.querySelector('#process')!.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + bounds.top + (bounds.height - window.innerHeight) * ((stage + 0.3) / count),
        behavior: 'instant',
      })
    }, { stage: index, count })
    await expect(page.locator('#process ol button').nth(index)).toHaveAttribute('aria-current', 'step')
  }
})

test('all process IDs select the matching photo and structured prices match visible labels', async ({ page }) => {
  for (const lang of ['en', 'es']) {
    await navigate(page, `/${lang}`)
    const buttons = page.locator('#process ol button')
    const ids = ['brief', 'scope', 'design', 'build', 'launch']
    for (let index = 0; index < ids.length; index++) {
      await buttons.nth(index).click()
      await expect(buttons.nth(index)).toHaveAttribute('aria-current', 'step')
      await expect(page.locator('#process .process-layout')).toHaveAttribute('data-stage', ids[index])
      await expect(buttons.nth(index).locator('.process-stage-label')).toHaveText((await buttons.nth(index).getAttribute('aria-label'))!.replace(/^\d+\. /, ''))
      await expect.poll(() => page.locator(`#process [data-photo-stage="${ids[index]}"] img`).evaluate(image => (image as HTMLImageElement).naturalWidth > 0)).toBe(true)
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
