import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import type { ReactNode } from 'react'
import { SiBehance, SiInstagram, SiTiktok } from 'react-icons/si'
import { useLanguage } from '#/context/LanguageContext'
import { AsciiFire } from '#/components/animations/AsciiFire'
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_URL } from '#/lib/contact'

const FIRE_PALETTE = ['--color-border-strong', '--color-muted', '--color-foreground']

// TODO: TikTok profile URL not provided yet — replace before launch.
const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kaedeproject/', Icon: FaLinkedinIn },
  { label: 'Instagram', href: 'https://www.instagram.com/kaedeproject_/', Icon: SiInstagram },
  { label: 'TikTok', href: '#', Icon: SiTiktok },
  { label: 'Behance', href: 'https://www.behance.net/KaedeProjectCol', Icon: SiBehance },
  { label: `WhatsApp: ${CONTACT_PHONE}`, href: WHATSAPP_URL, Icon: FaWhatsapp },
]

export function Footer({ children }: { children?: ReactNode }) {
  const { lang, t } = useLanguage()

  return (
    <footer className="relative isolate min-h-svh overflow-hidden">
      <div className="mx-auto flex min-h-svh max-w-site flex-col px-6 pb-[calc(136px+1rem+env(safe-area-inset-bottom,0px))] pt-20 sm:px-8 sm:pt-24 lg:pb-[calc(160px+1rem+env(safe-area-inset-bottom,0px))] lg:pt-[28svh]">
        {children && (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
            {children}
            <nav aria-label={lang === 'es' ? 'Navegación del pie' : 'Footer navigation'} className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm lg:flex-col lg:items-start lg:justify-start lg:gap-4">
              {t.nav.links.map((link) => (
                <a key={link.href} href={`/${lang}${link.href}`} className="text-foreground/80 transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}

        <div className="mt-auto grid items-end gap-8 pt-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 lg:pt-24">
          <div className="text-center lg:text-left">
            <p className="mb-3 text-sm uppercase tracking-wide text-muted">{t.nav.contactLabel}</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-[44px] items-center font-display text-xl font-normal leading-tight tracking-tight text-foreground underline decoration-foreground/40 decoration-2 underline-offset-8 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-2xl">
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex justify-center gap-3 lg:justify-self-center">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 min-h-[44px] w-10 min-w-[44px] items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-center text-xs text-muted lg:text-right">
            <p>{t.footer.copyright}</p>
            <p>{t.footer.secondary}</p>
          </div>
        </div>
      </div>

      {/* A bounded background layer inside the same footer composition. */}
      <AsciiFire
        cellSize={8}
        palette={FIRE_PALETTE}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 block h-[180px] w-full opacity-60 [mask-image:linear-gradient(to_top,black_30%,transparent)]"
      />
    </footer>
  )
}
