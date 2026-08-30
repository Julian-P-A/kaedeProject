import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLanguage } from '#/context/LanguageContext'

const VIEWPORT = { once: true, margin: '0px' } as const

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'span'
}

/** Rise-up entrance: opacity 0→1, y 30→0. */
export function RiseReveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 30 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}

/** Pop-in entrance: opacity 0→1, scale 0.7→1. */
export function PopReveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}

/** Horizontal line draw: scaleX 0→1, anchored left. */
export function LineReveal({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: 'left center' }}
      initial={reduce ? undefined : { scaleX: 0, opacity: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

/** Wraps children and staggers any descendant using `staggerItem` variants. */
export function StaggerGroup({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul'
}) {
  const reduce = useReducedMotion()
  const { lang } = useLanguage()
  const Component = motion[as]
  if (reduce) {
    const Plain = as
    return (
      <Plain key={lang} className={className}>
        {children}
      </Plain>
    )
  }
  return (
    // Keyed by lang: children carry translated text in their own keys, so a
    // language switch remounts them under an already-resolved "show" parent
    // and they'd otherwise render permanently hidden. Remounting the whole
    // group forces a fresh viewport check that fires immediately.
    <Component
      key={lang}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Component>
  )
}

export { VIEWPORT }
