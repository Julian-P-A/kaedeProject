import { test, expect } from '@playwright/test'

test('only the hero clip loads initially; other ASCII clips load near their sections', async ({ page }) => {
  const clips = new Set<string>()
  page.on('request', request => {
    if (/\/ascii\/.*\.(mp4|webm)(?:\?|$)/.test(request.url())) clips.add(new URL(request.url()).pathname)
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
  await page.goto('/es')
  await expect.poll(() => page.locator('.hero-art video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips]).toHaveLength(1)
  expect([...clips][0]).toMatch(/^\/ascii\/creation\.(mp4|webm)$/)

  await page.locator('#solutions').evaluate(section => scrollTo({ top: section.getBoundingClientRect().top + scrollY, behavior: 'instant' }))
  const serviceVideo = page.locator('#solutions [data-artwork="0"] video')
  await expect.poll(() => serviceVideo.evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips].some(path => path.includes('faq-book'))).toBe(false)

  await page.locator('#faq canvas').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('#faq video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  const names = [...clips].map(path => path.replace(/\.(mp4|webm)$/, ''))
  expect(new Set(names).size).toBe(clips.size)
})

for (const playbackAvailable of [true, false]) {
  test(`mobile ASCII remains visible when video playback is ${playbackAvailable ? 'available' : 'unavailable'}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
    if (!playbackAvailable) await page.route(/\/ascii\/.*\.(mp4|webm)(?:\?.*)?$/, route => route.abort())
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
    await page.evaluate(() => document.fonts.ready)

    const expectArtwork = async (selector: string) => {
      await expect.poll(() => page.locator(selector).evaluate((canvas: HTMLCanvasElement) => {
        const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
        return pixels.some((value, index) => index % 4 === 3 && value > 0)
      })).toBe(true)
    }
    await page.locator('.hero-art canvas').scrollIntoViewIfNeeded()
    await expectArtwork('.hero-art canvas')
    const copy = (await page.locator('.hero-copy').boundingBox())!
    const artwork = (await page.locator('.hero-art canvas').boundingBox())!
    expect(artwork.y - (copy.y + copy.height)).toBeGreaterThanOrEqual(24)
    if (playbackAvailable) {
      await expect.poll(() => page.locator('.hero-art video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
    }

    const solutions = page.locator('#solutions')
    const geometry = await solutions.evaluate(section => ({
      top: section.getBoundingClientRect().top + scrollY,
      range: 5 * section.querySelector<HTMLElement>('.solutions-scene')!.offsetHeight - innerHeight,
    }))
    for (let index = 0; index < 4; index++) {
      await page.evaluate(({ top, range, index }) => scrollTo({ top: top + range * (index + 0.3) / 4, behavior: 'instant' }), { ...geometry, index })
      await expect(solutions).toHaveAttribute('data-active-service', String(index + 1))
      await expectArtwork(`#solutions [data-artwork="${index}"] canvas`)
      if (playbackAvailable) {
        const video = solutions.locator(`[data-artwork="${index}"] video`)
        await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
        await expect(video).toHaveJSProperty('seeking', false)
        await expect(video).toHaveJSProperty('paused', true)
        await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
      }
    }
    await page.locator('#faq canvas').scrollIntoViewIfNeeded()
    await expectArtwork('#faq canvas')
    if (playbackAvailable) {
      await expect.poll(() => page.locator('#faq video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
    }
  })
}

test('ASCII video repaints after resizing without browser resize errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', message => {
    if (message.text().startsWith('BROWSER_ERROR:')) errors.push(message.text())
  })
  // ResizeObserver errors are window error events, not rejected promises.
  await page.addInitScript(() => {
    window.addEventListener('error', event => console.error(`BROWSER_ERROR:${event.message}`))
  })
  await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
  await page.goto('/es')
  await expect(page.getByRole('button', { name: 'Open menu', exact: true, includeHidden: true })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  const canvas = page.locator('#faq canvas')
  for (const width of [1440, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await canvas.scrollIntoViewIfNeeded()
    await expect.poll(() => canvas.evaluate(element => {
      const canvas = element as HTMLCanvasElement
      const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
      return pixels.some((value, index) => index % 4 === 3 && value > 0)
    })).toBe(true)
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  }
  expect(errors).toEqual([])
})
