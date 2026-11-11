import { test, expect } from '@playwright/test'

for (const lang of ['es', 'en']) {
  test(`FAQ intro stays fixed while questions and expanded answers scroll: ${lang}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
    await page.goto(`/${lang}`)
    await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
    await page.evaluate(() => document.fonts.ready)
    const faq = page.locator('#faq')
    const intro = faq.locator('.faq-intro')
    const list = faq.locator('.faq-list')
    const questions = list.getByRole('button')
    await expect(questions).toHaveCount(15)
    await faq.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }))
    const book = intro.locator('.faq-book')
    await expect.poll(() => book.locator('.ascii-poster').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
    await expect(book.locator('canvas')).toHaveCount(0)
    await expect.poll(() => book.locator('video').evaluate(video => (video as HTMLVideoElement).paused)).toBe(true)
    const before = (await intro.boundingBox())!
    const listBefore = (await list.boundingBox())!
    expect(before.x + before.width).toBeLessThan(listBefore.x)
    expect(before.width).toBeGreaterThan(listBefore.width)

    await questions.first().click()
    await expect(questions.first()).toHaveAttribute('aria-expanded', 'true')
    const firstAnswer = page.locator(`#${await questions.first().getAttribute('aria-controls')}`)
    await expect(firstAnswer).not.toHaveAttribute('inert')
    await expect(firstAnswer).toBeVisible()
    if (lang === 'es') await page.screenshot({ path: '/tmp/kaede-faq-desktop.png' })
    expect((await intro.boundingBox())!.y).toBeCloseTo(before.y, 0)
    await questions.nth(1).click()
    await expect(questions.first()).toHaveAttribute('aria-expanded', 'false')
    await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'true')
    await questions.nth(1).press('Enter')
    await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'false')

    // A sticky column releases at its parent's end; exercise the available
    // travel now that the illustration adds height to the intro.
    const travel = Math.min(350, Math.floor((listBefore.height - before.height) / 2))
    expect(travel).toBeGreaterThan(50)
    await page.mouse.wheel(0, travel)
    await expect.poll(async () => (await list.boundingBox())!.y).toBeLessThan(listBefore.y - travel * 0.75)
    expect((await intro.boundingBox())!.y).toBeCloseTo(before.y, 0)
    expect(await list.evaluate(el => getComputedStyle(el).overflowY)).toBe('visible')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440)
  })
}

for (const width of [320, 390, 768]) {
  test(`FAQ remains readable and opens with keyboard on narrow screens: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
    await page.evaluate(() => document.fonts.ready)
    const faq = page.locator('#faq')
    await faq.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }))
    const intro = (await faq.locator('.faq-intro').boundingBox())!
    const list = (await faq.locator('.faq-list').boundingBox())!
    expect(intro.y + intro.height).toBeLessThanOrEqual(list.y)
    await expect(faq.locator('.faq-intro')).toHaveCSS('position', 'static')
    if (width === 390) {
      await expect(faq.locator('h2 span').last()).toHaveCSS('filter', 'none')
      const video = faq.locator('.faq-book video')
      await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2)
      const time = await video.evaluate(el => (el as HTMLVideoElement).currentTime)
      await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(time + 0.1)
      await page.screenshot({ path: '/tmp/kaede-faq-mobile.png' })
    }
    const questions = faq.getByRole('button')
    await expect(questions).toHaveCount(15)
    const last = questions.last()
    await last.scrollIntoViewIfNeeded()
    if (width === 390) await expect.poll(() => faq.locator('.faq-book video').evaluate(video => (video as HTMLVideoElement).paused)).toBe(true)
    await last.focus()
    await last.press('Space')
    await expect(last).toHaveAttribute('aria-expanded', 'true')
    const answer = page.locator(`#${await last.getAttribute('aria-controls')}`)
    await expect(answer).toBeVisible()
    await last.press('Enter')
    await expect(last).toHaveAttribute('aria-expanded', 'false')
    await expect(answer).toHaveAttribute('inert')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}
