import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef } from 'react'

/**
 * Decorative field of ASCII characters that slowly shift: a soft density wave
 * drifts across the grid and a few cells flip to new glyphs each tick.
 * Drawn on a canvas at a low frame rate, only while on-screen; static when the
 * user prefers reduced motion. Text color follows the element's CSS `color`.
 */
export function AsciiField({
  className,
  cellSize = 11,
  fps = 10,
  ramp = ' .·:-=+*#',
  seed = 0,
}: {
  className?: string
  /** Font size in px. */
  cellSize?: number
  fps?: number
  /** Characters from empty to dense. */
  ramp?: string
  /** Offsets the wave so neighbouring fields don't move in lockstep. */
  seed?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let cols = 0
    let rows = 0
    let charW = 0
    let jitter = new Float32Array(0)
    let raf = 0
    let last = 0
    let visible = false

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = `${cellSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textBaseline = 'top'
      charW = ctx.measureText('M').width
      cols = Math.ceil(w / charW)
      rows = Math.ceil(h / cellSize)
      jitter = Float32Array.from({ length: cols * rows }, () => Math.random())
      draw(performance.now())
    }

    const draw = (now: number) => {
      const t = now / 1000 + seed * 7
      // Re-roll a few cells per tick so glyphs keep changing.
      for (let i = 0; i < jitter.length * 0.04; i++) {
        jitter[(Math.random() * jitter.length) | 0] = Math.random()
      }
      const maxIndex = ramp.length - 1
      ctx.fillStyle = getComputedStyle(canvas).color
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let y = 0; y < rows; y++) {
        let line = ''
        for (let x = 0; x < cols; x++) {
          const wave =
            Math.sin(x * 0.18 + t * 0.6) * 0.5 +
            Math.sin(y * 0.35 - t * 0.4 + x * 0.05) * 0.5
          const v = (wave + 1) / 2 + (jitter[y * cols + x] - 0.5) * 0.6
          line += ramp[Math.max(0, Math.min(maxIndex, Math.floor(v * ramp.length)))]
        }
        ctx.fillText(line, 0, y * cellSize)
      }
    }

    const tick = (now: number) => {
      if (now - last >= 1000 / fps) {
        last = now
        draw(now)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduce) raf = requestAnimationFrame(tick)
    })
    const resizeObserver = new ResizeObserver(layout)
    observer.observe(canvas)
    resizeObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [cellSize, fps, ramp, seed, reduce])

  return <canvas ref={canvasRef} aria-hidden="true" className={className ?? 'block h-full w-full'} />
}
