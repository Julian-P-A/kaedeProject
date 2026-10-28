import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef } from 'react'

/** Theme colour tokens from coolest (flame tips) to hottest (base). */
const DEFAULT_PALETTE = ['--color-border-strong', '--color-muted', '--color-accent', '--color-beige']

/**
 * Procedural ASCII fire (the classic "Doom fire" spread): the bottom row is
 * kept hot and each cell rises with a random sideways drift while cooling, so
 * no asset is downloaded and it never repeats. Heat maps to glyph density and
 * to the theme colours in `palette`. Runs at `fps` only while on-screen; a
 * still frame is drawn when the user prefers reduced motion.
 */
export function AsciiFire({
  className,
  cellSize = 10,
  fps = 10,
  height = 0.75,
  ramp = ' .,:;-=+*#%@',
  palette = DEFAULT_PALETTE,
}: {
  className?: string
  /** Font size in px. */
  cellSize?: number
  fps?: number
  /** Average flame height as a fraction of the element's height. */
  height?: number
  /** Characters from cold to hot. */
  ramp?: string
  /** CSS custom properties (e.g. `--color-accent`) from coolest to hottest. */
  palette?: string[]
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const root = getComputedStyle(document.documentElement)
    const colors = palette.map((token) => root.getPropertyValue(token).trim() || 'currentColor')

    let cols = 0
    let rows = 0
    let heat = new Float32Array(0)
    let decayMax = 0
    let raf = 0
    let last = 0

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${cellSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textBaseline = 'top'
      cols = Math.ceil(w / ctx.measureText('M').width)
      rows = Math.ceil(h / cellSize)
      heat = new Float32Array(cols * rows)
      // Mean cooling per row is decayMax / 2, so flames reach ~`height` of the rows.
      decayMax = 2 / Math.max(1, rows * height)
      // Warm up so the first frame is already a full fire.
      for (let i = 0; i < rows * 2; i++) step()
      draw()
    }

    const step = () => {
      // The fuel line isn't uniform: two drifting waves make some stretches
      // hotter than others, which is what turns the spread into tongues.
      const t = performance.now() / 1000
      const base = (rows - 1) * cols
      for (let x = 0; x < cols; x++) {
        const wave = Math.sin(x * 0.11 + t * 0.5) * 0.5 + Math.sin(x * 0.29 - t * 0.3) * 0.5
        heat[base + x] = Math.min(1, Math.max(0, 0.7 + wave * 0.35 + Math.random() * 0.15))
      }
      for (let y = 1; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const src = y * cols + x
          const drift = Math.round(Math.random() * 2) - 1
          const dx = Math.min(cols - 1, Math.max(0, x + drift))
          // Cool in all-or-nothing steps (mean decayMax / 2): cells that skip
          // cooling carry heat up in jets instead of fading in even layers.
          const cooling = Math.random() < 0.5 ? 0 : decayMax
          heat[(y - 1) * cols + dx] = Math.max(0, heat[src] - cooling)
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const glyphs = ramp.length - 1
      const bands = colors.length
      const charW = ctx.measureText('M').width
      for (let y = 0; y < rows; y++) {
        // One string per colour band keeps it to a few fillText calls per row.
        const lines = colors.map(() => [] as string[])
        for (let x = 0; x < cols; x++) {
          const v = heat[y * cols + x]
          const glyph = v < 0.05 ? ' ' : ramp[Math.min(glyphs, Math.ceil(v * glyphs))]
          const band = Math.min(bands - 1, Math.floor(v * bands))
          for (let b = 0; b < bands; b++) lines[b].push(b === band ? glyph : ' ')
        }
        for (let b = 0; b < bands; b++) {
          ctx.fillStyle = colors[b]
          ctx.fillText(lines[b].join(''), 0, y * cellSize, cols * charW)
        }
      }
    }

    const tick = (now: number) => {
      if (now - last >= 1000 / fps) {
        last = now
        step()
        draw()
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting && !reduce) raf = requestAnimationFrame(tick)
    })
    const resizeObserver = new ResizeObserver(layout)
    observer.observe(canvas)
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [cellSize, fps, height, ramp, palette, reduce])

  return <canvas ref={canvasRef} aria-hidden="true" className={className ?? 'block h-full w-full'} />
}
