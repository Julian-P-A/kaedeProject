import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { OperationsDashboard } from '#/components/OperationsDashboard'

export function DigitalEcosystem() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.ecosystem.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.ecosystem.title}
        className="max-w-2xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
      />

      <div className="mt-12 sm:mt-16">
        <OperationsDashboard />
      </div>
    </section>
  )
}
