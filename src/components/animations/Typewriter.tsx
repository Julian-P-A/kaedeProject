import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView } from 'framer-motion'

/**
 * Reveals `text` character by character once it enters the viewport.
 * `render` can decorate the visible part (e.g. syntax highlighting as it types).
 */
export function Typewriter({
  text,
  className,
  speed = 22,
  cursor = true,
  render = (visible) => visible,
}: {
  text: string
  className?: string
  speed?: number
  cursor?: boolean
  render?: (visible: string) => ReactNode
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  const reduce = useReducedMotion()
  const [chars, setChars] = useState(0)
  const visibleChars = reduce ? text.length : chars

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
      {render(text.slice(0, visibleChars))}
      {cursor && visibleChars < text.length && !reduce && (
        <span className="animate-pulse text-accent">▍</span>
      )}
    </span>
  )
}
