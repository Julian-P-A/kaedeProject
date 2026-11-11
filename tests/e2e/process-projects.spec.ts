import { test, expect } from '@playwright/test'

test('process uses loaded photos and ASCII, with every step fitting the pinned scene', async ({ page }) => {
  test.setTimeout(90000)
  const ids = ['brief', 'scope', 'design', 'build', 'launch']
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 667], [844, 390]]) {
    await page.setViewportSize({ width, height })
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeEnabled()
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    })
    await expect(page.getByRole('heading', { name: 'Todo tu negocio, conectado.' })).toHaveCount(0)
    const section = page.locator('#process')
    const pinned = await section.getAttribute('data-pinned') === 'true'
    const geometry = await section.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, range: el.getBoundingClientRect().height - innerHeight }))
    await expect(section.locator('ol button')).toHaveCount(ids.length)
    await expect(section.getByRole('button', { name: /Conectar|Connect/ })).toHaveCount(0)
    for (const [index, id] of ids.entries()) {
      if (pinned) {
        await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.range * ((index + 0.5) / ids.length))
      } else {
        await section.locator('ol button').nth(index).click()
      }
      await expect(section.locator('.process-layout')).toHaveAttribute('data-stage', id)
      const photo = section.locator(`[data-photo-stage="${id}"]`)
      await expect(photo).toHaveCount(1)
      await expect.poll(() => photo.locator('img').evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true)
      await expect.poll(() => photo.locator('canvas').evaluate(canvas => {
        const image = canvas as HTMLCanvasElement
        const pixels = image.getContext('2d')!.getImageData(0, 0, image.width, image.height).data
        return pixels.some((value, index) => index % 4 === 3 && value > 0)
      })).toBe(true)
      const frame = (await section.locator('.process-frame').boundingBox())!
      if (pinned) {
        expect(frame.y).toBeGreaterThanOrEqual(50)
        expect(frame.y + frame.height).toBeLessThanOrEqual(height - 35)
      }
      const buttons = await section.locator('ol button').evaluateAll(elements => elements.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })))
      expect(buttons.every((button, i) => i === 0 || (button.y > buttons[i - 1].y && button.x === buttons[i - 1].x))).toBe(true)
      await expect(section.locator('.process-caption-title')).toHaveText((await section.locator('ol button').nth(index).getAttribute('aria-label'))!.replace(/^\d+\. /, ''))
      await expect(section.locator('.process-step-current')).toHaveText(String(index + 1).padStart(2, '0'))
      await expect(section.locator('.process-step-total')).toHaveText(String(ids.length).padStart(2, '0'))
      const nav = (await section.locator('ol').boundingBox())!
      const art = (await section.locator('.process-art').boundingBox())!
      const caption = (await section.locator('.process-caption').boundingBox())!
      expect(nav.x + nav.width).toBeLessThanOrEqual(art.x)
      if (width >= 1024) {
        expect(art.x + art.width).toBeLessThan(caption.x)
        expect(art.x + art.width / 2).toBeCloseTo(width / 2, 0)
        const heading = (await section.locator('.process-heading-wrap').boundingBox())!
        expect(caption.y).toBeCloseTo(heading.y, 0)
        expect(art.width).toBeLessThan(450)
        expect(heading.y).toBeLessThan(140)
        const counter = (await section.locator('.process-step-index').boundingBox())!
        expect(counter.y + counter.height).toBeGreaterThan(height * 0.85)
        expect(nav.y).toBeGreaterThan(height * 0.6)
        expect(counter.y - nav.y - nav.height).toBeGreaterThan(12)
        expect(counter.y - nav.y - nav.height).toBeLessThan(40)
      } else {
        expect(caption.y).toBeGreaterThanOrEqual(art.y + art.height)
      }
      if (index === 0) {
        const sizes = await page.evaluate(() => [
          '#process .process-caption-title', '#process .process-stage-description',
          '#faq-question-0', '#faq-answer-0 p', '#contact .text-muted',
        ].map(selector => getComputedStyle(document.querySelector(selector)!).fontSize))
        expect(new Set(sizes).size).toBe(1)
        const headings = await page.evaluate(() => ['#process h2', '#projects h2'].map(selector => getComputedStyle(document.querySelector(selector)!).fontSize))
        expect(headings[0]).toBe(headings[1])
      }
      await expect(section.locator('.process-count, .process-deliverable, .process-stage-title')).toHaveCount(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
      if (index <= 2) {
        await expect(section.locator('h2 > span').last()).toHaveCSS('opacity', '1')
        await page.screenshot({ path: `/private/tmp/kaede-process-final-images-${id}-${width}.png` })
      }
    }
  }
  expect(errors).toEqual([])
})

