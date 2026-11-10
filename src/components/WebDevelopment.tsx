import { useEffect, useId, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { useDiagnostic } from '#/context/DiagnosticContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { useReducedMotion } from '#/hooks/useReducedMotion'

export function WebDevelopment() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const [pinned, setPinned] = useState(false)
  const [span, setSpan] = useState(2.4)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const points = [0, 0.4 / span, 0.8 / span, 1 - 0.8 / span, 1 - 0.4 / span, 1]
  const scale = useTransform(scrollYProgress, points, [1.25, 1.12, 1, 1, 1, 1])
  const filter = useTransform(scrollYProgress, points, ['blur(18px)', 'blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'])
  const opacity = useTransform(scrollYProgress, points, [0, 0.4, 1, 1, 0.4, 0])
  const y = useTransform(scrollYProgress, points, [24, 12, 0, 0, -12, -32])

  useEffect(() => {
    const element = frame.current
    if (!element) return
    // Pin only when every price and CTA fits. Narrow or short screens retain
    // native scrolling, including after rotation, zoom or a font-size change.
    const measure = () => {
      const fits = !reduce && window.matchMedia('(min-width: 64rem)').matches && element.offsetHeight <= window.innerHeight
      setPinned(fits)
      // Keep entrance/exit within one viewport even when mobile stacks the
      // four cards into a long section. Its heading must arrive fully sharp.
      setSpan(1 + (fits ? window.innerHeight * 1.4 : element.offsetHeight) / window.innerHeight)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [reduce])

  return (
    <section id="pricing" ref={section} className="pricing-section" data-pinned={pinned} aria-labelledby={headingId}>
      <div className="pricing-scene">
        <motion.div ref={frame} className="pricing-frame mx-auto w-full max-w-site px-6 sm:px-8" style={reduce ? { scale: 1, filter: 'none', opacity: 1, y: 0 } : { scale, filter, opacity, y }}>
          <div id={headingId}>
            <WordsReveal
              as="h2"
              text={t.webDev.title}
              className="mx-auto w-full max-w-3xl text-balance text-center font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
            />
          </div>

          <div className="pricing-grid mt-14 grid gap-5 lg:grid-cols-4">
            {t.webDev.options.map((option, i) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col justify-between rounded-3xl border p-6 ${
                  option.id === 'custom' ? 'border-accent/40 bg-surface-2' : 'border-border bg-surface'
                }`}
              >
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{option.name}</h3>
                  <p className="mt-3 font-display text-3xl font-semibold text-accent">{option.price}</p>
                  <p className="mt-4 text-sm text-muted">{option.description}</p>

                  <div className="mt-6">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted/80">
                      {t.webDev.bestForLabel}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {option.bestFor.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href={option.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 block w-full rounded-full border border-border-strong px-4 py-3 text-center text-sm font-medium text-foreground transition hover:bg-white/5"
                >
                  {option.cta}
                </a>
              </motion.div>
            ))}
          </div>

          <PricingSummary />
        </motion.div>
      </div>
    </section>
  )
}

function PricingSummary() {
  const { t } = useLanguage()
  const { openDiagnostic, ready } = useDiagnostic()

  return (
    <RiseReveal delay={0.1} className="mt-10 overflow-hidden rounded-3xl bg-beige text-beige-foreground">
      <div className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:p-10 sm:text-left">
        <p className="max-w-md text-sm text-beige-foreground/70">{t.pricing.diagnosticPrompt}</p>
        <button
          type="button"
          onClick={openDiagnostic}
          disabled={!ready}
          className="w-full shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-95 sm:w-auto"
        >
          {t.pricing.diagnosticCta}
        </button>
      </div>
    </RiseReveal>
  )
}
