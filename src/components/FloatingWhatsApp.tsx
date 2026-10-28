import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '#/context/LanguageContext'

export function FloatingWhatsApp() {
  const { lang, t } = useLanguage()
  const label = lang === 'es' ? 'Escríbenos por WhatsApp' : 'Chat with us on WhatsApp'

  return (
    <a
      href={t.hero.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-40 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent text-accent-foreground shadow-lg shadow-black/40 transition duration-200 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transition-none sm:h-16 sm:w-16"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
    </a>
  )
}