test('process images travel up-left with scroll and return along the same diagonal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/es')
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  const section = page.locator('#process')
  const geometry = await section.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, range: el.getBoundingClientRect().height - innerHeight }))
  const photo = section.locator('[data-photo-stage="scope"]')
  const position = () => photo.evaluate(el => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
    return { x: matrix.m41, y: matrix.m42 }
  })
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.range * 0.25)
  await expect(section.locator('.process-layout')).toHaveAttribute('data-stage', 'scope')
  await expect.poll(async () => (await position()).x).toBeGreaterThan(100)
  const first = await position()
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.range * 0.35)
  await expect.poll(async () => (await position()).x).toBeLessThan(first.x - 30)
  await expect.poll(async () => (await position()).y).toBeLessThan(first.y - 30)
  await expect(section.locator('.process-layout')).toHaveAttribute('data-stage', 'scope')
  const photoBounds = (await photo.boundingBox())!
  const artBounds = (await section.locator('.process-art').boundingBox())!
  expect(photoBounds.y).toBeLessThan(artBounds.y)
  await expect(section.locator('.process-art')).toHaveCSS('clip-path', 'none')
  await page.screenshot({ path: '/private/tmp/kaede-process-diagonal-transition.png' })
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.range * 0.25)
  await expect.poll(async () => Math.abs((await position()).x - first.x)).toBeLessThan(1)
  await expect.poll(async () => Math.abs((await position()).y - first.y)).toBeLessThan(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(section).toHaveAttribute('data-pinned', 'false')
  await expect(section.locator('.process-photo-layer')).toHaveCount(1)
  await expect(section.locator('.process-photo-layer')).toHaveCSS('transform', 'none')
})

test('process and project scenes fade and blur at their edges without scaling', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/es')
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeEnabled()
  await page.evaluate(() => document.fonts.ready)
  for (const name of ['process', 'projects']) {
    const section = page.locator(`#${name}`)
    const frame = section.locator(`.${name}-frame`)
    const geometry = await section.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height }))
    const state = () => frame.evaluate(el => {
      const css = getComputedStyle(el)
      return { scale: new DOMMatrixReadOnly(css.transform).a, opacity: Number(css.opacity), blur: Number(/blur\(([\d.]+)px\)/.exec(css.filter)?.[1] || 0) }
    })
    for (const top of [geometry.top - 540, geometry.top + geometry.height - 360]) {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), top)
      await expect.poll(async () => (await state()).opacity).toBeLessThan(0.9)
      await expect.poll(async () => (await state()).blur).toBeGreaterThan(2)
      expect((await state()).scale).toBe(1)
    }
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + (geometry.height - 900) * 0.5)
    await expect.poll(async () => (await state()).opacity).toBe(1)
    await expect.poll(async () => (await state()).blur).toBeLessThan(0.1)
    expect((await state()).scale).toBe(1)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const name of ['process', 'projects']) {
    await expect(page.locator(`.${name}-frame`)).toHaveCSS('opacity', '1')
    await expect(page.locator(`.${name}-frame`)).toHaveCSS('filter', 'none')
  }
})

