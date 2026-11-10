import { test, expect } from '@playwright/test'

for (const width of [1440, 390]) {
  test(`prices cover the final service, pause when they fit and leave without growth or blur: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
    await page.evaluate(() => document.fonts.ready)
    const pricing = page.locator('#pricing')
    const solutions = page.locator('#solutions')
    await expect(pricing).toHaveAttribute('data-pinned', String(width === 1440))
    const geometry = await pricing.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: innerHeight }))
    const move = async (position: number) => {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.height * position)
    }
    const state = () => pricing.locator('.pricing-frame').evaluate(el => {
      const css = getComputedStyle(el)
      return { scale: new DOMMatrixReadOnly(css.transform).a, blur: Number(/blur\(([\d.]+)px\)/.exec(css.filter)?.[1] || 0) }
    })

    await move(-0.7)
    await expect(solutions).toHaveAttribute('data-active-service', '4')
    expect((await solutions.locator('.solutions-scene').boundingBox())!.y).toBeCloseTo(0, 0)
    await expect.poll(() => page.evaluate(() => {
      const pricing = document.querySelector('#pricing')!
      return pricing.contains(document.elementFromPoint(innerWidth / 2, innerHeight * 0.9))
    })).toBe(true)
    await move(-0.3)
    expect((await solutions.locator('.solutions-scene').boundingBox())!.y).toBeCloseTo(0, 0)
    await expect(solutions).toHaveAttribute('data-active-service', '4')

    await move(0.1)
    const heading = (await pricing.getByRole('heading', { level: 2 }).boundingBox())!
    expect(heading.x + heading.width / 2).toBeCloseTo(width / 2, 0)
    if (width === 1440) {
      await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
      expect((await pricing.locator('.pricing-scene').boundingBox())!.y).toBeCloseTo(0, 0)
      for (const link of await pricing.getByRole('link').all()) await expect(link).toBeInViewport()
      await expect(pricing.getByRole('button')).toBeInViewport()
      await move(0.3)
      expect((await pricing.locator('.pricing-scene').boundingBox())!.y).toBeCloseTo(0, 0)
      expect((await state()).scale).toBeCloseTo(1, 2)
      await move(0.9)
      await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
      expect((await state()).scale).toBeCloseTo(1, 2)
      await move(0.2)
      await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    } else {
      for (const link of await pricing.getByRole('link').all()) {
        await link.scrollIntoViewIfNeeded()
        await expect(link).toBeInViewport()
      }
    }

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(pricing).toHaveAttribute('data-pinned', 'false')
    await expect(pricing).toHaveCSS('margin-top', '0px')
    await expect(pricing.locator('.pricing-frame')).toHaveCSS('filter', 'none')
    await expect(pricing.locator('.pricing-frame')).toHaveCSS('transform', 'none')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  })
}

test('short phones keep the final service fixed beneath incoming prices', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/es')
  await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
  const pricing = page.locator('#pricing')
  const solutions = page.locator('#solutions')
  await expect(solutions).toHaveClass(/solutions-scroll/)
  await expect(pricing).toHaveCSS('margin-top', '-667px')
  await expect(pricing).toHaveAttribute('data-pinned', 'false')
  await expect(pricing.locator('.pricing-scene')).toHaveCSS('position', 'relative')
  await expect(pricing.getByRole('heading', { level: 3 })).toHaveCount(4)
  const top = await pricing.evaluate(el => el.getBoundingClientRect().top + scrollY)
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top - 667 * 0.7)
  await expect(solutions).toHaveAttribute('data-active-service', '4')
  const lastVideo = solutions.locator('[data-artwork="3"] video')
  await expect.poll(() => lastVideo.evaluate((el: HTMLVideoElement) => el.duration - el.currentTime)).toBeLessThan(0.04)
  await expect(lastVideo).toHaveJSProperty('seeking', false)
  const lastTime = await lastVideo.evaluate((el: HTMLVideoElement) => el.currentTime)
  expect((await solutions.locator('.solutions-scene').boundingBox())!.y).toBeCloseTo(0, 0)
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top - 667 * 0.3)
  expect((await solutions.locator('.solutions-scene').boundingBox())!.y).toBeCloseTo(0, 0)
  expect(await lastVideo.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeCloseTo(lastTime, 2)
  await expect.poll(() => page.evaluate(() => document.querySelector('#pricing')!.contains(document.elementFromPoint(innerWidth / 2, innerHeight * 0.9)))).toBe(true)
  await pricing.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }))
  await expect(pricing.locator('.pricing-frame')).toHaveCSS('filter', 'blur(0px)')
  expect((await pricing.getByRole('heading', { level: 2 }).boundingBox())!.y).toBeGreaterThanOrEqual(80)
  for (const link of await pricing.getByRole('link').all()) {
    await link.scrollIntoViewIfNeeded()
    await expect(link).toBeInViewport()
  }
})
