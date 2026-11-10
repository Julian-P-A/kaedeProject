import { useEffect, useRef } from 'react'
import { ASCII_FONT_FAMILY, ASCII_RAMP } from './asciiStyle'

/** Align a photograph and its luminance rendered as glyphs to the same crop.
 * Static photos only repaint on load/resize, with no animation loop. */
export function AsciiPhoto({ src, alt, position = 0.5 }: { src: string; alt: string; position?: number }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const photo = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const sample = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    if (!photo || !canvas || !ctx || !sample) return
    let frame = 0
    let visible = false

    const draw = () => {
      frame = 0
      if (!visible || !photo.complete || !photo.naturalWidth) return
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const fontSize = width < 500 ? 6 : 7
      const cellWidth = fontSize * 0.6
      const cols = Math.ceil(width / cellWidth)
      const rows = Math.ceil(height / fontSize)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // Match object-fit: cover and the photograph's object-position exactly.
      const scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight)
      const cropWidth = width / scale
      const cropHeight = height / scale
      sample.canvas.width = cols
      sample.canvas.height = rows
      sample.drawImage(photo,
        (photo.naturalWidth - cropWidth) * position,
        (photo.naturalHeight - cropHeight) * 0.5,
        cropWidth, cropHeight, 0, 0, cols, rows)
      const pixels = sample.getImageData(0, 0, cols, rows).data
      const ink = getComputedStyle(canvas).color

      const tileWidth = Math.ceil(cellWidth * dpr) + 2
      const tileHeight = Math.ceil(fontSize * dpr) + 2
      const atlas = document.createElement('canvas')
      atlas.width = tileWidth * 64
      atlas.height = tileHeight
      const atlasCtx = atlas.getContext('2d')
      if (!atlasCtx) return
      atlasCtx.font = `${fontSize * dpr}px ${ASCII_FONT_FAMILY}`
      atlasCtx.textBaseline = 'middle'
      atlasCtx.textAlign = 'center'
      atlasCtx.fillStyle = ink
      for (let level = 1; level < 64; level++) {
        const brightness = level / 63
        const glyph = ASCII_RAMP[Math.min(ASCII_RAMP.length - 1, Math.ceil(brightness * (ASCII_RAMP.length - 1)))]
        atlasCtx.globalAlpha = Math.pow(brightness, 0.7)
        atlasCtx.fillText(glyph, level * tileWidth + tileWidth / 2, tileHeight / 2)
      }
      ctx.imageSmoothingEnabled = false
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const index = (y * cols + x) * 4
          const luminance = pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722
          const level = Math.round(Math.max(0, Math.min(1, (luminance / 255 - 0.12) * 1.35)) * 63)
          if (!level) continue
          ctx.drawImage(atlas, level * tileWidth, 0, tileWidth, tileHeight,
            x * cellWidth, y * fontSize, tileWidth / dpr, tileHeight / dpr)
        }
      }
    }
    const requestDraw = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) requestDraw()
    }, { rootMargin: '200px' })
    const resize = new ResizeObserver(requestDraw)
    photo.addEventListener('load', requestDraw)
    intersection.observe(canvas)
    resize.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      photo.removeEventListener('load', requestDraw)
      intersection.disconnect()
      resize.disconnect()
    }
  }, [src, position])

  return (
    <div className="ascii-photo">
      <img ref={imageRef} src={src} alt={alt} width={1280} height={1440} loading="lazy" decoding="async" style={{ objectPosition: `${position * 100}% 50%` }} />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
