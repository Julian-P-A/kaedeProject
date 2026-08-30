import { motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { RiseReveal, StaggerGroup, staggerItem } from '#/components/animations/Reveal'

const ICONS = ['◆', '◇', '●', '○', '▲', '△', '■', '□']

export function Capabilities() {
  const { t } = useLanguage()

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <RiseReveal className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-accent">
        {t.capabilities.tag}
      </RiseReveal>

      <StaggerGroup className="flex flex-wrap gap-3">
        {t.capabilities.items.map((item, i) => (
          <motion.div
            key={item}
            variants={staggerItem}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-3 rounded-full border px-5 py-3 ${
              i % 3 === 0 ? 'border-accent/50 bg-accent/10' : 'border-border bg-surface'
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm text-accent">
              {ICONS[i % ICONS.length]}
            </span>
            <span className="text-sm font-medium text-foreground/90">{item}</span>
          </motion.div>
        ))}
      </StaggerGroup>
    </section>
  )
}
