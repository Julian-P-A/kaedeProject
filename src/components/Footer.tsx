import { FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { SiBehance, SiInstagram, SiTiktok } from 'react-icons/si'
import { useLanguage } from '#/context/LanguageContext'
import { AsciiFire } from '#/components/animations/AsciiFire'
import { CONTACT_PHONE, WHATSAPP_URL } from '#/lib/contact'

// TODO: TikTok profile URL not provided yet — replace before launch.
const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kaedeproject/', Icon: FaLinkedinIn },
  { label: 'Instagram', href: 'https://www.instagram.com/kaedeproject_/', Icon: SiInstagram },
  { label: 'TikTok', href: '#', Icon: SiTiktok },
  { label: 'Behance', href: 'https://www.behance.net/KaedeProjectCol', Icon: SiBehance },
  { label: `WhatsApp: ${CONTACT_PHONE}`, href: WHATSAPP_URL, Icon: FaWhatsapp },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-site px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex justify-center gap-3">
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

        <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-muted sm:flex-row sm:justify-center sm:gap-2">
          <p>{t.footer.copyright}</p>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <p>{t.footer.secondary}</p>
        </div>
      </div>

      {/* Decorative ASCII fire behind the footer, rising from the page's bottom
          edge and fading out upward. Absolutely positioned so it adds no height. */}
      <AsciiFire
        cellSize={8}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 block h-full w-full opacity-60 [mask-image:linear-gradient(to_top,black_30%,transparent)]"
      />
    </footer>
  )
}
