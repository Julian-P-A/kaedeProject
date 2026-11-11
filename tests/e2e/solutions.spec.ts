import { test, expect } from '@playwright/test'

const names = {
  es: ['Desarrollo web', 'Inteligencia artificial', 'Automatización', 'CRM e Integraciones'],
  en: ['Web Development', 'Artificial Intelligence', 'Automation', 'CRM & Integrations'],
}

for (const lang of ['es', 'en'] as const) {
  for (const width of [1440, 390]) {
    test(`services follow native scrolling in both directions: ${lang}, ${width}px`, async ({ page, browserName }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
      await page.goto(`/${lang}`)
      await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
      const section = page.locator('#solutions')
      const top = await section.evaluate(el => el.getBoundingClientRect().top + scrollY)
      await page.evaluate(top => scrollTo({ top: top + 100, behavior: 'instant' }), top)
      const scroll = async (amount: number) => {
        // Playwright cannot send mouse-wheel input to mobile WebKit.
        if (browserName === 'webkit') await page.evaluate(top => scrollBy({ top, behavior: 'instant' }), amount)
        else await page.mouse.wheel(0, amount)
      }

      for (let index = 0; index < 4; index++) {
        if (index) await scroll(900)
        await expect(section).toHaveAttribute('data-active-service', String(index + 1))
        const heading = section.getByRole('heading', { level: 3 })
        await expect(heading).toHaveCount(1)
        await expect(heading).toHaveText(new RegExp(names[lang][index].split(' ').join('\\s*')))
        const panel = section.locator('article:not([inert])')
        await expect(panel.getByRole('link')).toHaveAttribute('href', /^https:\/\/wa\.me\/573151883229\?text=/)
        await expect(panel.getByRole('link')).toBeInViewport()
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
        expect((await section.locator('.solutions-scene').boundingBox())!.y).toBeCloseTo(0, 0)
      }

      await scroll(-900)
      await expect(section).toHaveAttribute('data-active-service', '3')
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top - 900)
      await expect(section.locator('.solutions-scene')).not.toBeInViewport()
      expect(errors).toEqual([])
    })
  }
}

test('reduced motion keeps every service readable without a pinned scroll interval', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
  await page.goto('/es')
  await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
  const section = page.locator('#solutions')
  await expect(section).toHaveClass(/solutions-static/)
  await expect(section.getByRole('heading', { level: 3 })).toHaveCount(4)
  await expect(section.locator('article[inert]')).toHaveCount(0)
  await expect(section.locator('.solutions-scene')).toHaveCSS('position', 'relative')
  await expect(section.getByRole('link')).toHaveCount(4)
})

for (const width of [1440, 390]) {
  test(`ASCII follows scroll, holds still and reverses, with glyph transitions: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
    const section = page.locator('#solutions')
    const top = await section.evaluate(el => el.getBoundingClientRect().top + scrollY)
    const layer = section.locator('[data-artwork="0"]')
    const video = layer.locator('video')
    const canvas = layer.locator('canvas')
    const seekTo = async (offset: number) => {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top + offset)
      await expect.poll(async () => {
        const before = await video.evaluate((el: HTMLVideoElement) => el.currentTime)
        const opacity = Number(await layer.evaluate(el => getComputedStyle(el).opacity))
        await page.waitForTimeout(120)
        const after = await video.evaluate((el: HTMLVideoElement) => ({ time: el.currentTime, seeking: el.seeking }))
        const nextOpacity = Number(await layer.evaluate(el => getComputedStyle(el).opacity))
        return Math.abs(after.time - before) < 0.001 && Math.abs(opacity - nextOpacity) < 0.000001 && !after.seeking
      }).toBe(true)
    }

    await seekTo(225)
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(1)
    await expect(video).toHaveJSProperty('paused', true)
    await expect(video).toHaveJSProperty('seeking', false)
    const firstTime = await video.evaluate((el: HTMLVideoElement) => el.currentTime)
    const firstFrame = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())
    await page.waitForTimeout(300)
    expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBe(firstTime)
    expect(await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(firstFrame)

    await seekTo(540)
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(firstTime + 1)
    await seekTo(225)
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeCloseTo(firstTime, 1)
    await expect.poll(() => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(firstFrame)

    // The clip has finished here. Changing its pixel positions after this point
    // proves the transition moves glyphs rather than just fading the element.
    await seekTo(744)
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime / el.duration)).toBeGreaterThan(0.98)
    await expect(video).toHaveJSProperty('seeking', false)
    const endTime = await video.evaluate((el: HTMLVideoElement) => el.currentTime)
    const closed = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())
    await seekTo(882)
    await expect.poll(() => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).not.toBe(closed)
    expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeCloseTo(endTime, 2)
    await expect(layer).not.toHaveCSS('opacity', '0')
    await expect(section.locator('[data-artwork="1"]')).not.toHaveCSS('opacity', '0')
    await seekTo(744)
    await expect.poll(() => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(closed)

    await seekTo(1350)
    await expect(section).toHaveAttribute('data-active-service', '2')
    const next = section.locator('[data-artwork="1"] video')
    await expect.poll(() => next.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(1)
    await expect(next).toHaveJSProperty('paused', true)
    await expect(layer).toHaveCSS('opacity', '0')

    // Large native scroll jumps must settle on the requested clip, not a queue
    // of intermediate service transitions.
    for (const offset of [3150, 450, 2250, 1350]) {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top + offset)
      await page.waitForTimeout(40)
    }
    await expect(section).toHaveAttribute('data-active-service', '2')
    await expect(next).toHaveJSProperty('seeking', false)
    await expect(next).toHaveJSProperty('paused', true)
    await expect.poll(() => next.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(1)
  })
}
