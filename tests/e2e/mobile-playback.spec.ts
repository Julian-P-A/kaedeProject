import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'no-preference' })

const heroVideo = '.hero-art video'
const heroCanvas = '.hero-art canvas'

test('a touch retries a blocked inline video and the artwork keeps moving', async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play
    let unlocked = false
    document.addEventListener('touchstart', () => { unlocked = true }, { capture: true, once: true })
    HTMLMediaElement.prototype.play = function () {
      return unlocked ? play.call(this) : Promise.reject(new DOMException('User interaction required', 'NotAllowedError'))
    }
  })
  await page.goto('/es')
  await page.locator(heroCanvas).scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', true)
  await page.touchscreen.tap(190, 400)
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', false)
  await expect(page.locator(heroVideo)).toHaveJSProperty('defaultMuted', true)
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentSrc)).toMatch(/creation\.mp4$/)
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
  const frame = await page.locator(heroCanvas).evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
  await expect.poll(() => page.locator(heroCanvas).evaluate((canvas: HTMLCanvasElement, previous) => canvas.toDataURL() !== previous, frame)).toBe(true)
  await page.locator('#faq canvas').scrollIntoViewIfNeeded()
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', true)
  const pausedTime = await page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)
  await page.locator(heroCanvas).scrollIntoViewIfNeeded()
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', false)
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)).not.toBe(pausedTime)
})

test('hidden video frame callbacks cannot freeze the visible canvas', async ({ page }) => {
  await page.addInitScript(() => {
    // iOS can keep decoding an invisible source without compositing it.
    HTMLVideoElement.prototype.requestVideoFrameCallback = () => 1
    HTMLVideoElement.prototype.cancelVideoFrameCallback = () => {}
  })
  await page.goto('/es')
  await page.locator(heroCanvas).scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator(heroVideo).evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.2)
  const frame = await page.locator(heroCanvas).evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
  await expect.poll(() => page.locator(heroCanvas).evaluate((canvas: HTMLCanvasElement, previous) => canvas.toDataURL() !== previous, frame)).toBe(true)
})

test('scroll seeking keeps the decoded artwork instead of flashing its poster', async ({ page }) => {
  await page.goto('/es')
  const section = page.locator('#solutions')
  const { top, interval } = await section.evaluate(el => ({
    top: el.getBoundingClientRect().top + scrollY,
    interval: (5 * el.querySelector<HTMLElement>('.solutions-scene')!.offsetHeight - innerHeight) / 4,
  }))
  const artwork = section.locator('[data-artwork="0"]')
  const video = artwork.locator('video')
  const canvas = artwork.locator('canvas')
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top + interval * 0.75)
  await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime / video.duration)).toBeGreaterThan(0.85)
  await expect(video).toHaveJSProperty('seeking', false)
  await expect.poll(() => artwork.evaluate(el => getComputedStyle(el).opacity)).toBe('1')
  // Allow the scroll spring to settle before capturing its last decoded frame.
  await page.waitForTimeout(400)
  const decoded = await canvas.evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL())
  await video.evaluate(video => Object.defineProperty(video, 'readyState', { configurable: true, get: () => 1 }))
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top + interval * 0.98)
  await expect.poll(() => canvas.evaluate((canvas: HTMLCanvasElement, previous) => canvas.toDataURL() !== previous, decoded)).toBe(true)
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top + interval * 0.75)
  await expect.poll(() => canvas.evaluate((canvas: HTMLCanvasElement, previous) => canvas.toDataURL() === previous, decoded)).toBe(true)
})

test('touch recovery respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/es')
  await page.locator(heroCanvas).scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator(heroCanvas).evaluate((canvas: HTMLCanvasElement) => canvas.width)).toBeGreaterThan(0)
  await page.touchscreen.tap(190, 400)
  await expect(page.locator(heroVideo)).toHaveJSProperty('paused', true)
  await expect(page.locator(heroVideo)).toHaveJSProperty('currentTime', 0)
})
