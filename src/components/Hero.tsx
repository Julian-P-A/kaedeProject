import { useLanguage } from '#/context/LanguageContext'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { HeroDashboard } from '#/components/HeroDashboard'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(215,255,92,0.08),transparent_60%)]" />

      <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
        <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {t.hero.eyebrow}
        </p>

        <WordsReveal
          as="h1"
          text={t.hero.title}
          className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        />

        {/* Plain CSS animation (not Framer Motion): this is the LCP element on
            most viewports, so it must not wait on JS hydration to become visible. */}
        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-base text-muted sm:text-lg"
          style={{ animationDelay: '150ms' }}
        >
          {t.hero.description}
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '250ms' }}
        >
          <a
            href={t.hero.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition hover:brightness-95 sm:w-auto"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#solutions"
            className="w-full rounded-full border border-border-strong px-7 py-3.5 text-sm font-medium text-foreground transition hover:bg-white/5 sm:w-auto"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>

      <div className="mt-16 px-5 sm:mt-20 sm:px-8">
        <HeroDashboard />
      </div>
    </section>
  )
}
