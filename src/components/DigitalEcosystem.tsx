import { useLanguage } from '#/context/LanguageContext'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { OperationsDashboard } from '#/components/OperationsDashboard'

export function DigitalEcosystem() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-site px-6 py-24 sm:px-8 sm:py-32">
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
