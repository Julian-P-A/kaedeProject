import { useId, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { useReducedMotion } from '#/hooks/useReducedMotion'
import { AsciiVideo } from '#/components/animations/AsciiVideo'
import { ASCII_MEDIA } from '#/data/ascii'
import { WordsReveal } from '#/components/animations/WordsReveal'
import type { Translations } from '#/data/translations'

const EASE = [0.16, 1, 0.3, 1] as const
const SERVICE_ARTWORK = [ASCII_MEDIA.web, ASCII_MEDIA.ai, ASCII_MEDIA.automation, ASCII_MEDIA.crm] as const
type Service = Translations['services'][number]

function ServiceCopy({ service }: { service: Service }) {
  return (
    <>
      <WordsReveal as="h3" text={service.title.replace(/ (\S+)$/, ' *$1*')} className="solution-title text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl" />
      <p className="solution-description text-base leading-relaxed text-muted sm:text-lg">{service.headline}</p>
      <ul className="solution-details">
        {service.items.map(item => <li key={item} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground/75 transition hover:border-border-strong hover:text-foreground">{item}</li>)}
      </ul>
      <div className="solution-actions">
        <a href={service.whatsappUrl} target="_blank" rel="noopener noreferrer" className="max-w-full rounded-full bg-accent px-7 py-3.5 text-center text-sm font-medium text-accent-foreground transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{service.cta}</a>
      </div>
    </>
  )
}

function smoothStep(value: number) {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

function SolutionArtwork({ index, scroll, reduce, load }: { index: number; scroll: MotionValue<number>; reduce: boolean; load: boolean }) {
  const local = useTransform(scroll, value => value * SERVICE_ARTWORK.length - index)
  const opacity = useTransform(local, value => {
    const entry = index === 0 ? 1 : smoothStep((value + 0.18) / 0.36)
    const exit = index === SERVICE_ARTWORK.length - 1 ? 1 : 1 - smoothStep((value - 0.82) / 0.36)
    return entry * exit
  })
  const progress = useTransform(local, value => {
    // Entry/exit glyph dispersion is already part of the exported video.
    const start = index === 0 ? 0 : -0.18
    const end = index === SERVICE_ARTWORK.length - 1 ? 1 : 1.18
    return Math.max(0, Math.min(1, (value - start) / (end - start)))
  })

  return (
    <motion.div className="solutions-art-layer" data-artwork={index} style={{ opacity: reduce ? 1 : opacity }}>
      <div className="solutions-renaissance">
        <AsciiVideo
          asset={SERVICE_ARTWORK[index]}
          load={load}
          progress={reduce ? undefined : progress}
          className="w-full text-foreground"
        />
      </div>
    </motion.div>
  )
}

export function Solutions() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const contentId = useId()
  const [active, setActive] = useState(0)
  const { services } = t
  const { scrollYProgress: containerProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const scrollYProgress = useTransform(containerProgress, value => {
    const element = section.current
    const scene = element?.querySelector<HTMLElement>('.solutions-scene')
    if (!element || !scene) return value
    const viewport = element.ownerDocument.defaultView?.innerHeight ?? scene.offsetHeight
    const serviceRange = (services.length + 1) * scene.offsetHeight - viewport
    // The extra viewport belongs to the incoming pricing layer. Finish all
    // four services first, then hold the final frame while prices cover it.
    return Math.max(0, Math.min(1, value * (element.offsetHeight - viewport) / Math.max(1, serviceRange)))
  })
  const artworkScroll = useSpring(scrollYProgress, { stiffness: 160, damping: 22, mass: 0.7, restDelta: 0.0001, restSpeed: 0.0001 })
  const { scrollYProgress: presence } = useScroll({ target: section, offset: ['start end', 'end start'] })
  // Keep the entire pinned interval sharp; only the first/last viewport changes focus.
  const span = services.length + 2
  const focus = [0, 0.4 / span, 0.8 / span, 1 - 0.8 / span, 1 - 0.4 / span, 1]
  const scale = useTransform(presence, focus, [1.25, 1.12, 1, 1, 1.12, 1.25])
  const filter = useTransform(presence, focus, ['blur(18px)', 'blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)', 'blur(18px)'])
  const opacity = useTransform(presence, focus, [0, 0.4, 1, 1, 0.4, 0])
  const y = useTransform(presence, focus, [24, 12, 0, 0, -12, -32])

  useMotionValueEvent(artworkScroll, 'change', (progress) => {
    if (reduce) return
    const next = Math.max(0, Math.min(services.length - 1, Math.floor(progress * services.length)))
    setActive((current) => current === next ? current : next)
  })

  return (
    <section id="solutions" ref={section} className={`solutions-scroll${reduce ? ' solutions-static' : ''}`} aria-labelledby={`${contentId}-heading`} data-active-service={active + 1}>
      <div className="solutions-scene">
        <motion.div
          className="solutions-frame mx-auto w-full max-w-site px-6 sm:px-8"
          style={reduce ? { scale: 1, filter: 'none', opacity: 1, y: 0 } : { scale, filter, opacity, y }}
        >
          <h2 id={`${contentId}-heading`} className="sr-only">{t.solutionsIntro.title.replaceAll('*', '')}</h2>
          <div className="solutions-layout">
            <div className="solutions-art" aria-hidden="true">
              {SERVICE_ARTWORK.map((src, index) => (!reduce || index === 0) && (
                <SolutionArtwork key={src.src} index={index} scroll={artworkScroll} reduce={reduce} load={Math.abs(index - active) <= 1} />
              ))}
            </div>
            <div id={contentId} className="solutions-copy">
              {services.map((service, index) => {
                const current = index === active
                return (
                  <motion.article
                    key={service.number}
                    className="solution-panel"
                    aria-hidden={reduce ? undefined : !current}
                    inert={!reduce && !current}
                    initial={false}
                    animate={reduce || current ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: index < active ? -24 : 24, filter: 'blur(10px)' }}
                    transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
                    style={{ pointerEvents: reduce || current ? 'auto' : 'none' }}
                    data-service={service.number}
                  >
                    <ServiceCopy service={service} />
                  </motion.article>
                )
              })}
            </div>
          </div>
        </motion.div>
        <motion.div className="solutions-progress" style={reduce ? undefined : { opacity, filter }}>
          <span className="solutions-count" aria-label={`${t.solutionsIntro.navigationLabel}: ${services[active].title}`}><span>{services[active].number}</span> / {String(services.length).padStart(2, '0')}</span>
        </motion.div>
      </div>
    </section>
  )
}
