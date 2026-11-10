import { createFileRoute, notFound } from '@tanstack/react-router'
import { LanguageProvider } from '#/context/LanguageContext'
import { DiagnosticProvider } from '#/context/DiagnosticContext'
import { buildHead, isLanguage } from '#/lib/seo'
import { Header } from '#/components/Header'
import { Hero } from '#/components/Hero'
import { Solutions } from '#/components/Solutions'
import { WebDevelopment } from '#/components/WebDevelopment'
import { Process } from '#/components/Process'
import { Projects } from '#/components/Projects'
import { About } from '#/components/About'
import { Faq } from '#/components/Faq'
import { FinalCTA } from '#/components/FinalCTA'
import { Footer } from '#/components/Footer'
import { FloatingWhatsApp } from '#/components/FloatingWhatsApp'

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    if (!isLanguage(params.lang)) throw notFound()
  },
  head: ({ params }) => (isLanguage(params.lang) ? buildHead(params.lang) : {}),
  component: Home,
})

function Home() {
  const { lang } = Route.useParams()

  return (
    <LanguageProvider lang={isLanguage(lang) ? lang : 'en'}>
      <DiagnosticProvider>
        <div className="bg-background">
          <Header />
          <main>
            <Hero />
            <About />
            <Solutions />
            <WebDevelopment />
            <Process />
            <Projects />
            <Faq />
          </main>
          <Footer>
            <FinalCTA />
          </Footer>
          <FloatingWhatsApp />
        </div>
      </DiagnosticProvider>
    </LanguageProvider>
  )
}
