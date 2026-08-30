import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '#/context/LanguageContext'
import { Logo } from '#/components/Logo'

const easeOut = [0.16, 1, 0.3, 1] as const

export function Header() {
  const { lang, setLang, t } = useLanguage()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header id="top" className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="rounded-full border border-border bg-black/60 px-4 py-2 backdrop-blur-md"
        >
          <Logo variant="compact" />
        </motion.div>

        <motion.nav
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
          className="hidden items-center gap-1 rounded-full border border-border bg-black/60 px-2 py-2 backdrop-blur-md lg:flex"
          aria-label="Primary"
        >
          {t.nav.links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              variants={{ hidden: { opacity: 0, y: -10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="rounded-full px-4 py-2 text-sm text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
            >
              {link.label}
            </motion.a>
          ))}
        </motion.nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch lang={lang} setLang={setLang} />

          <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: easeOut }}
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-95 sm:inline-block"
          >
            {t.nav.cta}
          </motion.a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-black/60 backdrop-blur-md lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <div className="flex flex-col gap-1.5">
              <span className="block h-px w-5 bg-foreground" />
              <span className="block h-px w-5 bg-foreground" />
            </div>
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  )
}

function LanguageSwitch({ lang, setLang }: { lang: 'en' | 'es'; setLang: (l: 'en' | 'es') => void }) {
  return (
    <div
      role="group"
      aria-label="Language selector"
      className="flex items-center gap-0.5 rounded-full border border-border bg-black/60 p-1 text-xs font-medium backdrop-blur-md"
    >
      {(['en', 'es'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`rounded-full px-2.5 py-1.5 transition ${
            lang === code ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-foreground'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex flex-col bg-black lg:hidden"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <Logo variant="compact" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
            >
              <span className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-foreground" />
                <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-foreground" />
              </span>
            </button>
          </div>

          <motion.nav
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            className="flex flex-1 flex-col items-start justify-center gap-2 px-8"
            aria-label="Mobile"
          >
            {t.nav.links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="font-display text-4xl font-semibold tracking-tight"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>

          <div className="px-8 pb-10">
            <a
              href="#contact"
              onClick={onClose}
              className="block w-full rounded-full bg-accent px-5 py-4 text-center font-medium text-accent-foreground"
            >
              {t.nav.cta}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
