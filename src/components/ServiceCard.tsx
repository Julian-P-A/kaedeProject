import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { AsciiField } from '#/components/animations/AsciiField'
import { BLUR_IN, FOCUSED } from '#/components/animations/Reveal'

export function ServiceCard({
  tag,
  title,
  description,
  visual,
  index = 0,
  delay = 0,
}: {
  tag: string
  title: string
  description: string
  visual: ReactNode
  /** Position in the row; offsets the ASCII backdrop so cards don't move in sync. */
  index?: number
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: BLUR_IN }}
      whileInView={{ opacity: 1, y: 0, ...FOCUSED }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <div className="relative isolate h-56 overflow-hidden border-b border-border bg-surface-2 p-5 sm:h-64">
        {/* Faint shifting ASCII backdrop, faded toward the centre so the visual stays clear. */}
        <AsciiField
          seed={index}
          className="absolute inset-0 -z-10 block h-full w-full text-foreground/[0.09] [mask-image:radial-gradient(ellipse_at_center,transparent_15%,black_75%)]"
        />
        {visual}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{tag}</span>
        <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </motion.div>
  )
}
