import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal, StaggerGroup, staggerItem } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { motion } from 'framer-motion'

export function Solutions() {
  const { t } = useLanguage()

  return (
    <section id="solutions" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.solutionsIntro.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.solutionsIntro.title}
        className="max-w-3xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
      />

      <RiseReveal delay={0.15} className="mt-6 max-w-2xl text-balance text-base text-muted sm:text-lg">
        {t.solutionsIntro.description}
      </RiseReveal>

      <div className="mt-16 divide-y divide-border border-t border-border">
        {t.services.map((service) => (
          <div key={service.number} className="grid gap-6 py-10 sm:grid-cols-[auto_1fr] sm:gap-12">
            <RiseReveal className="flex items-baseline gap-4 sm:flex-col sm:items-start sm:gap-2">
              <span className="font-display text-sm text-muted">{service.number}</span>
              <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{service.title}</h3>
            </RiseReveal>

            <div>
              <RiseReveal delay={0.05} className="max-w-xl text-balance text-base text-foreground/85 sm:text-lg">
                {service.headline}
              </RiseReveal>

              <StaggerGroup className="mt-5 flex flex-wrap gap-2">
                {service.items.map((item) => (
                  <motion.span
                    key={item}
                    variants={staggerItem}
                    className="rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground/75 transition hover:border-border-strong hover:text-foreground"
                  >
                    {item}
                  </motion.span>
                ))}
              </StaggerGroup>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
