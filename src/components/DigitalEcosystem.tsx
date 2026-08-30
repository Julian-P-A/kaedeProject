import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal, LineReveal } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { CursorAnimation } from '#/components/animations/CursorAnimation'

export function DigitalEcosystem() {
  const { t } = useLanguage()
  const nodes = t.ecosystem.nodes
  const points = nodes.map((_, i) => ({ x: ((i + 0.5) / nodes.length) * 100, y: 50 }))

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.ecosystem.tag}
      </RiseReveal>

      <div className="overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-14">
        <WordsReveal
          as="h2"
          text={t.ecosystem.title}
          className="max-w-2xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
        />

        <div className="relative mt-16">
          <LineReveal className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
          <CursorAnimation points={points} />

          <div className="relative flex justify-between">
            {nodes.map((node, i) => (
              <RiseReveal key={node.label} delay={i * 0.08} className="flex flex-1 flex-col items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-strong bg-background text-xs font-semibold text-accent sm:h-16 sm:w-16">
                  {node.label.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-foreground/80 sm:text-sm">{node.label}</span>
                <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-positive">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                  {node.status}
                </span>
              </RiseReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
