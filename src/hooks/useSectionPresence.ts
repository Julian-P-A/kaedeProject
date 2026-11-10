import { useEffect, useState, type RefObject } from 'react'
import { useScroll, useTransform } from 'framer-motion'

/** Fade and defocus at the viewport edges while keeping the pinned scene sharp. */
export function useSectionPresence(target: RefObject<HTMLElement | null>) {
  const [span, setSpan] = useState(2)
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })

  useEffect(() => {
    const element = target.current
    if (!element) return
    const measure = () => setSpan(Math.max(2, 1 + element.offsetHeight / Math.max(1, window.innerHeight)))
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [target])

  // Keep each transition within the entering/leaving viewport, including when
  // a section contains several viewports of pinned scrolling.
  const points = [0, 0.4 / span, 0.8 / span, 1 - 0.8 / span, 1 - 0.4 / span, 1]
  const opacity = useTransform(scrollYProgress, points, [0, 0.4, 1, 1, 0.4, 0])
  const filter = useTransform(scrollYProgress, points, ['blur(18px)', 'blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)', 'blur(18px)'])
  return { opacity, filter }
}
