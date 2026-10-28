import { useReducedMotion } from '#/hooks/useReducedMotion'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { ServiceCard } from '#/components/ServiceCard'
import { WindowDots } from '#/components/WindowDots'

type Phase = 'hidden' | 'show'

const EASE = [0.16, 1, 0.3, 1] as const
/** Exit is quick and simultaneous so the loop doesn't linger on an empty card. */
const EXIT = { duration: 0.35, ease: 'easeIn' } as const

/**
 * Drives a looping entrance: 'show' for `showMs` (entrance + hold), then
 * 'hidden' for `hiddenMs`, repeating while the element is on-screen.
 * Reduced motion keeps it at 'show'.
 */
function useLoopPhase(showMs = 4200, hiddenMs = 600) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: '0px' })
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('hidden')

  useEffect(() => {
    if (reduce) {
      setPhase('show')
      return
    }
    if (!inView) return
    let timer = 0
    const run = (next: Phase) => {
      setPhase(next)
      timer = window.setTimeout(() => run(next === 'show' ? 'hidden' : 'show'), next === 'show' ? showMs : hiddenMs)
    }
    run('show')
    return () => window.clearTimeout(timer)
  }, [inView, reduce, showMs, hiddenMs])

  return [ref, phase] as const
}

const backLayer: Variants = {
  hidden: (y: number) => ({ opacity: 0, y: y + 16, transition: EXIT }),
  show: (y: number) => ({ opacity: 1, y, transition: { duration: 0.6, delay: y / 80, ease: EASE } }),
}

const frontWindow: Variants = {
  hidden: { opacity: 0, y: 16, transition: EXIT },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const bar: Variants = {
  hidden: { scaleX: 0, transition: EXIT },
  show: (delay: number) => ({ scaleX: 1, transition: { duration: 0.6, delay, ease: EASE } }),
}

function BrowserLayersVisual() {
  const [ref, phase] = useLoopPhase()
  // Back layers are empty frames, centred and narrower, peeking out below the
  // front window like a deck. Solid fills keep their content from showing through.
  const backLayers = [
    { inset: '5%', y: 10, className: 'border-border-strong/70 bg-surface' },
    { inset: '10%', y: 20, className: 'border-border bg-surface-2' },
  ]
  return (
    <motion.div ref={ref} initial="hidden" animate={phase} className="flex h-full items-center pb-5">
      <div className="relative w-full">
        {backLayers.map((layer, i) => (
          <motion.div
            key={i}
            custom={layer.y}
            variants={backLayer}
            style={{ left: layer.inset, right: layer.inset, zIndex: backLayers.length - i }}
            className={`absolute inset-y-0 rounded-xl border ${layer.className}`}
          />
        ))}
        <motion.div
          variants={frontWindow}
          className="relative z-10 overflow-hidden rounded-xl border border-border-strong bg-background"
        >
          <div className="flex items-center border-b border-border px-3 py-2">
            <WindowDots className="h-1.5 w-1.5" gap="gap-1" />
          </div>
          {/* The page "builds" itself: lines and the CTA block draw in after the window lands. */}
          <div className="space-y-2 p-3">
            <motion.div custom={0.35} variants={bar} style={{ transformOrigin: 'left' }} className="h-2 w-2/3 rounded bg-white/15" />
            <motion.div custom={0.5} variants={bar} style={{ transformOrigin: 'left' }} className="h-2 w-1/2 rounded bg-white/10" />
            <motion.div custom={0.65} variants={bar} style={{ transformOrigin: 'left' }} className="mt-3 h-8 w-full rounded bg-accent/20" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const flowRow: Variants = {
  hidden: { opacity: 0, x: -16, transition: EXIT },
  show: (i: number) => ({ opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.15, ease: EASE } }),
}

const flowBar: Variants = {
  hidden: { scaleX: 0, transition: EXIT },
  show: (i: number) => ({ scaleX: 1, transition: { duration: 0.7, delay: i * 0.15 + 0.2 } }),
}

function AiFlowVisual() {
  const [ref, phase] = useLoopPhase()
  const rows = [
    { label: 'Prompt', tone: 'text-foreground/80' },
    { label: 'Processing', tone: 'text-accent' },
    { label: 'Result', tone: 'text-positive' },
  ]
  return (
    <motion.div ref={ref} initial="hidden" animate={phase} className="flex h-full flex-col justify-center gap-3">
      {rows.map((row, i) => (
        <motion.div
          key={row.label}
          custom={i}
          variants={flowRow}
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
              custom={i}
              variants={flowBar}
              style={{ transformOrigin: 'left', display: 'block', height: '100%' }}
              className="rounded-full bg-accent/70"
            />
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

const flowNode: Variants = {
  hidden: { opacity: 0, scale: 0.6, transition: EXIT },
  show: (i: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, delay: i * 0.12, ease: EASE } }),
}

const flowLink: Variants = {
  hidden: { scaleX: 0, transition: EXIT },
  show: (i: number) => ({ scaleX: 1, transition: { duration: 0.5, delay: i * 0.12 + 0.1 } }),
}

function ConnectFlowVisual() {
  const [ref, phase] = useLoopPhase()
  const nodes = ['Website', 'CRM', 'AI', 'Automation', 'Team']
  return (
    // One equal column per step, label directly under its node. Each connector
    // runs from this node's right edge to the next node's left edge
    // (node centres are one column apart; nodes are 2.25rem wide).
    <motion.div ref={ref} initial="hidden" animate={phase} className="grid h-full grid-cols-5 content-center">
      {nodes.map((n, i) => (
        <div key={n} className="relative flex flex-col items-center gap-3">
          {i < nodes.length - 1 && (
            <motion.div
              custom={i}
              variants={flowLink}
              style={{ transformOrigin: 'left', left: 'calc(50% + 1.125rem)', width: 'calc(100% - 2.25rem)' }}
              className="absolute top-[1.125rem] h-px bg-gradient-to-r from-accent/60 to-white/10"
            />
          )}
          <motion.div
            custom={i}
            variants={flowNode}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-background text-[10px] font-semibold text-accent"
          >
            {i + 1}
          </motion.div>
          <span className="text-center text-[10px] leading-tight text-muted">{n}</span>
        </div>
      ))}
    </motion.div>
  )
}

export function ServiceCards() {
  const { t } = useLanguage()
  const visuals = [<BrowserLayersVisual key="a" />, <AiFlowVisual key="b" />, <ConnectFlowVisual key="c" />]

  return (
    <section className="mx-auto max-w-site px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="grid gap-5 md:grid-cols-3">
        {t.serviceCards.map((card, i) => (
          <ServiceCard
            key={card.title}
            tag={card.tag}
            title={card.title}
            description={card.description}
            visual={visuals[i]}
            index={i}
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  )
}
