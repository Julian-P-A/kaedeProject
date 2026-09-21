import { Link, useLocation } from '@tanstack/react-router'
import { LanguageProvider } from '#/context/LanguageContext'
import { translations } from '#/data/translations'
import { DEFAULT_LANGUAGE, SITE_URL, isLanguage } from '#/lib/seo'
import { Header } from '#/components/Header'
import { Footer } from '#/components/Footer'
import { RiseReveal } from '#/components/animations/Reveal'
import { Typewriter } from '#/components/animations/Typewriter'
import { WordsReveal } from '#/components/animations/WordsReveal'

const outlineButton =
  'rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition hover:bg-white/10'

/** Rendered outside the `/$lang` route, so the language is read from the URL prefix (`/es/...`). */
export function NotFound() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const segment = pathname.split('/')[1] ?? ''
  const lang = isLanguage(segment) ? segment : DEFAULT_LANGUAGE
  const t = translations[lang]
  const command = `curl ${SITE_URL.replace('https://', '')}${pathname}`

  return (
    <LanguageProvider lang={lang}>
      <div className="flex min-h-screen flex-col bg-background">
        <title>{`${t.notFound.title.replaceAll('*', '').replace(/\.$/, '')} — Kaede Project`}</title>

        <Header />

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 pb-20 pt-32 sm:px-8">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
            {/* Top application bar, same window chrome as the hero dashboard */}
            <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <div className="min-w-0 truncate font-mono text-xs text-foreground/80 sm:text-sm">
                  <span className="mr-2 text-accent" aria-hidden="true">
                    $
                  </span>
                  <Typewriter text={command} speed={28} />
                </div>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-foreground/90">404</span>
            </div>

            <div className="flex flex-col items-center px-6 py-14 text-center sm:px-8 sm:py-20">
              <RiseReveal className="font-mono text-xs uppercase tracking-[0.25em] text-muted sm:text-sm">
                404 error
              </RiseReveal>

              <WordsReveal
                as="h1"
                text={t.notFound.title}
                className="mt-4 text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
              />

              <RiseReveal delay={0.15} className="mt-4 max-w-md text-balance text-base text-muted sm:text-lg">
                {t.notFound.description}
              </RiseReveal>

              <RiseReveal delay={0.25} className="mt-8 font-mono text-3xl text-accent sm:text-4xl">
                <span aria-hidden="true">¯\_(ツ)_/¯</span>
              </RiseReveal>

              <RiseReveal delay={0.35} className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/$lang"
                  params={{ lang }}
                  className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:brightness-95"
                >
                  {t.notFound.cta}
                </Link>
                <a href={`/${lang}#solutions`} className={outlineButton}>
                  {t.hero.ctaSecondary}
                </a>
                <a href={`/${lang}#contact`} className={outlineButton}>
                  {t.nav.cta}
                </a>
              </RiseReveal>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </LanguageProvider>
  )
}
