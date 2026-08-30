import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Animates a numeric value counting up when it scrolls into view.
 * `value` may include a non-numeric prefix/suffix (e.g. "+247", "93%") which
 * is preserved around the animated digits.
 */
export function CountUp({ value, className, duration = 1.2 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState<string>(value)

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/)

  useEffect(() => {
    if (!inView || reduce || !match) {
      setDisplay(value)
      return
    }
    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr)
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
    const start = performance.now()

    let frame: number
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
