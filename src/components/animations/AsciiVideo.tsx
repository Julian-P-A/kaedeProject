import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef, useState } from 'react'

/**
 * Plays a pre-baked clip (see scripts/ascii-export.mjs) as ASCII art on a
 * canvas. Each video pixel is one character, so the browser only maps
 * brightness to a glyph: no keying or scaling at runtime.
 *
 * `src` is the path without extension; `<src>.webm` and `<src>.mp4` are used.
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
  speed = 1,
  loop = true,
  ramp = ' .,:;-=+*#%@',
}: {
  src: string
  mobileSrc?: string
  className?: string
  label?: string
  /** Playback speed (1 = normal). */
  speed?: number
  loop?: boolean
  /** Characters from empty to dense. */
  ramp?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduce = useReducedMotion()
  // Picked after mount (no sources during SSR) so only one clip is downloaded.
  const [activeSrc, setActiveSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!mobileSrc) {
      setActiveSrc(src)
      return
    }
    const query = window.matchMedia(MOBILE_QUERY)
    const pick = () => setActiveSrc(query.matches ? mobileSrc : src)
    pick()
    query.addEventListener('change', pick)
    return () => query.removeEventListener('change', pick)
  }, [src, mobileSrc])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas?.getContext('2d')
    const sample = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    if (!activeSrc || !canvas || !video || !ctx || !sample) return

    let cols = 0
    let rows = 0
    let cellH = 0
    let visible = false
    let frameHandle = 0

    const layout = () => {
      cols = video.videoWidth
      rows = video.videoHeight
      const width = canvas.clientWidth
      if (!cols || !width) return
      sample.canvas.width = cols
      sample.canvas.height = rows

      // Fit `cols` glyphs across the width; line height equals font size.
      const probeFont = (size: number) => `${size}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.font = probeFont(100)
      const fontSize = (width / (ctx.measureText('M').width * cols)) * 100
      cellH = fontSize

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(rows * cellH * dpr)
      canvas.style.height = `${rows * cellH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = probeFont(fontSize)
      ctx.textBaseline = 'top'
      draw()
    }

    const draw = () => {
      if (video.readyState < 2 || !cellH) return
      sample.drawImage(video, 0, 0)
      const px = sample.getImageData(0, 0, cols, rows).data
      const last = ramp.length - 1
      ctx.fillStyle = getComputedStyle(canvas).color
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let y = 0; y < rows; y++) {
        let line = ''
        for (let x = 0; x < cols; x++) {
          const v = px[(y * cols + x) * 4]
          line += v < 10 ? ' ' : ramp[Math.min(last, Math.ceil((v / 255) * last))]
        }
        ctx.fillText(line, 0, y * cellH)
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

    const update = () => {
      cancel()
      if (visible && !reduce) {
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
    const resizeObserver = new ResizeObserver(layout)

    const onReady = () => {
      video.playbackRate = speed
      layout()
    }
    video.addEventListener('loadeddata', onReady)
    if (video.readyState >= 2) onReady()
    observer.observe(canvas)
    resizeObserver.observe(canvas)

    return () => {
      cancel()
      observer.disconnect()
      resizeObserver.disconnect()
      video.removeEventListener('loadeddata', onReady)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSrc, reduce, ramp])

  return (
    <div className={className ?? 'w-full'}>
      <canvas ref={canvasRef} className="block w-full" role="img" aria-label={label} />
      <video
        key={activeSrc ?? 'none'}
        ref={videoRef}
        muted
        loop={loop}
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px opacity-0"
      >
        {activeSrc && <source src={`${activeSrc}.webm`} type="video/webm" />}
        {activeSrc && <source src={`${activeSrc}.mp4`} type="video/mp4" />}
      </video>
    </div>
  )
}
