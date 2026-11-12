#!/usr/bin/env node
/** Bake the former canvas font once. Production and Python exports need no browser. */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const destination = fileURLToPath(new URL('./ascii-glyphs/', import.meta.url))
mkdirSync(destination, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  for (const scale of [1, 2, 3]) {
    const png = await page.evaluate(scale => {
      const size = 6 * scale
      const tile = size * 2
      const canvas = document.createElement('canvas')
      const glyphs = [...'.:*#']
      canvas.width = tile * glyphs.length
      canvas.height = tile
      const ctx = canvas.getContext('2d')
      ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      glyphs.forEach((glyph, i) => ctx.fillText(glyph, (i + 0.5) * tile, tile / 2))
      return canvas.toDataURL('image/png').split(',')[1]
    }, scale)
    writeFileSync(`${destination}${scale}.png`, Buffer.from(png, 'base64'))
  }
} finally {
  await browser.close()
}
console.log('Baked original canvas glyphs at 1x, 2x and 3x.')
