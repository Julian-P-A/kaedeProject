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
export function ScrollFillText({ text, highlights = [], className }: {
  text: string
  highlights?: string[]
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  const phrases = highlights.map((phrase) => phrase.split(' '))
  const runs: { index: number; text: string; highlighted: boolean }[] = []
  for (let index = 0; index < words.length;) {
    const phrase = phrases.find((phraseWords) => phraseWords.every((word, offset) => words[index + offset] === word))
    const length = phrase?.length ?? 1
    runs.push({ index, text: words.slice(index, index + length).join(' '), highlighted: !!phrase })
    index += length
  }

  return (
    <h2 ref={ref} className={`relative ${className ?? ''}`}>
      {runs.map((run, index) => (
        <Fragment key={`${run.index}-${run.text}`}>
          {run.highlighted ? (
            <mark className="scroll-fill-highlight">{run.text}</mark>
          ) : (
            <FillWord word={run.text} index={run.index} total={words.length} progress={scrollYProgress} reduce={!!reduce} />
          )}
          {index < runs.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </h2>
  )
}
