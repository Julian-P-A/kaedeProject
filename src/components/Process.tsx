import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { AsciiField } from '#/components/animations/AsciiField'
import { WindowDots } from '#/components/WindowDots'
import { ProcessDiagram } from '#/components/ProcessDiagram'

export function Process() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const diagramId = useId()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { stages } = t.process
  const stage = stages[active]
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (reduce) return
    const next = Math.max(0, Math.min(stages.length - 1, Math.floor(progress * stages.length)))
    if (next !== active) setActive(next)
  })

  function selectStage(index: number) {
    if (reduce || !sectionRef.current) {
      setActive(index)
      return
    }
    const bounds = sectionRef.current.getBoundingClientRect()
    // Land inside a step's scroll interval, away from a rounding boundary.
    const progress = (index + 0.15) / stages.length
    window.scrollTo({
      top: window.scrollY + bounds.top + (bounds.height - window.innerHeight) * progress,
      behavior: 'smooth',
    })
  }

  return (
    <section id="process" ref={sectionRef} className="process-scroll relative scroll-mt-0">
      <div className="process-scene">
        <div className="mx-auto w-full max-w-site px-5 sm:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">{t.process.tag}</p>

          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14">
            <div>
              <WordsReveal
                as="h2"
                text={t.process.title}
                className="max-w-lg text-balance font-display text-2xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              />

              <ol className="mt-5 grid grid-cols-6 gap-2 lg:mt-8 lg:block lg:space-y-1">
                {stages.map((item, index) => {
                  const current = index === active
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-label={`${index + 1}. ${item.title}`}
                        aria-current={current ? 'step' : undefined}
                        aria-controls={diagramId}
                        onClick={() => selectStage(index)}
                        className={`group relative isolate flex min-h-[44px] w-full items-start gap-4 overflow-hidden px-2 py-2.5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:px-4 lg:py-3 ${
                          current
                            ? 'text-accent'
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        <span className="mx-auto pt-0.5 font-mono text-sm lg:mx-0">{String(index + 1).padStart(2, '0')}</span>
                        <span className="hidden flex-1 lg:block">
                          <span className="font-display text-lg font-medium tracking-tight">{item.title}</span>
                          <span className={`grid transition-[grid-template-rows,opacity] duration-300 ${current ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <span className="overflow-hidden">
                              <span className="block max-w-md pt-2 text-sm leading-relaxed text-muted">{item.description}</span>
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>

              <div className="mt-4 min-h-20 lg:hidden">
                <h3 className="text-lg font-medium text-accent">{stage.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{stage.description}</p>
              </div>

            </div>

            <figure id={diagramId} className="min-w-0 overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="flex items-center border-b border-border px-4 py-3 sm:px-5 sm:py-4">
                <WindowDots />
                <span className="ml-3 font-mono text-xs text-muted">kaede.{stage.id}</span>
                <span className="ml-auto font-mono text-xs text-muted"><span className="text-accent">{String(active + 1).padStart(2, '0')}</span> / {String(stages.length).padStart(2, '0')}</span>
              </div>

              <div className="relative isolate grid overflow-hidden bg-surface-2">
                <AsciiField
                  seed={4}
                  className="pointer-events-none absolute inset-0 -z-10 block h-full w-full text-foreground/[0.09] [mask-image:radial-gradient(ellipse_at_center,transparent_15%,black_75%)]"
                />
                <AnimatePresence initial={false}>
                  <motion.div
                    key={stage.id}
                    className="min-w-0 [grid-area:1/1]"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProcessDiagram stage={stage} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <figcaption className="flex min-h-16 items-center gap-3 border-t border-border px-4 py-3 sm:px-5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-xs leading-relaxed text-foreground/75">{stage.deliverable}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
