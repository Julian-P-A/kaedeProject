import { useState } from 'react'
import { useLanguage } from '#/context/LanguageContext'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { AsciiVideo } from '#/components/animations/AsciiVideo'

export function Faq() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="mx-auto w-full max-w-site scroll-mt-28 px-6 py-24 sm:px-8 sm:py-32">
      <div className="faq-layout">
        <div className="faq-intro">
          <WordsReveal
            as="h2"
            text={t.faq.title}
            className="max-w-xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
          />
          <div className="faq-book" aria-hidden="true">
            {/* The clip includes both directions so looping never resets the playhead visibly. */}
            <AsciiVideo src="/ascii/faq-book" />
          </div>
        </div>

        <div className="faq-list min-w-0 divide-y divide-border border-y border-border">
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
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-base font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-lg"
                  >
                    <span>{item.question}</span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ease-out motion-reduce:transition-none ${
                        open ? 'rotate-45' : ''
                      }`}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
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
                    <p className="max-w-3xl pb-5 text-base leading-relaxed text-muted sm:text-lg">{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
