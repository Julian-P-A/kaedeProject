import { useEffect, useRef, useState } from 'react'
import { useInView, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '#/hooks/useReducedMotion'
import type { AsciiAsset } from '#/data/ascii'

/** Displays exported ASCII pixels. JS only controls loading and playback. */
export function AsciiVideo({ asset, className, label, eager = false, load = true, speed = 1, loop = true, progress, fit = 'contain' }: {
  asset: AsciiAsset
  className?: string
  label?: string
  eager?: boolean
  load?: boolean
  speed?: number
  loop?: boolean
  progress?: MotionValue<number>
  fit?: 'contain' | 'cover'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const nearby = useInView(containerRef, { once: true, margin: '300px' })
  const shouldLoad = load && (eager || nearby)
  const [selected, setSelected] = useState<Pick<AsciiAsset, 'src' | 'width' | 'height'> | null>(null)
  const [readySrc, setReadySrc] = useState<string | null>(null)

  useEffect(() => {
    if (!shouldLoad) return
    const query = window.matchMedia('(max-width: 639px)')
    const pick = () => setSelected(query.matches && asset.mobile ? asset.mobile : asset)
    pick()
    query.addEventListener('change', pick)
    return () => query.removeEventListener('change', pick)
  }, [asset, shouldLoad])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !selected || reduce) return
    let visible = false
    let seekHandle = 0
    let playPending = false
    video.muted = true
    video.defaultMuted = true
    video.playbackRate = speed

    const syncToProgress = () => {
      seekHandle = 0
      if (!progress || !visible || document.hidden || video.seeking || !Number.isFinite(video.duration)) return
      const end = Math.max(0, video.duration - 1 / asset.fps)
      const target = Math.min(end, Math.round(Math.max(0, Math.min(1, progress.get())) * end * asset.fps) / asset.fps)
      if (Math.abs(video.currentTime - target) > 1 / (asset.fps * 2)) video.currentTime = target
    }
    const requestSeek = () => {
      // Coalesce scroll updates and let the previous native decode finish.
      if (progress && visible && !document.hidden && !seekHandle) seekHandle = requestAnimationFrame(syncToProgress)
    }
    const update = () => {
      if (!visible || document.hidden || progress) {
        video.pause()
        requestSeek()
      } else if (video.paused && !playPending) {
        playPending = true
        video.play().catch(() => {}).finally(() => { playPending = false })
      }
    }
    const ready = () => {
      if (video.readyState >= 2) setReadySrc(selected.src)
      update()
    }
    const seeked = () => {
      if (video.readyState >= 2) setReadySrc(selected.src)
      requestSeek()
    }
    const retryPlayback = () => {
      if (visible && !progress) update()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    const unsubscribe = progress?.on('change', requestSeek)
    observer.observe(video)
    video.addEventListener('loadedmetadata', update)
    video.addEventListener('loadeddata', ready)
    video.addEventListener('canplay', ready)
    video.addEventListener('seeked', seeked)
    document.addEventListener('pointerdown', retryPlayback, { passive: true })
    document.addEventListener('touchend', retryPlayback, { passive: true })
    document.addEventListener('keydown', retryPlayback)
    document.addEventListener('visibilitychange', update)
    if (video.readyState >= 2) ready()

    return () => {
      video.pause()
      cancelAnimationFrame(seekHandle)
      unsubscribe?.()
      observer.disconnect()
      video.removeEventListener('loadedmetadata', update)
      video.removeEventListener('loadeddata', ready)
      video.removeEventListener('canplay', ready)
      video.removeEventListener('seeked', seeked)
      document.removeEventListener('pointerdown', retryPlayback)
      document.removeEventListener('touchend', retryPlayback)
      document.removeEventListener('keydown', retryPlayback)
      document.removeEventListener('visibilitychange', update)
    }
  }, [selected, reduce, speed, progress, asset.fps])

  const media = selected ?? asset
  const ready = !reduce && readySrc === media.src
  return (
    <div ref={containerRef} className={'ascii-media ' + (className ?? 'w-full')} style={{ aspectRatio: media.width + ' / ' + media.height }} role={label ? 'img' : undefined} aria-label={label} data-ascii="exported" data-ready={ready}>
      {selected && <img className="ascii-poster" src={media.src + '.webp'} width={media.width} height={media.height} alt="" aria-hidden="true" decoding="async" style={{ objectFit: fit }} />}
      <video key={media.src} ref={videoRef} className="ascii-playback" width={media.width} height={media.height} muted loop={loop} playsInline preload={selected && !reduce ? 'auto' : 'none'} aria-hidden="true" style={{ objectFit: fit, opacity: ready ? 1 : 0 }}>
        {selected && !reduce && <source src={media.src + '.mp4'} type="video/mp4" />}
      </video>
    </div>
  )
}
