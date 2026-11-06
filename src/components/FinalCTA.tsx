import { useLanguage } from '#/context/LanguageContext'
import { useDiagnostic } from '#/context/DiagnosticContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'

export function FinalCTA() {
  const { t } = useLanguage()
  const { openDiagnostic, ready } = useDiagnostic()

  return (
    <section id="contact" className="max-w-3xl scroll-mt-28 text-center lg:text-left">
      <WordsReveal
        as="h2"
        text={t.finalCta.title}
        className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-6xl"
      />

      <div className="mt-6">
        <RiseReveal delay={0.15} className="mx-auto max-w-xl text-balance text-base text-muted sm:text-lg lg:mx-0">
          {t.finalCta.description}
        </RiseReveal>

        <RiseReveal
          delay={0.25}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
        >
          <a
            href={t.hero.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-full rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition hover:brightness-95"
          >
            {t.finalCta.ctaPrimary}
          </a>
          <button
            type="button"
            onClick={openDiagnostic}
            disabled={!ready}
            className="max-w-full rounded-full border border-border-strong px-7 py-3.5 text-sm font-medium text-foreground transition hover:bg-white/5"
          >
            {t.finalCta.ctaSecondary}
          </button>
        </RiseReveal>
      </div>
    </section>
  )
}
