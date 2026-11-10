import { useId, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useSectionPresence } from '#/hooks/useSectionPresence'
import { WordsReveal } from '#/components/animations/WordsReveal'

const ROWS = [
  [
    { id: 'fuego-home', name: 'Fuego E-sports' },
    { id: 'celestina-home', name: 'Celestina Cosmetics' },
    { id: 'elixir-home', name: 'Elixir Parfum Colombia' },
    { id: 'kaede-home', name: 'Kaede Project' },
    { id: 'sisteviajes-home', name: 'Sisteviajes' },
  ],
  [
    { id: 'sisteviajes-services', name: 'Sisteviajes' },
    { id: 'fuego-about', name: 'Fuego E-sports' },
    { id: 'celestina-shop', name: 'Celestina Cosmetics' },
    { id: 'kaede-pricing', name: 'Kaede Project' },
    { id: 'elixir-shop', name: 'Elixir Parfum Colombia' },
  ],
]

function ProjectRow({ items, reverse = false }: {
  items: typeof ROWS[number]
  reverse?: boolean
}) {
  return (
    <div className="project-row-viewport">
      <div className={`project-row${reverse ? ' project-row-reverse' : ''}`}>
        {[false, true].map(duplicate => (
          <div key={String(duplicate)} className={`project-row-group${duplicate ? ' project-row-duplicate' : ''}`} aria-hidden={duplicate ? true : undefined}>
            {items.map(item => (
              <figure key={item.id} className="project-shot">
                <img src={`/projects/${item.id}.webp`} alt={duplicate ? '' : item.name} width={1440} height={900} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Projects() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const headingId = useId()
  const reduce = useReducedMotion()
  const presence = useSectionPresence(sectionRef)
  const visible = useInView(sectionRef, { margin: '200px' })

  return (
    <section id="projects" ref={sectionRef} aria-labelledby={headingId} data-running={visible && !reduce} className={`projects-scroll${reduce ? ' projects-static' : ''}`}>
      <div className="projects-scene">
        <motion.div className="projects-frame" style={reduce ? { opacity: 1, filter: 'none' } : presence}>
          <div id={headingId} className="projects-heading mx-auto w-full max-w-site px-6 sm:px-8">
            <WordsReveal as="h2" text={t.projectsSection.title} className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl" />
          </div>
          <div className="projects-rows">
            {ROWS.map((items, index) => <ProjectRow key={index} items={items} reverse={index === 1} />)}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
