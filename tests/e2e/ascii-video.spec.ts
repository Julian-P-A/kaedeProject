import { test, expect } from '@playwright/test'

test('only the exported hero video loads initially; other clips load near their sections', async ({ page }) => {
  const clips = new Set<string>()
  page.on('request', request => {
    if (/\/ascii\/.*\.mp4(?:\?|$)/.test(request.url())) clips.add(new URL(request.url()).pathname)
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/es')
  await expect.poll(() => page.locator('.hero-art video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips]).toEqual(['/ascii/rendered/creation.mp4'])
  await page.locator('#solutions').evaluate(section => scrollTo({ top: section.getBoundingClientRect().top + scrollY, behavior: 'instant' }))
  await expect.poll(() => page.locator('#solutions [data-artwork="0"] video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips].some(path => /faq-book|automation-gears|crm-hands/.test(path))).toBe(false)
  await page.locator('#faq .ascii-media').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('#faq video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips].every(path => path.startsWith('/ascii/rendered/'))).toBe(true)
  await expect(page.locator('canvas')).toHaveCount(0)
})

for (const playbackAvailable of [true, false]) {
  test('mobile exported ASCII remains visible when video playback is ' + (playbackAvailable ? 'available' : 'unavailable'), async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    if (!playbackAvailable) await page.route(/\/ascii\/.*\.mp4(?:\?.*)?$/, route => route.abort())
    await page.goto('/es')
    await page.evaluate(() => document.fonts.ready)
    const expectArtwork = async (selector: string) => {
      const art = page.locator(selector)
      await expect.poll(() => art.locator('.ascii-poster').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
      await expect(art).toBeInViewport()
      if (playbackAvailable) await expect(art).toHaveAttribute('data-ready', 'true')
    }
    await page.locator('.hero-art .ascii-media').scrollIntoViewIfNeeded()
    await expectArtwork('.hero-art .ascii-media')
    const copy = (await page.locator('.hero-copy').boundingBox())!
    const artwork = (await page.locator('.hero-art .ascii-media').boundingBox())!
    expect(artwork.y - copy.y - copy.height).toBeGreaterThanOrEqual(24)
    if (playbackAvailable) {
      const video = page.locator('.hero-art video')
      await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
      await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentSrc)).toMatch(/rendered\/creation-mobile\.mp4$/)
    }
    const solutions = page.locator('#solutions')
    const geometry = await solutions.evaluate(section => ({
      top: section.getBoundingClientRect().top + scrollY,
      range: 5 * section.querySelector<HTMLElement>('.solutions-scene')!.offsetHeight - innerHeight,
    }))
    for (let index = 0; index < 4; index++) {
      await page.evaluate(({ top, range, index }) => scrollTo({ top: top + range * (index + 0.3) / 4, behavior: 'instant' }), { ...geometry, index })
      await expect(solutions).toHaveAttribute('data-active-service', String(index + 1))
      await expectArtwork('#solutions [data-artwork="' + index + '"] .ascii-media')
      if (playbackAvailable) {
        const video = solutions.locator('[data-artwork="' + index + '"] video')
        await expect(video).toHaveJSProperty('seeking', false)
        await expect(video).toHaveJSProperty('paused', true)
        await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
      }
    }
    await page.locator('#faq .ascii-media').scrollIntoViewIfNeeded()
    await expectArtwork('#faq .ascii-media')
    await expect(page.locator('canvas')).toHaveCount(0)
  })
}

test('responsive exports keep their layout when resizing', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/es')
  for (const width of [1440, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    const art = page.locator('#faq .ascii-media')
    await art.scrollIntoViewIfNeeded()
    await expect.poll(() => art.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
  }
  expect(errors).toEqual([])
})
