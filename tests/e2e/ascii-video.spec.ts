import { test, expect } from '@playwright/test'

test('only the hero clip loads initially; other ASCII clips load near their sections', async ({ page }) => {
  const clips = new Set<string>()
  page.on('request', request => {
    if (request.url().includes('/ascii/')) clips.add(new URL(request.url()).pathname)
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.route('**/gtagmetrics/**', route => route.fulfill({ body: '', contentType: 'application/javascript' }))
  await page.goto('/es')
  await expect.poll(() => page.locator('.hero-art video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips]).toEqual(['/ascii/creation.mp4'])

  await page.locator('#solutions').evaluate(section => scrollTo({ top: section.getBoundingClientRect().top + scrollY, behavior: 'instant' }))
  const serviceVideo = page.locator('#solutions [data-artwork="0"] video')
  await expect.poll(() => serviceVideo.evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips].some(path => path.includes('faq-book'))).toBe(false)

  await page.locator('#faq canvas').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('#faq video').evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)
  expect([...clips].filter(path => path.endsWith('.webm'))).toEqual([])
})

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
