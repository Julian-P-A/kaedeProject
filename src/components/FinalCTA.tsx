import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'

export function FinalCTA() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.finalCta.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.finalCta.title}
        className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-6xl"
      />

      <RiseReveal delay={0.15} className="mx-auto mt-6 max-w-xl text-balance text-base text-muted sm:text-lg">
        {t.finalCta.description}
      </RiseReveal>

      <RiseReveal
        delay={0.25}
        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <button
          type="button"
          className="w-full rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition hover:brightness-95 sm:w-auto"
        >
          {t.finalCta.ctaPrimary}
        </button>
        <button
          type="button"
          className="w-full rounded-full border border-border-strong px-7 py-3.5 text-sm font-medium text-foreground transition hover:bg-white/5 sm:w-auto"
        >
          {t.finalCta.ctaSecondary}
        </button>
      </RiseReveal>
    </section>
  )
}
