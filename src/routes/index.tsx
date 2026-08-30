import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLanguage } from '#/context/LanguageContext'
import { Header } from '#/components/Header'
import { Hero } from '#/components/Hero'
import { Solutions } from '#/components/Solutions'
import { ServiceCards } from '#/components/ServiceCards'
import { WebDevelopment } from '#/components/WebDevelopment'
import { DigitalEcosystem } from '#/components/DigitalEcosystem'
import { Process } from '#/components/Process'
import { Capabilities } from '#/components/Capabilities'
import { Projects } from '#/components/Projects'
import { About } from '#/components/About'
import { FinalCTA } from '#/components/FinalCTA'
import { Footer } from '#/components/Footer'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  useDocumentMeta()

  return (
    <div className="bg-background">
      <Header />
      <main>
        <Hero />
        <Solutions />
        <ServiceCards />
        <WebDevelopment />
        <DigitalEcosystem />
        <Process />
        <Capabilities />
        <Projects />
        <About />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

/** Keeps the tab title/description in sync with the active language, client-side only. */
function useDocumentMeta() {
  const { t, lang } = useLanguage()

  useEffect(() => {
    document.title = t.seo.title
    document.documentElement.lang = lang
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', t.seo.description)
  }, [t, lang])
}
