import { motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { ServiceCard } from '#/components/ServiceCard'

function BrowserLayersVisual() {
  const offsets = [
    { x: 0, y: 0, w: '100%', opacity: 1 },
    { x: 14, y: 14, w: '92%', opacity: 0.7 },
    { x: 28, y: 28, w: '84%', opacity: 0.45 },
  ]
  return (
    <div className="relative h-full w-full">
      {offsets.map((o, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: o.y + 16 }}
          whileInView={{ opacity: o.opacity, y: o.y }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{ left: o.x, width: o.w, zIndex: offsets.length - i }}
          className="absolute top-0 overflow-hidden rounded-xl border border-border-strong bg-background"
        >
          <div className="flex items-center gap-1 border-b border-border px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
          <div className="space-y-2 p-3">
            <div className="h-2 w-2/3 rounded bg-white/15" />
            <div className="h-2 w-1/2 rounded bg-white/10" />
            <div className="mt-3 h-8 w-full rounded bg-accent/20" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function AiFlowVisual() {
  const rows = [
    { label: 'Prompt', tone: 'text-foreground/80' },
    { label: 'Processing', tone: 'text-accent' },
    { label: 'Result', tone: 'text-positive' },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {rows.map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
        >
          <span
            className={`relative flex h-2 w-2 shrink-0 ${row.label === 'Processing' ? 'animate-pulse' : ''}`}
          >
            <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-white/30' : i === 1 ? 'bg-accent' : 'bg-positive'}`} />
          </span>
          <span className={`text-xs font-medium uppercase tracking-[0.15em] ${row.tone}`}>{row.label}</span>
          <span className="ml-auto h-1.5 flex-1 max-w-[80px] rounded-full bg-white/10">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 + 0.2 }}
              style={{ transformOrigin: 'left', display: 'block', height: '100%' }}
              className="rounded-full bg-accent/70"
            />
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function ConnectFlowVisual() {
  const nodes = ['Website', 'CRM', 'AI', 'Automation', 'Team']
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between">
        {nodes.map((n, i) => (
          <div key={n} className="flex flex-1 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.4, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-background text-[10px] font-semibold text-accent"
            >
              {i + 1}
            </motion.div>
            {i < nodes.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 + 0.1 }}
                style={{ transformOrigin: 'left' }}
                className="h-px flex-1 bg-gradient-to-r from-accent/60 to-white/10"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex w-full justify-between text-[10px] text-muted">
        {nodes.map((n) => (
          <span key={n} className="w-9 shrink-0 text-center">
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ServiceCards() {
  const { t } = useLanguage()
  const visuals = [<BrowserLayersVisual key="a" />, <AiFlowVisual key="b" />, <ConnectFlowVisual key="c" />]

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="grid gap-5 md:grid-cols-3">
        {t.serviceCards.map((card, i) => (
          <ServiceCard
            key={card.title}
            tag={card.tag}
            title={card.title}
            description={card.description}
            visual={visuals[i]}
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  )
}
