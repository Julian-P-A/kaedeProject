import { FaLinkedinIn } from 'react-icons/fa'
import { SiBehance, SiInstagram, SiTiktok } from 'react-icons/si'
import { useLanguage } from '#/context/LanguageContext'

// TODO: replace with the real profile URLs before launch.
const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: '#', Icon: FaLinkedinIn },
  { label: 'Instagram', href: '#', Icon: SiInstagram },
  { label: 'TikTok', href: '#', Icon: SiTiktok },
  { label: 'Behance', href: '#', Icon: SiBehance },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex justify-center gap-3">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-border-strong hover:text-foreground"
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
    </footer>
  )
}
