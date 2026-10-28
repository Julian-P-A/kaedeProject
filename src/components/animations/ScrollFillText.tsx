import { useReducedMotion } from '#/hooks/useReducedMotion'
import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

function FillWord({ word, index, total, progress, reduce }: {
  word: string
  index: number
  total: number
  progress: MotionValue<number>
  reduce: boolean
}) {
  const position = useTransform(progress, [index / total, (index + 1) / total], ['100%', '0%'])

  return (
    <motion.span
      className="scroll-fill-word inline-block"
      style={{ backgroundPositionX: reduce ? '0%' : position }}
    >
      {word}
    </motion.span>
  )
}

/** Fill each word from left to right as the heading moves through the viewport. */
export function ScrollFillText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')

  return (
    <h2 ref={ref} className={`relative ${className ?? ''}`}>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <FillWord word={word} index={index} total={words.length} progress={scrollYProgress} reduce={!!reduce} />
          {index < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </h2>
  )
}
