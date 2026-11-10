import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef, useState } from 'react'
import { useInView, type MotionValue } from 'framer-motion'
import { ASCII_CELL_SIZE, ASCII_FONT_FAMILY, ASCII_MAX_DPR, ASCII_RAMP } from './asciiStyle'

/**
 * Plays a pre-baked clip (see scripts/ascii-export.mjs) as ASCII art on a
 * canvas. The clip is a luminance map; a cached glyph atlas preserves both
 * character density and brightness, with a little local sharpening for relief.
 *
 * `src` is the path without extension; MP4 is preferred, with WebM fallback.
 * `mobileSrc`, if given, replaces it below the `sm` breakpoint (640px), so
 * phones download only their own (typically tighter, coarser) clip.
 * Draws only when the video presents a new frame, pauses while off-screen and
 * shows a still frame when the user prefers reduced motion.
 * Text color follows the element's CSS `color`.
 */
const MOBILE_QUERY = '(max-width: 639px)'

export function AsciiVideo({
  src,
  mobileSrc,
  className,
  label,
  eager = false,
  speed = 1,
  loop = true,
  ramp = ASCII_RAMP,
  cellSize = ASCII_CELL_SIZE,
  contrast = 1.16,
  gamma = 0.9,
  sharpness = 0.45,
  progress,
  dispersion,
}: {
  src: string
  mobileSrc?: string
  className?: string
  label?: string
  /** Load immediately for artwork in the first viewport. */
  eager?: boolean
  /** Playback speed (1 = normal). */
  speed?: number
  loop?: boolean
  /** Characters from empty to dense. */
  ramp?: string
  /** Minimum glyph height in CSS pixels. */
  cellSize?: number
  /** Tonal contrast around middle grey. */
  contrast?: number
  /** Values below 1 lift midtones without brightening the background. */
  gamma?: number
  /** Local detail enhancement; 0 disables it. */
  sharpness?: number
  /** Optional scroll-controlled playhead, from 0 to 1. Disables autoplay. */
  progress?: MotionValue<number>
  /** Opens individual glyphs away from their grid, from 0 to 1. */
  dispersion?: MotionValue<number>
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduce = useReducedMotion()
  const nearby = useInView(containerRef, { once: true, margin: '300px' })
  const shouldLoad = eager || nearby
  // Picked after mount (no sources during SSR) so only one clip is downloaded.
  const [activeSrc, setActiveSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldLoad) return
    if (!mobileSrc) {
      setActiveSrc(src)
      return
    }
    const query = window.matchMedia(MOBILE_QUERY)
    const pick = () => setActiveSrc(query.matches ? mobileSrc : src)
    pick()
    query.addEventListener('change', pick)
    return () => query.removeEventListener('change', pick)
  }, [src, mobileSrc, shouldLoad])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed
  }, [activeSrc, speed])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas?.getContext('2d')
    const sample = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    if (!activeSrc || !canvas || !video || !ctx || !sample) return

    let cols = 0
    let rows = 0
    let cellW = 0
    let cellH = 0
    let offsetX = 0
    let tileW = 0
    let tileH = 0
    let atlas: HTMLCanvasElement | null = null
    let visible = false
    let frameHandle = 0
    let paintHandle = 0
    let resizeHandle = 0
    let layoutWidth = 0
    let scatter = new Float32Array(0)

    const layout = () => {
      const width = canvas.clientWidth
      if (!video.videoWidth || !width) return
      layoutWidth = width
      const probeFont = (size: number) => `${size}px ${ASCII_FONT_FAMILY}`
      ctx.font = probeFont(100)
      const aspect = ctx.measureText('M').width / 100
      const dpr = Math.min(window.devicePixelRatio || 1, ASCII_MAX_DPR)
      const pixelWidth = Math.round(width * dpr)
      const targetCols = Math.min(Math.round(video.videoWidth * 1.5), Math.max(1, Math.floor(width / (Math.max(1, cellSize) * aspect))))
      // Every cell has the same integer width on the backing canvas. Rounding
      // each position separately alternates narrow/wide gaps and creates bands.
      cellW = Math.max(1, Math.ceil(pixelWidth / targetCols))
      cellH = Math.max(1, Math.round(Math.max(cellSize * dpr, cellW / aspect)))
      cols = Math.max(1, Math.floor(pixelWidth / cellW))
      // Adjust the sample rows for the snapped cells, preserving the silhouette.
      const imageHeight = cols * cellW * video.videoHeight / video.videoWidth / aspect
      rows = Math.max(1, Math.round(imageHeight / cellH))
      offsetX = Math.floor((pixelWidth - cols * cellW) / 2)
      sample.canvas.width = cols
      sample.canvas.height = rows
      sample.imageSmoothingEnabled = true
      sample.imageSmoothingQuality = 'high'

      canvas.width = pixelWidth
      canvas.height = rows * cellH
      canvas.style.height = `${canvas.height / dpr}px`
      const ink = getComputedStyle(canvas).color
      if (dispersion) {
        scatter = new Float32Array(cols * rows * 2)
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 2
            // Fixed offsets keep the same paths when the visitor scrolls back.
            const seed = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
            const noise = seed - Math.floor(seed)
            const angle = noise * Math.PI * 2
            const distance = (0.015 + noise * 0.055) * pixelWidth
            scatter[i] = (x * cellW - pixelWidth / 2) * 0.22 + Math.cos(angle) * distance
            scatter[i + 1] = (y * cellH - canvas.height / 2) * 0.22 + Math.sin(angle) * distance
          }
        }
      }

      tileW = cellW + 2
      tileH = cellH + 2
      const glyphCanvas = document.createElement('canvas')
      glyphCanvas.width = tileW
      glyphCanvas.height = tileH
      const glyphCtx = glyphCanvas.getContext('2d', { willReadFrequently: true })
      if (!glyphCtx) return
      glyphCtx.font = probeFont(Math.round(cellSize * dpr))
      glyphCtx.textAlign = 'center'
      glyphCtx.textBaseline = 'middle'
      glyphCtx.fillStyle = ink

      // Punctuation isn't ordered by ink coverage in a normal ASCII ramp.
      // Measure the actual font at this size to avoid stripes between tones.
      const glyphs = [...new Set(Array.from(ramp))].filter((glyph) => glyph.trim()).map((glyph) => {
        glyphCtx.clearRect(0, 0, tileW, tileH)
        glyphCtx.fillText(glyph, tileW / 2, tileH / 2)
        const pixels = glyphCtx.getImageData(0, 0, tileW, tileH).data
        let coverage = 0
        for (let i = 3; i < pixels.length; i += 4) coverage += pixels[i]
        return { glyph, coverage }
      }).sort((a, b) => a.coverage - b.coverage)

      atlas = document.createElement('canvas')
      atlas.width = tileW * 256
      atlas.height = tileH
      const atlasCtx = atlas.getContext('2d')
      if (!atlasCtx || !glyphs.length) return
      atlasCtx.font = glyphCtx.font
      atlasCtx.textAlign = 'center'
      atlasCtx.textBaseline = 'middle'
      atlasCtx.fillStyle = ink
      for (let level = 1; level < 256; level++) {
        const tone = Math.pow(Math.max(0, Math.min(1, ((level - 8) / 247 - 0.5) * contrast + 0.5)), Math.max(0.01, gamma))
        if (!tone) continue
        const glyph = glyphs[Math.min(glyphs.length - 1, Math.floor(Math.sqrt(tone) * glyphs.length))].glyph
        atlasCtx.globalAlpha = tone
        atlasCtx.fillText(glyph, level * tileW + tileW / 2, tileH / 2)
      }
      // Blit pre-rendered glyphs at physical pixels: no per-frame font rasterizing.
      ctx.imageSmoothingEnabled = false
      draw()
    }

    const draw = () => {
      if (video.readyState < 2 || !cellH || !atlas) return
      sample.drawImage(video, 0, 0, cols, rows)
      const px = sample.getImageData(0, 0, cols, rows).data
      const spread = reduce ? 0 : Math.pow(Math.max(0, Math.min(1, dispersion?.get() ?? 0)), 1.4)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const value = px[i]
          // Leave black pixels empty; sharpening must never grow a noisy halo.
          if (value < 8) continue
          const left = px[i - (x > 0 ? 4 : 0)]
          const right = px[i + (x < cols - 1 ? 4 : 0)]
          const above = px[i - (y > 0 ? cols * 4 : 0)]
          const below = px[i + (y < rows - 1 ? cols * 4 : 0)]
          const level = Math.max(0, Math.min(255, Math.round(value + (value - (left + right + above + below) / 4) * sharpness)))
          const particle = (y * cols + x) * 2
          ctx.drawImage(atlas, level * tileW, 0, tileW, tileH,
            offsetX + x * cellW - 1 + (spread ? scatter[particle] * spread : 0),
            y * cellH - 1 + (spread ? scatter[particle + 1] * spread : 0), tileW, tileH)
        }
      }
    }

    // requestVideoFrameCallback fires once per decoded frame, so a 25 fps clip
    // costs 25 draws per second regardless of the display refresh rate.
    const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype
    const schedule = () => {
      frameHandle = hasRVFC
        ? video.requestVideoFrameCallback(onFrame)
        : requestAnimationFrame(onFrame)
    }
    const cancel = () => {
      if (hasRVFC) video.cancelVideoFrameCallback(frameHandle)
      else cancelAnimationFrame(frameHandle)
    }
    const onFrame = () => {
      draw()
      schedule()
    }

    const requestDraw = () => {
      if (!visible || paintHandle) return
      paintHandle = requestAnimationFrame(() => {
        paintHandle = 0
        draw()
      })
    }
    const syncToProgress = () => {
      if (!progress || reduce || !visible || !Number.isFinite(video.duration) || video.seeking) return
      const end = Math.max(0, video.duration - 1 / 30)
      // The scroll clips are baked at 30 fps. Seek whole frames so reversing
      // to a scroll position always resolves to the same decoded image.
      const target = Math.min(end, Math.round(Math.max(0, Math.min(1, progress.get())) * end * 30) / 30)
      // Let an in-flight decode finish. `seeked` then applies the latest target,
      // so quick gestures never build up a queue of obsolete seeks.
      if (Math.abs(video.currentTime - target) > 1 / 60) video.currentTime = target
    }
    const onSeeked = () => {
      // Paint the decoded frame before starting another seek. Otherwise fast
      // scrolling could leave readyState below 2 on every animation frame.
      if (visible) draw()
      syncToProgress()
    }
    const update = () => {
      cancel()
      if (progress) {
        video.pause()
        syncToProgress()
        requestDraw()
      } else if (visible && !reduce) {
        video.play().catch(() => {})
        schedule()
      } else {
        video.pause()
        draw()
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    // Layout also changes the observed height. Write it in the next frame so
    // ResizeObserver can finish delivering the current batch first.
    const resizeObserver = new ResizeObserver(() => {
      if (canvas.clientWidth === layoutWidth || resizeHandle) return
      resizeHandle = requestAnimationFrame(() => {
        resizeHandle = 0
        layout()
      })
    })
    const unsubscribeProgress = progress?.on('change', syncToProgress)
    const unsubscribeDispersion = dispersion?.on('change', requestDraw)

    const onReady = () => {
      layout()
      update()
    }
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('seeked', onSeeked)
    if (video.readyState >= 2) onReady()
    observer.observe(canvas)
    resizeObserver.observe(canvas)

    return () => {
      cancel()
      cancelAnimationFrame(paintHandle)
      cancelAnimationFrame(resizeHandle)
      unsubscribeProgress?.()
      unsubscribeDispersion?.()
      observer.disconnect()
      resizeObserver.disconnect()
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('seeked', onSeeked)
    }
  }, [activeSrc, reduce, ramp, cellSize, contrast, gamma, sharpness, progress, dispersion])

  return (
    <div ref={containerRef} className={className ?? 'w-full'}>
      <canvas ref={canvasRef} className="block w-full" role="img" aria-label={label} />
      <video
        key={activeSrc ?? 'none'}
        ref={videoRef}
        muted
        loop={loop}
        playsInline
        preload={activeSrc ? 'auto' : 'none'}
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px opacity-0"
      >
        {activeSrc && <source src={`${activeSrc}.mp4`} type="video/mp4" />}
        {activeSrc && <source src={`${activeSrc}.webm`} type="video/webm" />}
      </video>
    </div>
  )
}
