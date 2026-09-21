import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'

export function Faq() {
  const { t } = useLanguage()

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.faq.tag}
      </RiseReveal>

      <WordsReveal
        as="h2"
        text={t.faq.title}
        className="mb-10 text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
      />

      <div className="divide-y divide-border border-y border-border">
        {t.faq.items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
              <h3 className="text-inherit">{item.question}</h3>
              <span
                aria-hidden="true"
                className="text-xl text-accent transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-base text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
