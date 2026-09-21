import { useState } from 'react'
import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'

export function Faq() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        {t.faq.items.map((item, i) => {
          const open = openIndex === i

          return (
            <div key={item.question}>
              <h3>
                <button
                  type="button"
                  id={`faq-question-${i}`}
                  aria-expanded={open}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold tracking-tight"
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className={`text-xl text-accent transition-transform duration-300 ease-out motion-reduce:transition-none ${
                      open ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>

              {/* The answer stays in the DOM (crawlable); a 0fr→1fr grid row animates its height smoothly. */}
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                inert={!open}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-3xl pb-5 text-base text-muted">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
