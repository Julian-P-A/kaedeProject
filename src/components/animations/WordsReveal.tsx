import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { VIEWPORT } from '#/components/animations/Reveal'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
}

const word: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

/** Instrument Serif renders visually smaller/thinner than Manrope at the same size, so the accent is scaled up to read with equal weight. */
const ACCENT_CLASS = 'font-serif italic text-[1.25em]'

/** A word wrapped in `*asterisks*` renders as an italic Instrument Serif accent. */
function parseWord(raw: string) {
  const isAccent = raw.length > 2 && raw.startsWith('*') && raw.endsWith('*')
  return { text: isAccent ? raw.slice(1, -1) : raw, isAccent }
}

/** Staggers a heading's words in on scroll, y 18→0 / opacity 0→1 per word. */
export function WordsReveal({
  text,
  className,
  wordClassName,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  wordClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ').map(parseWord)

  if (reduce) {
    const Plain = Tag
    return (
      <Plain key={text} className={className}>
        {words.map((w, i) => (
          <span key={i} className={w.isAccent ? ACCENT_CLASS : undefined}>
            {w.text}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Plain>
    )
  }

  const MotionTag = motion[Tag]

  return (
    // Keyed by text: per-word children are keyed by their own text, so a
    // language switch remounts them under an already-resolved "show" parent
    // and they'd otherwise render permanently hidden. Remounting the whole
    // heading forces a fresh viewport check that fires immediately.
    <MotionTag
      key={text}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w.text}-${i}`}
          variants={word}
          className={`${wordClassName ?? ''} ${w.isAccent ? ACCENT_CLASS : ''}`.trim() || undefined}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {w.text}
        </motion.span>
      ))}
    </MotionTag>
  )
}
