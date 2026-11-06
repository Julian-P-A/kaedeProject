import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { Link, useLocation } from '@tanstack/react-router'
import { useLanguage } from '#/context/LanguageContext'
import { Logo } from '#/components/Logo'
import { useHydrated } from '#/hooks/useHydrated'
import { CONTACT_EMAIL } from '#/lib/contact'
import { FloatingWhatsApp } from '#/components/FloatingWhatsApp'

const easeOut = [0.16, 1, 0.3, 1] as const
const HEADER_ROW_CLASS = 'mx-auto flex h-20 w-full max-w-site shrink-0 items-center justify-between px-6 sm:px-8'

/** Prefix for in-page anchors: empty on the home page, `/<lang>` elsewhere (e.g. the 404 page) so they still reach the right section. */
function useHomePath() {
  const { lang } = useLanguage()
  const pathname = useLocation({ select: (location) => location.pathname })
  return /^\/(en|es)\/?$/.test(pathname) ? '' : `/${lang}`
}

export function Header() {
  const { lang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const home = useHomePath()
  const hydrated = useHydrated()

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <header id="top" className="fixed inset-x-0 top-0 z-50">
        <div className={HEADER_ROW_CLASS}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="shrink-0"
          >
            <Logo href={`${home}#top`} />
          </motion.div>

          <div className="flex items-center gap-3">
            <LanguageSwitch lang={lang} />

            <motion.a
              href={`${home}#contact`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: easeOut }}
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-95 sm:inline-block"
            >
              {t.nav.cta}
            </motion.a>
          </div>
        </div>

        <Dialog.Trigger asChild>
          <button
            type="button"
            disabled={!hydrated}
            aria-label="Open menu"
            className="site-floating-left fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] flex min-h-[44px] min-w-[44px] items-center font-display text-lg font-medium tracking-tight text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent [text-shadow:0_1px_8px_rgb(0_0_0/70%)]"
          >
            {lang === 'es' ? 'Menú' : 'Menu'}
          </button>
        </Dialog.Trigger>

        <MobileMenu open={open} onClose={() => setOpen(false)} home={home} />
      </header>
    </Dialog.Root>
  )
}

function LanguageSwitch({ lang }: { lang: 'en' | 'es' }) {
  return (
    <div
      role="group"
      aria-label="Language selector"
      className="flex items-center gap-0.5 text-xs font-medium"
    >
      {(['en', 'es'] as const).map((code) => (
        <Link
          key={code}
          to="/$lang"
          params={{ lang: code }}
          hrefLang={code}
          aria-current={lang === code ? 'page' : undefined}
          className={`rounded-full px-2.5 py-1.5 transition ${
            lang === code ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-foreground'
          }`}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

function MobileMenu({ open, onClose, home }: { open: boolean; onClose: () => void; home: string }) {
  const { lang, t } = useLanguage()
  const links = [{ label: t.nav.home, href: '#top' }, ...t.nav.links]

  return (
    <Dialog.Portal forceMount>
      <AnimatePresence>
        {open && (
          <Dialog.Content forceMount asChild aria-describedby={undefined}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-black"
            >
              <Dialog.Title className="sr-only">{lang === 'es' ? 'Menú de navegación' : 'Navigation menu'}</Dialog.Title>
              <div className={HEADER_ROW_CLASS}>
                <Logo href={`${home}#top`} />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
                className="flex flex-1 flex-col items-center justify-center gap-[clamp(0.375rem,1.2vh,1rem)] px-5 py-4 text-center sm:px-8"
                aria-label="Mobile"
              >
                {links.map((link) => (
                  <motion.a
                    key={link.href}
                    href={`${home}${link.href}`}
                    onClick={() => {
                      onClose()
                      if (link.href === '#top') window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.5, ease: easeOut }}
                    className="font-display text-4xl font-semibold tracking-tight transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.nav>

              <div className="shrink-0 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4 text-center sm:px-8">
                <p className="mb-3 text-sm uppercase tracking-wide text-muted">{t.nav.contactLabel}</p>
                <div className="mb-4 flex justify-center">
                  <FloatingWhatsApp inline />
                </div>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-[44px] items-center font-display text-xl font-normal leading-tight tracking-tight text-foreground underline decoration-foreground/40 decoration-2 underline-offset-8 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-2xl"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </motion.div>
          </Dialog.Content>
        )}
      </AnimatePresence>
    </Dialog.Portal>
  )
}
