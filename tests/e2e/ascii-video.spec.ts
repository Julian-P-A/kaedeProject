import { test, expect } from '@playwright/test'

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
