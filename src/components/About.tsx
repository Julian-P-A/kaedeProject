import { useLanguage } from '#/context/LanguageContext'
import { ScrollFillText } from '#/components/animations/ScrollFillText'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '#/hooks/useReducedMotion'

export function About() {
  const { t } = useLanguage()
  const section = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const points = [0, 0.14, 0.28, 0.72, 0.86, 1]
  const scale = useTransform(scrollYProgress, points, [1.25, 1.12, 1, 1, 1.12, 1.25])
  const filter = useTransform(scrollYProgress, points, ['blur(18px)', 'blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)', 'blur(18px)'])
  const opacity = useTransform(scrollYProgress, points, [0, 0.4, 1, 1, 0.4, 0])
  const y = useTransform(scrollYProgress, points, [24, 12, 0, 0, -12, -32])

  return (
    <section id="about" ref={section} className={`relative overflow-x-clip ${reduce ? 'min-h-svh' : 'h-[140svh]'}`}>
      <div className="sticky top-0 mx-auto flex h-svh max-w-site items-center justify-center px-6 py-16 text-center sm:px-8 sm:py-20">
        <motion.div
          className="mx-auto w-full max-w-5xl"
          style={reduce ? { scale: 1, filter: 'none', opacity: 1, y: 0 } : { scale, filter, opacity, y }}
        >
          <ScrollFillText
            text={t.about.statement}
            className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
