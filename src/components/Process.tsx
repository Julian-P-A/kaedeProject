import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useSectionPresence } from '#/hooks/useSectionPresence'
import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { AsciiPhoto } from '#/components/animations/AsciiPhoto'
import type { ProcessStage } from '#/data/translations'

const PHOTOS: Record<ProcessStage['id'], { src: string; position: number }> = {
  brief: { src: '/process/meeting.webp', position: 0.5 },
  scope: { src: '/process/define.webp', position: 0.5 },
  design: { src: '/process/design-figma.webp', position: 0.5 },
  build: { src: '/process/build.webp', position: 0.45 },
  launch: { src: '/process/discover.webp', position: 0.25 },
}

function ProcessPhoto({ stage, index, phase, current }: {
  stage: ProcessStage
  index: number
  phase: MotionValue<number>
  current: boolean
}) {
  const photo = PHOTOS[stage.id]
  const x = useTransform(phase, value => `${(index - value) * 125}%`)
  const y = useTransform(phase, value => `${(index - value) * 125}%`)
  const opacity = useTransform(phase, [index - 1.4, index - 0.85, index + 0.65, index + 1.25], [0, 1, 1, 0])

  return (
    <motion.div className="process-photo-layer" data-photo-stage={stage.id} aria-hidden={!current} style={{ x, y, opacity }}>
      <AsciiPhoto src={photo.src} position={photo.position} alt={current ? stage.title : ''} />
    </motion.div>
  )
}

export function Process() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const contentId = useId()
  const headingId = useId()
  const reduce = useReducedMotion()
  const presence = useSectionPresence(sectionRef)
  const [compact, setCompact] = useState(false)
  const [active, setActive] = useState(0)
  const { stages } = t.process
  const activeIndex = Math.min(active, stages.length - 1)
  const stage = stages[activeIndex]
  const photo = PHOTOS[stage.id]
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const phase = useTransform(scrollYProgress, progress => Math.max(0, Math.min(stages.length - 1, progress * stages.length - 0.5)))

  useEffect(() => {
    const query = window.matchMedia('(max-height: 540px) and (min-width: 640px)')
    const update = () => setCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (reduce || compact) return
    const next = Math.max(0, Math.min(stages.length - 1, Math.floor(progress * stages.length)))
    if (next !== active) setActive(next)
  })

  function selectStage(index: number) {
    if (reduce || compact || !sectionRef.current) {
      setActive(index)
      return
    }
    const bounds = sectionRef.current.getBoundingClientRect()
    const progress = (index + 0.5) / stages.length
    window.scrollTo({
      top: window.scrollY + bounds.top + (bounds.height - window.innerHeight) * progress,
      behavior: 'smooth',
    })
  }

  return (
    <section id="process" ref={sectionRef} aria-labelledby={headingId} data-pinned={!reduce && !compact} className={`process-scroll relative scroll-mt-0${reduce || compact ? ' process-static' : ''}`}>
      <div className="process-scene">
        <motion.div className="process-frame mx-auto w-full max-w-site px-6 sm:px-8" style={reduce ? { opacity: 1, filter: 'none' } : presence}>
          <div className="process-layout" data-stage={stage.id}>
            <div id={headingId} className="process-heading-wrap">
              <WordsReveal as="h2" text={t.process.title} className="process-heading text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl" />
            </div>

            <div className="process-rail">
              <ol className="process-stages" aria-label={t.process.title.replaceAll('*', '')}>
                {stages.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-label={`${index + 1}. ${item.title}`}
                      aria-current={index === activeIndex ? 'step' : undefined}
                      aria-controls={contentId}
                      onClick={() => selectStage(index)}
                    >
                      <span className="process-stage-marker" aria-hidden="true" />
                      <span className="process-stage-label">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <span className="process-step-index" aria-hidden="true">
                <span className="process-step-current">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span>/</span>
                <span className="process-step-total">{String(stages.length).padStart(2, '0')}</span>
              </span>
            </div>

            <figure id={contentId} className="process-art" aria-label={stage.title}>
              {reduce || compact ? (
                <div className="process-photo-layer" data-photo-stage={stage.id}>
                  <AsciiPhoto src={photo.src} position={photo.position} alt={stage.title} />
                </div>
              ) : stages.map((item, index) => (
                <ProcessPhoto key={item.id} stage={item} index={index} phase={phase} current={index === activeIndex} />
              ))}
            </figure>

            <div className="process-caption">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={stage.id}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                >
                  <h3 className="process-caption-title font-display text-base font-semibold tracking-tight sm:text-lg">{stage.title}</h3>
                  <p className="process-stage-description text-base leading-relaxed text-muted sm:text-lg">{stage.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
