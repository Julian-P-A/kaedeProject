import { motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal, StaggerGroup, staggerItem } from '#/components/animations/Reveal'
import { WordsReveal } from '#/components/animations/WordsReveal'
import { Typewriter } from '#/components/animations/Typewriter'

const CODE_LINES = [
  'const project = await kaede.plan(brief)',
  'const system = connect([web, crm, ai, automation])',
  'system.deploy({ monitored: true })',
]

export function Process() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.process.tag}
      </RiseReveal>

      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <WordsReveal
            as="h2"
            text={t.process.title}
            className="max-w-lg text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
          />

          <StaggerGroup className="mt-12 space-y-1">
            {t.process.stages.map((stage) => (
              <motion.div
                key={stage.number}
                variants={staggerItem}
                className="flex items-center gap-5 border-b border-border py-4 last:border-none"
              >
                <span className="font-display text-sm text-muted">{stage.number}</span>
                <span className="font-display text-lg font-medium tracking-tight">{stage.title}</span>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>

        <RiseReveal delay={0.15} className="overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-3 text-xs text-muted">kaede.system.ts</span>
          </div>
          <div className="space-y-3 p-6 font-mono text-xs sm:text-sm">
            {CODE_LINES.map((line, i) => (
              <div key={line} className="text-foreground/80">
                <span className="mr-2 select-none text-muted/50">{i + 1}</span>
                {i === CODE_LINES.length - 1 ? <Typewriter text={line} /> : line}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
            {['Web', 'CRM', 'AI'].map((label) => (
              <div key={label} className="flex items-center gap-2 bg-surface px-4 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                <span className="text-xs text-foreground/70">{label}</span>
              </div>
            ))}
          </div>
        </RiseReveal>
      </div>
    </section>
  )
}