test('project title remains visible while rows loop independently of a brief scroll pin', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const [width, height] of [[1440, 900], [390, 844], [320, 667], [844, 390]]) {
    await page.setViewportSize({ width, height })
    await page.goto('/es')
    await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeEnabled()
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    })
    const section = page.locator('#projects')
    const rows = section.locator('.project-row')
    await expect(rows).toHaveCount(2)
    const card = (await section.locator('.project-shot').first().boundingBox())!
    expect(card.width).toBeLessThan(width * (width >= 1024 ? 0.4 : 0.75))
    await expect(section.locator('p, h3, button')).toHaveCount(0)
    const geometry = await section.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, range: el.getBoundingClientRect().height - innerHeight }))
    expect(geometry.range).toBeGreaterThan(0)
    expect(geometry.range).toBeLessThan(height * 0.6)
    for (const progress of [0.1, 0.8]) {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.range * progress)
      await expect.poll(async () => (await section.locator('.projects-scene').boundingBox())!.y).toBeCloseTo(0, 0)
      await expect(section.locator('h2')).toBeVisible()
      await expect(section.locator('h2')).toHaveText(/Proyectos.*reales/)
      await expect(section).toHaveAttribute('data-running', 'true')
      await expect.poll(() => section.locator('img').evaluateAll(images => images.filter(img => {
        const box = img.getBoundingClientRect()
        return box.right > 0 && box.left < innerWidth
      }).every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    }
    await expect(rows.first()).toHaveCSS('animation-iteration-count', 'infinite')
    await expect(rows.first()).toHaveCSS('animation-timing-function', 'linear')
    await expect(rows.first()).toHaveCSS('animation-direction', 'normal')
    await expect(rows.last()).toHaveCSS('animation-direction', 'reverse')
    const positions = () => rows.evaluateAll(elements => elements.map(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41))
    const initial = await positions()
    // No scroll input: both rows must continue moving in opposite directions.
    await expect.poll(async () => (await positions())[0]).toBeLessThan(initial[0] - 15)
    await expect.poll(async () => (await positions())[1]).toBeGreaterThan(initial[1] + 15)
    await expect(section.locator('img[alt="Sisteviajes"]')).toHaveCount(2)
    await expect(section.locator('img[alt="Elixir Parfum Colombia"]')).toHaveCount(2)
    await expect(section.locator('img[alt="TuMiniu"]')).toHaveCount(2)
    const heading = (await section.locator('h2').boundingBox())!
    const gallery = (await section.locator('.projects-rows').boundingBox())!
    expect(heading.y).toBeGreaterThanOrEqual(50)
    expect(gallery.y + gallery.height).toBeLessThanOrEqual(height - 35)
    await page.screenshot({ path: `/private/tmp/kaede-projects-infinite-${width}.png` })
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), geometry.top + geometry.range + height * 0.5)
    expect((await section.locator('.projects-scene').boundingBox())!.y).toBeLessThan(-height * 0.4)
  }
})

test('reduced motion shows two screenshots per project and preserves direct process selection in both languages', async ({ page }) => {
  for (const lang of ['es', 'en']) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/${lang}`)
      const section = page.locator('#projects')
      await expect(section).toHaveClass(/projects-static/)
      await expect(section.locator('.projects-scene')).toHaveCSS('position', 'relative')
      await expect(section.locator('.project-shot:visible')).toHaveCount(12)
      for (const name of ['Fuego E-sports', 'Celestina Cosmetics', 'Kaede Project', 'Sisteviajes', 'Elixir Parfum Colombia', 'TuMiniu']) {
        await expect(section.locator(`img[alt="${name}"]`)).toHaveCount(2)
      }
      for (const image of await section.locator('img[alt="TuMiniu"]').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect.poll(() => image.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1440)
        await expect(image).toHaveJSProperty('naturalHeight', 900)
      }
      await expect(section.locator('.project-row').first()).toHaveCSS('animation-name', 'none')
      await expect(page.locator('#process .process-scene')).toHaveCSS('position', 'relative')
      const last = page.locator('#process ol button').last()
      await last.click()
      await expect(last).toHaveAttribute('aria-current', 'step')
      await expect(page.locator('#process .process-layout')).toHaveAttribute('data-stage', 'launch')
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    }
  }
})
