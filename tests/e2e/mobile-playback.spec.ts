import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'no-preference' })

const heroVideo = '.hero-art video'
const heroArt = '.hero-art .ascii-media'

test('a touch retries blocked native playback, which pauses offscreen and resumes', async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play
    let unlocked = false
    document.addEventListener('touchstart', () => { unlocked = true }, { capture: true, once: true })
    HTMLMediaElement.prototype.play = function () {
      return unlocked ? play.call(this) : Promise.reject(new DOMException('User interaction required', 'NotAllowedError'))
    }
  })
  await page.goto('/es')
  await page.locator(heroArt).scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', true)
  await page.touchscreen.tap(190, 400)
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', false)
  await expect(page.locator(heroVideo)).toHaveJSProperty('defaultMuted', true)
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentSrc)).toMatch(/rendered\/creation-mobile\.mp4$/)
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
  const bounds = (await page.locator(heroVideo).boundingBox())!
  const viewport = page.viewportSize()!
  // The artwork is wider than the phone. Capture its visible area with a
  // nonnegative clip; Chromium misclips element screenshots starting offscreen.
  const clip = {
    x: Math.max(0, bounds.x), y: Math.max(0, bounds.y),
    width: Math.min(viewport.width, bounds.x + bounds.width) - Math.max(0, bounds.x),
    height: Math.min(viewport.height, bounds.y + bounds.height) - Math.max(0, bounds.y),
  }
  const frame = await page.screenshot({ clip })
  await expect.poll(async () => (await page.screenshot({ clip })).equals(frame)).toBe(false)
  await page.locator('#faq .ascii-media').scrollIntoViewIfNeeded()
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', true)
  const pausedTime = await page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)
  await page.locator(heroArt).scrollIntoViewIfNeeded()
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', false)
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)).not.toBe(pausedTime)
})

test('every ASCII scene works with canvas APIs disabled', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() => { throw new Error('Live canvas rendering is forbidden') }) as typeof HTMLCanvasElement.prototype.getContext
  })
  await page.goto('/es')
  await page.locator(heroArt).scrollIntoViewIfNeeded()
  await expect(page.locator(heroArt)).toHaveAttribute('data-ready', 'true')
  const section = page.locator('#solutions')
  const geometry = await section.evaluate(el => ({
    top: el.getBoundingClientRect().top + scrollY,
    range: 5 * el.querySelector<HTMLElement>('.solutions-scene')!.offsetHeight - innerHeight,
  }))
  for (let index = 0; index < 4; index++) {
    await page.evaluate(({ top, range, index }) => scrollTo({ top: top + range * (index + 0.5) / 4, behavior: 'instant' }), { ...geometry, index })
    await expect(section).toHaveAttribute('data-active-service', String(index + 1))
    await expect(section.locator('[data-artwork="' + index + '"] .ascii-media')).toHaveAttribute('data-ready', 'true')
  }
  const photo = page.locator('#process .ascii-photo-render').first()
  await photo.scrollIntoViewIfNeeded()
  await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  await page.locator('#faq .ascii-media').scrollIntoViewIfNeeded()
  await expect(page.locator('#faq .ascii-media')).toHaveAttribute('data-ready', 'true')
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(page.locator('footer .ascii-media')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('native video remains visible through in-flight scroll seeks', async ({ page }) => {
  await page.goto('/es')
  const section = page.locator('#solutions')
  const top = await section.evaluate(el => el.getBoundingClientRect().top + scrollY)
  const art = section.locator('[data-artwork="0"] .ascii-media')
  const video = art.locator('video')
  await page.evaluate(top => scrollTo({ top: top + 400, behavior: 'instant' }), top)
  await expect(art).toHaveAttribute('data-ready', 'true')
  for (const offset of [500, 600, 700, 500, 400]) {
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top + offset)
    await expect(video).toHaveCSS('opacity', '1')
  }
  await expect(video).toHaveJSProperty('seeking', false)
  await expect(video).toHaveJSProperty('paused', true)
})

test('reduced motion uses exported posters without downloading videos', async ({ page }) => {
  const videos: string[] = []
  page.on('request', request => { if (/\/ascii\/.*\.mp4/.test(request.url())) videos.push(request.url()) })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/es')
  await page.locator(heroArt).scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator(heroArt + ' img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.touchscreen.tap(190, 400)
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', true)
  await page.locator('#faq .ascii-media').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('#faq .ascii-poster').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  expect(videos).toEqual([])
})
