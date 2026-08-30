import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'

export function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.about.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.about.statement}
        className="text-balance font-display text-2xl font-semibold leading-tight tracking-tight sm:text-4xl"
      />

      <RiseReveal delay={0.15} className="mx-auto mt-6 max-w-xl text-balance text-base text-muted sm:text-lg">
        {t.about.supporting}
      </RiseReveal>
    </section>
  )
}
