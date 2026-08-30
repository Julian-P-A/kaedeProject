import { motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'
import type { ProjectId } from '#/data/translations'

// TODO: swap in a real screenshot of this site once available.
const PROJECT_IMAGES: Record<ProjectId, { src: string; width: number; height: number } | undefined> = {
  fuego: { src: '/project-fuego.webp', width: 900, height: 506 },
  celestina: { src: '/project-celestina.webp', width: 900, height: 721 },
  leadgen: undefined,
}

export function Projects() {
  const { t } = useLanguage()

  return (
    <section id="projects" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.projectsSection.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.projectsSection.title}
        className="max-w-2xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.projectsSection.items.map((project, i) => (
          <motion.article
            key={project.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface"
          >
            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-surface-2">
              {PROJECT_IMAGES[project.id] ? (
                <img
                  src={PROJECT_IMAGES[project.id]!.src}
                  width={PROJECT_IMAGES[project.id]!.width}
                  height={PROJECT_IMAGES[project.id]!.height}
                  alt={project.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="font-display text-4xl font-semibold tracking-tight text-white/10 transition group-hover:text-white/20">
                  {project.name}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-6">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-accent">
                {project.category}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight">{project.name}</h3>
              <p className="mt-1 text-sm text-muted">{project.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
