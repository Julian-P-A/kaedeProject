import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { AsciiVideo } from '#/components/animations/AsciiVideo'
import { useReducedMotion } from '#/hooks/useReducedMotion'

export function Hero() {
  const { t } = useLanguage()
  const section = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const points = [0, 0.14, 0.28, 0.72, 0.86, 1]
  const scale = useTransform(scrollYProgress, points, [1.08, 1.04, 1, 1, 1.04, 1.08])
  const filter = useTransform(scrollYProgress, points, ['blur(18px)', 'blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)', 'blur(18px)'])
  const opacity = useTransform(scrollYProgress, points, [0, 0.4, 1, 1, 0.4, 0])
  const y = useTransform(scrollYProgress, points, [24, 12, 0, 0, -12, -32])

  return (
    <section ref={section} className="relative isolate min-h-dvh overflow-hidden">
      <motion.div style={reduce ? { scale: 1, filter: 'none', opacity: 1, y: 0 } : { scale, filter, opacity, y }}>
        <motion.div
          className="relative isolate flex min-h-dvh flex-col justify-center pb-16 pt-28 sm:pt-32 md:pb-20"
          initial={reduce ? false : { scale: 1.08, filter: 'blur(18px)', y: 24 }}
          animate={{ scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* A full statue behind the mobile copy; cropped from the right on desktop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[58%] -z-10 w-[140%] -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_bottom,black_85%,transparent)] md:left-auto md:-right-[46%] md:w-[110%] md:translate-x-0 lg:-right-[30%] lg:w-full"
          >
            <AsciiVideo src="/ascii/creation" mobileSrc="/ascii/creation-mobile" className="w-full text-foreground opacity-60" />
          </div>

          <div className="relative mx-auto w-full max-w-site px-6 sm:px-8">
            <div className="max-w-2xl text-center md:max-w-[60%] md:text-left lg:max-w-[48%]">
              <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                {t.hero.eyebrow}
              </p>

              <WordsReveal
                as="h1"
                text={t.hero.title}
                className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              />

              <p
                className="animate-fade-up mt-6 text-balance text-base text-muted sm:text-lg"
                style={{ animationDelay: '150ms' }}
              >
                {t.hero.description}
              </p>

              <div
                className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start"
                style={{ animationDelay: '250ms' }}
              >
                <a
                  href={t.hero.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-full rounded-full bg-accent px-7 py-3.5 text-center text-sm font-medium text-accent-foreground transition hover:brightness-95"
                >
                  {t.hero.ctaPrimary}
                </a>
                <a
                  href="#solutions"
                  className="max-w-full rounded-full border border-border-strong px-7 py-3.5 text-center text-sm font-medium text-foreground transition hover:bg-white/5"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
