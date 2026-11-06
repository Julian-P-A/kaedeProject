import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '#/context/LanguageContext'

export function FloatingWhatsApp({ inline = false }: { inline?: boolean }) {
  const { lang, t } = useLanguage()
  const label = lang === 'es' ? 'Escríbenos por WhatsApp' : 'Chat with us on WhatsApp'
  const position = inline ? '' : 'site-floating-right fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-40'

  return (
    <a
      href={t.hero.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`${position} inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-3 pr-1.5 text-foreground shadow-lg shadow-black/40 transition duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transition-none`}
    >
      <span className="whitespace-nowrap text-sm font-medium tracking-tight">{lang === 'es' ? 'Escríbenos' : 'Message us'}</span>
      <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground" aria-hidden="true">
        <FaWhatsapp className="h-[16px] w-[16px]" />
      </span>
    </a>
  )
}
