import { test, expect } from '@playwright/test'

for (const [width, height] of [[320, 568], [375, 667], [390, 844], [768, 1024], [844, 390]]) {
  test(`first three sections keep ASCII separate and content reachable: ${width}x${height}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
    await page.evaluate(() => document.fonts.ready)

    const hero = page.locator('main > section').first()
    await expect.poll(() => hero.locator('video').evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(2)
    await expect(hero.locator('.hero-scene')).toHaveCSS('filter', 'blur(0px)')
    const illustration = (await hero.locator('.hero-art').boundingBox())!
    const heroCopy = (await hero.locator('.hero-copy').boundingBox())!
    expect(heroCopy.y).toBeGreaterThanOrEqual(80)
    expect(heroCopy.y + heroCopy.height).toBeLessThanOrEqual(illustration.y)

    const about = page.locator('#about')
    await about.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.getBoundingClientRect().height - innerHeight) / 2, behavior: 'instant' }))
    await expect(about.locator('.about-frame')).toHaveCSS('filter', 'blur(0px)')
    await expect(about.locator('canvas')).toHaveCount(0)
    expect(await about.locator('h2').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(width < 640 ? 24 : 32)

    const solutions = page.locator('#solutions')
    await expect(solutions).toHaveClass(/solutions-scroll/)
      const geometry = await solutions.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, range: 5 * el.querySelector<HTMLElement>('.solutions-scene')!.offsetHeight - innerHeight }))
      for (let index = 0; index < 4; index++) {
        await page.evaluate(({ top, range, index }) => scrollTo({ top: top + range * ((index + 0.5) / 4), behavior: 'instant' }), { ...geometry, index })
        await expect(solutions).toHaveAttribute('data-active-service', String(index + 1))
        await expect(solutions.locator('.solutions-frame')).toHaveCSS('filter', 'blur(0px)')
        await expect(solutions.locator('.solutions-frame')).toHaveCSS('transform', 'none')
        const panel = solutions.locator('article:not([inert])')
        await expect(panel).toHaveCSS('transform', 'none')
        const art = (await solutions.locator('.solutions-art').boundingBox())!
        const copy = (await panel.boundingBox())!
        expect(art.y).toBeGreaterThanOrEqual(79)
        const overlapX = Math.min(art.x + art.width, copy.x + copy.width) - Math.max(art.x, copy.x)
        const overlapY = Math.min(art.y + art.height, copy.y + copy.height) - Math.max(art.y, copy.y)
        expect(overlapX <= 0 || overlapY <= 0).toBe(true)
        expect((await solutions.locator('.solutions-scene').boundingBox())!.y).toBeCloseTo(0, 0)
        const controls = (await page.getByRole('button', { name: 'Open menu', exact: true }).boundingBox())!
        expect(copy.y + copy.height).toBeLessThanOrEqual(controls.y - 4)
        await expect(panel.getByRole('link')).toBeInViewport()
        const tags = panel.locator('.solution-details')
        expect(await tags.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1)
      }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    expect(errors).toEqual([])
  })
}

test('footer navigation is hidden on mobile and retained on desktop', async ({ page }) => {
  await page.goto('/es')
  const navigation = page.locator('footer nav')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(navigation).toBeHidden()
  await expect(page.locator('footer #contact')).toBeVisible()
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(navigation).toBeVisible()
  await expect(navigation.getByRole('link')).toHaveCount(5)
})
