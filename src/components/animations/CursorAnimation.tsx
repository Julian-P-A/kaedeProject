import { motion, useReducedMotion } from 'framer-motion'

interface Point {
  x: number
  y: number
}

/**
 * A small animated cursor dot that glides between `points` (percentages of
 * the nearest `position: relative` ancestor) and pauses briefly at each stop.
 */
export function CursorAnimation({ points, className }: { points: Point[]; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce || points.length === 0) return null

  const xs = points.map((p) => `${p.x}%`)
  const ys = points.map((p) => `${p.y}%`)

  return (
    <motion.div
      className={className ?? 'pointer-events-none absolute z-20'}
      animate={{ left: xs, top: ys }}
      transition={{
        duration: points.length * 1.4,
        times: points.map((_, i) => i / (points.length - 1 || 1)),
        repeat: Infinity,
        repeatDelay: 0.8,
        ease: 'easeInOut',
      }}
      style={{ translateX: '-50%', translateY: '-50%' }}
    >
      <span className="block h-3.5 w-3.5 rounded-full border-2 border-accent bg-accent/30 shadow-[0_0_14px_rgba(212,255,79,0.6)]" />
    </motion.div>
  )
}
