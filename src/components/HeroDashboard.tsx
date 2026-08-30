import { motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { PopReveal, RiseReveal } from '#/components/animations/Reveal'
import { CountUp } from '#/components/animations/CountUp'

const AVATAR_COLORS = ['bg-accent', 'bg-beige', 'bg-white/20']

export function HeroDashboard() {
  const { t } = useLanguage()
  const d = t.dashboard

  return (
    <RiseReveal delay={0.5} className="relative mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
        {/* Top application bar */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <span className="hidden font-display text-sm font-medium text-foreground/80 sm:inline">
              {d.barTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
            </span>
            <span className="hidden sm:inline">{d.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden -space-x-2 sm:flex" aria-hidden="true">
              {AVATAR_COLORS.map((c, i) => (
                <span key={i} className={`h-6 w-6 rounded-full border-2 border-surface ${c}`} />
              ))}
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-foreground/90">
              {d.action}
            </span>
          </div>
        </div>

        {/* Workflow */}
        <div className="px-4 py-8 sm:px-8">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-muted">{d.flowLabel}</p>
          <div className="relative">
            <div className="absolute left-[22px] right-[22px] top-[22px] hidden h-px bg-gradient-to-r from-accent/60 via-white/15 to-white/5 sm:block" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-2">
              {d.flow.map((step, i) => (
                <PopReveal
                  key={step}
                  delay={0.15 * i}
                  className="relative z-10 flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-strong bg-surface-2 font-display text-sm font-semibold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium text-foreground/80">{step}</span>
                </PopReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard label={d.cards.leads.label} value={d.cards.leads.value} delay={0} />
          <MetricCard label={d.cards.automation.label} value={d.cards.automation.value} delay={0.08} />
          <MetricCard label={d.cards.crm.label} value={d.cards.crm.value} delay={0.16} isText />
          <MetricCard label="AI Agent" value={d.cards.ai.value} delay={0.24} pulse />
          <MetricCard label={d.cards.website.label} value={d.cards.website.value} delay={0.32} />
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] italic text-muted/70">{d.disclaimer}</p>
    </RiseReveal>
  )
}

function MetricCard({
  label,
  value,
  delay,
  isText,
  pulse,
}: {
  label: string
  value: string
  delay: number
  isText?: boolean
  pulse?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-between gap-4 bg-surface p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.15em] text-muted">{label}</span>
        {pulse && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        )}
      </div>
      {isText ? (
        <span className="font-display text-lg font-semibold text-foreground">{value}</span>
      ) : (
        <CountUp value={value} className="font-display text-2xl font-semibold text-foreground" />
      )}
    </motion.div>
  )
}
