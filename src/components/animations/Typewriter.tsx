import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/** Reveals `text` character by character once it enters the viewport. */
export function Typewriter({
  text,
  className,
  speed = 22,
  cursor = true,
}: {
  text: string
  className?: string
  speed?: number
  cursor?: boolean
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const reduce = useReducedMotion()
  const [chars, setChars] = useState(reduce ? text.length : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const id = setInterval(() => {
      setChars((c) => {
        if (c >= text.length) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, speed)
    return () => clearInterval(id)
  }, [inView, reduce, text, speed])

  return (
    <span ref={ref} className={className}>
      {text.slice(0, chars)}
      {cursor && chars < text.length && !reduce && (
        <span className="animate-pulse text-accent">▍</span>
      )}
    </span>
  )
}
