import { motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'

export function WebDevelopment() {
  const { t } = useLanguage()

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.webDev.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.webDev.title}
        className="max-w-3xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-4">
        {t.webDev.options.map((option, i) => (
          <motion.div
            key={option.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col justify-between rounded-3xl border p-6 ${
              option.id === 'custom' ? 'border-accent/40 bg-surface-2' : 'border-border bg-surface'
            }`}
          >
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">{option.name}</h3>
              <p className="mt-3 font-display text-3xl font-semibold text-accent">{option.price}</p>
              <p className="mt-4 text-sm text-muted">{option.description}</p>

              <div className="mt-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted/80">
                  {t.webDev.bestForLabel}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {option.bestFor.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={option.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full rounded-full border border-border-strong px-4 py-3 text-center text-sm font-medium text-foreground transition hover:bg-white/5"
            >
              {option.cta}
            </a>
          </motion.div>
        ))}
      </div>

      <PricingSummary />
    </section>
  )
}

function PricingSummary() {
  const { t } = useLanguage()

  return (
    <RiseReveal delay={0.1} className="mt-10 overflow-hidden rounded-3xl bg-beige text-beige-foreground">
      <div className="flex flex-col gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">{t.pricing.heading}</h3>
          <p className="mt-2 max-w-md text-sm text-beige-foreground/70">{t.pricing.note}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          {t.webDev.options.map((option) => (
            <div key={option.name}>
              <p className="text-xs uppercase tracking-[0.12em] text-beige-foreground/60">{option.name}</p>
              <p className="mt-1 font-display text-lg font-semibold">{option.price}</p>
            </div>
          ))}
        </div>
      </div>
    </RiseReveal>
  )
}
