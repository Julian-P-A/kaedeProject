import { whatsappUrl } from '#/lib/contact'
import { formatPlanPrice } from '#/data/pricing'

export type Language = 'en' | 'es'

interface NavLink {
  label: string
  href: string
}

interface Service {
  number: string
  title: string
  headline: string
  items: string[]
  cta: string
  whatsappUrl: string
}

interface ServiceCardCopy {
  tag: string
  title: string
  description: string
}

export type WebDevOptionId = 'landing' | 'corporate' | 'ecommerce' | 'custom'

interface WebDevOption {
  id: WebDevOptionId
  name: string
  price: string
  description: string
  bestFor: string[]
  cta: string
  whatsappUrl: string
}

export type DiagnosticResultId =
  | 'ecosystemRobust'
  | 'conversionUrgency'
  | 'leadMachine'
  | 'perceptionGap'
  | 'authorityPositioning'
  | 'operationalBottleneck'
  | 'exploratory'
  | 'strategicLaunch'

interface DiagnosticQuestion {
  question: string
  options: string[]
}

interface DiagnosticResult {
  title: string
  description: string
}

export interface ProcessStage {
  id: 'brief' | 'scope' | 'design' | 'build' | 'launch'
  title: string
  description: string
}

export interface Translations {
  seo: { title: string; description: string }
  nav: { links: NavLink[]; cta: string; home: string; contactLabel: string }
  hero: {
    eyebrow: string
    title: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    /** Small line under the CTAs. */
    tagline: string
    whatsappUrl: string
  }
  solutionsIntro: { tag: string; title: string; navigationLabel: string }
  services: Service[]
  serviceCards: ServiceCardCopy[]
  webDev: {
    tag: string
    title: string
    bestForLabel: string
    options: WebDevOption[]
  }
  pricing: { quote: string; diagnosticPrompt: string; diagnosticCta: string }
  process: {
    tag: string
    title: string
    stages: ProcessStage[]
  }
  capabilities: { tag: string; items: string[] }
  projectsSection: { tag: string; title: string }
  about: { tag: string; statement: string; highlights: string[] }
  finalCta: {
    tag: string
    title: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
  }
  notFound: { title: string; description: string; cta: string }
  faq: { tag: string; title: string; items: { question: string; answer: string }[] }
  footer: { copyright: string; secondary: string }
  diagnostic: {
    title: string
    questionLabel: string
    questions: DiagnosticQuestion[]
    contact: {
      title: string
      description: string
      emailLabel: string
      emailPlaceholder: string
      phoneLabel: string
      phonePlaceholder: string
      submit: string
      error: string
    }
    nav: { next: string; back: string; close: string }
    results: Record<DiagnosticResultId, DiagnosticResult>
    submitting: string
    submitError: string
    retry: string
    finalMessage: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    seo: {
      title: 'Kaede Project — IT & AI Consulting and Development',
      description:
        'IT and AI consulting and development for businesses: websites, AI assistants, automation, CRM and custom platforms focused on real growth.',
    },
    nav: {
      links: [
        { label: 'Solutions', href: '#solutions' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Projects', href: '#projects' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
      ],
      cta: 'Start a project',
      home: 'Home',
      contactLabel: 'Contact us',
    },
    hero: {
      eyebrow: 'IT & AI consulting and development',
      title: 'Your project, *made* *real.*',
      description:
        'We build your website, connect your CRM and automate customer service with AI, so your business sells more without more work.',
      ctaPrimary: 'Start your project',
      ctaSecondary: 'Explore solutions',
      tagline: 'Your IT & AI partner, for businesses of every size.',
      whatsappUrl:
        whatsappUrl('Hello. I am ready to start a project with you. What are the next steps?'),
    },
    solutionsIntro: {
      tag: '( 1 ) What we do',
      title: 'IT and AI for *growth.*',
      navigationLabel: 'Explore our services',
    },
    services: [
      {
        number: '01',
        title: 'Web Development',
        headline: 'Websites built to sell and to grow with your business.',
        cta: 'Build my website',
        whatsappUrl: whatsappUrl('Hello. I want to build a website for my business. Can we discuss my project?'),
        items: [
          'Landing Pages',
          'Corporate Websites',
          'E-commerce',
          'Custom Websites',
          'Web Platforms',
          'Complex Web Development',
        ],
      },
      {
        number: '02',
        title: 'Artificial Intelligence',
        headline: 'AI consulting and development around real workflows, not hype.',
        cta: 'Bring AI to my business',
        whatsappUrl: whatsappUrl('Hello. I want to explore AI consulting and development for my business.'),
        items: [
          'AI consulting',
          'AI assistants',
          'AI agents',
          'AI integrations',
          'Content workflows',
          'Intelligent data processing',
          'Business-specific AI tools',
        ],
      },
      {
        number: '03',
        title: 'Automation',
        headline: 'Connect your tools and automate repetitive processes.',
        cta: 'Automate my workflows',
        whatsappUrl: whatsappUrl('Hello. I want to automate repetitive processes and connect my business tools.'),
        items: [
          'Workflow automation',
          'Lead routing',
          'Notifications',
          'Data synchronization',
          'Marketing automation',
          'Sales automation',
          'Internal operations',
        ],
      },
      {
        number: '04',
        title: 'CRM & Integrations',
        headline: 'Build connected systems that turn scattered information into structured operations.',
        cta: 'Connect my CRM',
        whatsappUrl: whatsappUrl('Hello. I need help implementing or connecting a CRM with my business tools.'),
        items: [
          'CRM implementation',
          'CRM customization',
          'Lead pipelines',
          'API integrations',
          'Third-party platforms',
          'Business dashboards',
          'Internal systems',
        ],
      },
    ],
    serviceCards: [
      {
        tag: 'Build',
        title: 'Web Development',
        description: 'Landing pages, corporate sites, online stores and custom platforms — one service, built to scope.',
      },
      {
        tag: 'Think',
        title: 'Artificial Intelligence',
        description: 'AI consulting and development: assistants and agents wired into how your business actually works.',
      },
      {
        tag: 'Connect',
        title: 'Automation + CRM',
        description: 'Your website, CRM, AI and team, working as one connected system.',
      },
    ],
    webDev: {
      tag: '( 2 ) Web Development',
      title: 'A website that *fits.*',
      bestForLabel: 'Best for',
      options: [
        {
          id: 'landing',
          name: 'Landing Page',
          price: formatPlanPrice('en', 'landing'),
          description:
            'A focused page designed to present your offer, capture leads and turn traffic into opportunities.',
          bestFor: ['Campaigns', 'Product launches', 'Service promotions', 'Lead generation'],
          cta: 'Launch my landing page',
          whatsappUrl:
            whatsappUrl('Hello. I am interested in the Landing Page plan. I want to know the steps to start.'),
        },
        {
          id: 'corporate',
          name: 'Corporate Website',
          price: formatPlanPrice('en', 'corporate'),
          description:
            'A professional website designed to position your brand, communicate your value and create trust with clients.',
          bestFor: ['Companies', 'Agencies', 'Growing brands', 'Institutions'],
          cta: 'Build my website',
          whatsappUrl:
            whatsappUrl('Hello. I want to build a Corporate Website with you. I would like to discuss the details.'),
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          price: formatPlanPrice('en', 'ecommerce'),
          description:
            'A scalable online store designed to showcase products, simplify purchases and support your digital sales.',
          bestFor: ['Retail brands', 'Product catalogs', 'Beauty brands', 'Product-based businesses'],
          cta: 'Create my online store',
          whatsappUrl:
            whatsappUrl('Hello. I am looking to create an online store (E-commerce). Can we schedule a meeting to start?'),
        },
        {
          id: 'custom',
          name: 'Custom Web Solution',
          price: 'Let’s talk',
          description:
            'For platforms, portals, advanced integrations and digital products that go beyond a traditional website.',
          bestFor: [
            'Client portals',
            'Membership platforms',
            'Internal systems',
            'Web applications',
            'Advanced integrations',
            'Custom dashboards',
            'Complex digital platforms',
          ],
          cta: 'Request a quote',
          whatsappUrl:
            whatsappUrl('Hello. I want to turn my idea into a custom platform with Kaede Project. How can we start?'),
        },
      ],
    },
    pricing: {
      quote: 'Request a quote',
      diagnosticPrompt: "Not sure which option fits your project? Answer a few quick questions and we'll tell you what you need.",
      diagnosticCta: 'Take the quick diagnostic',
    },
    process: {
      tag: '( 4 ) Process',
      title: 'From idea to *launch.*',
      stages: [
        {
          id: 'brief', title: 'Discover',
          description: 'We listen, map your business and find where technology can make a difference.',
        },
        {
          id: 'scope', title: 'Define',
          description: 'We turn what we learn into clear priorities, scope and a plan for your project.',
        },
        {
          id: 'design', title: 'Design',
          description: 'We shape the experience, structure and visual direction before development.',
        },
        {
          id: 'build', title: 'Build',
          description: 'We bring the design to life and test how every part works together.',
        },
        {
          id: 'launch', title: 'Launch',
          description: 'We put the solution live, check the connections and prepare your team to use it.',
        },
      ],
    },
    capabilities: {
      tag: '( 5 ) Capabilities',
      items: [
        'IT Consulting',
        'AI Consulting',
        'Web Development',
        'Artificial Intelligence',
        'Automation',
        'CRM',
        'API Integrations',
        'E-commerce',
        'Business Platforms',
        'UI/UX',
      ],
    },
    projectsSection: {
      tag: '( 6 ) Selected projects',
      title: 'Real *projects.*',
    },
    about: {
      tag: '( 7 ) About',
      statement:
        'We are the IT and AI partner for businesses that want to grow without complicating their operation: we advise you, build what you need and connect it so your business works as one system.',
      highlights: ['IT and AI partner', 'one system.'],
    },
    finalCta: {
      tag: '( 9 ) Let’s talk',
      title: 'Let’s talk about your *project.*',
      description: 'Tell us what your business needs. We’ll advise you on the best path and build it with you.',
      ctaPrimary: 'Let’s build it',
      ctaSecondary: 'Request a quote',
    },
    notFound: {
      title: 'Page *not* *found.*',
      description: 'The page you are looking for does not exist or has moved.',
      cta: 'Back to home',
    },
    faq: {
      tag: '( 8 ) Frequently asked questions',
      title: 'Common *questions.*',
      items: [
        {
          question: 'How much does a website cost?',
          answer:
            'A Landing Page is 300 USD, a Corporate Website is 450 USD and an E-commerce store is 600 USD. Platforms, portals and advanced integrations are quoted individually once we understand the scope.',
        },
        {
          question: 'Do you offer IT and AI consulting?',
          answer:
            'Yes. Before building anything, we help you decide what your business actually needs: which processes to automate, where AI adds value and which tools to connect. Then we build it with you.',
        },
        {
          question: 'What types of websites do you build?',
          answer:
            'Landing pages for campaigns and lead generation, corporate websites, online stores and custom web platforms such as client portals, membership sites and internal systems.',
        },
        {
          question: 'What can be automated in my business?',
          answer:
            'Repetitive work such as lead routing, notifications, data synchronization between tools, marketing and sales follow-ups, and internal operations. We connect the tools you already use so they work as one system.',
        },
        {
          question: 'Can you add artificial intelligence to my business?',
          answer:
            'Yes. We build AI assistants and agents, integrate AI into your existing tools and set up content workflows and data processing designed around how your business actually operates.',
        },
        {
          question: 'Do you implement and customize a CRM?',
          answer:
            'Yes. We implement and customize CRM systems, build lead pipelines, connect them through API integrations to your website and other platforms, and create dashboards so your team sees what matters.',
        },
        {
          question: 'How long does a project take?',
          answer:
            'It depends on the scope, number of pages, integrations and available content. Before we start, we define the stages, deliverables and estimated timeline in the proposal. Changes to the scope may also change the schedule.',
        },
        {
          question: 'Do I need to have my design and content ready?',
          answer:
            'We can start with your existing brand and materials, or identify what still needs to be created. During discovery, we agree on the copy, images, product information and other assets the project needs, and who will provide them.',
        },
        {
          question: 'Can you improve my current website?',
          answer:
            'We first review its structure, technology and the results you want to improve. That helps us decide whether to optimize the existing site, connect new features or build a new version. A full rebuild is not always necessary.',
        },
        {
          question: 'Can I hire you for just one service?',
          answer:
            'Yes. We can focus on a website, a specific automation, an AI solution or an integration. We define a scope that addresses that need and fits the tools you already use, so you can start with a clear priority.',
        },
        {
          question: 'Can you connect the tools I already use?',
          answer:
            'We review how your current tools exchange information and which integrations they support. Access permissions, available APIs and platform limits help determine what can be connected and what the implementation involves.',
        },
        {
          question: 'How do I know whether I need AI or automation?',
          answer:
            'If a task follows clear rules and repeats the same steps, automation may be enough. AI can help with tasks that involve interpreting text or generating responses. We review the process first and may combine both when that makes sense.',
        },
        {
          question: 'Are there recurring costs beyond development?',
          answer:
            'Hosting, domains, software subscriptions and API usage may have separate costs. The proposal clarifies what the implementation covers and which costs depend on external providers or usage, so you can plan beyond the initial build.',
        },
        {
          question: 'Can the project grow in stages?',
          answer:
            'Yes. We can define an initial scope around the most important need and plan later additions, such as a store, CRM connection or automation. Each new phase is scoped and quoted before implementation.',
        },
        {
          question: 'How do I start a project with Kaede Project?',
          answer:
            'Write to us on WhatsApp or take the quick diagnostic on this page. We work in stages (Discover, Define, Design, Build and Launch) and, before we start, send you a quote with the scope and timeline.',
        },
      ],
    },
    footer: {
      copyright: '© 2026 Kaede Project. All rights reserved.',
      secondary: 'Designed and built by Kaede Project.',
    },
    diagnostic: {
      title: 'Quick diagnosis',
      questionLabel: 'Question',
      questions: [
        {
          question: 'What is the main function your website needs to fulfill?',
          options: [
            'Sell products or subscriptions',
            'Capture leads or book appointments',
            'Showcase a portfolio or corporate presentation',
            'Custom platform or complex system',
            'Other',
          ],
        },
        {
          question: "What is your business's biggest digital obstacle today?",
          options: [
            "I don't have a professional presence online",
            "I have a website, but it doesn't attract clients or sales",
            "My current image doesn't reflect the quality of my work",
            'I lose a lot of time on manual processes',
            "I'm not sure, I need a diagnosis",
          ],
        },
        {
          question: "What state is your brand's design and content in?",
          options: [
            'I have a brand manual, references and copy',
            'I have a basic logo, but I need web design and copy',
            'I need to build everything from scratch',
          ],
        },
        {
          question: 'Which metric would you like to improve first?',
          options: ['More leads', 'Automated sales', 'Premium positioning', 'Save operational time'],
        },
        {
          question: 'What size do you estimate for this project?',
          options: [
            'Landing page',
            'Corporate website with 2 to 5 pages',
            'Robust platform / +6 pages / large store',
            "I'm not sure",
          ],
        },
        {
          question: "What's the main action you want your clients to take?",
          options: [
            'Buy',
            'Sign up / leave their details',
            'Learn about the company, validate experience and get in touch',
            'A combination or something specific',
          ],
        },
        {
          question: 'How long has your business been active?',
          options: ['About to launch', 'Less than 1 year', '1 to 3 years', 'More than 3 years'],
        },
      ],
      contact: {
        title: 'One last step',
        description: 'Leave us your details so we can send your diagnosis and coordinate next steps.',
        emailLabel: 'Email',
        emailPlaceholder: 'you@email.com',
        phoneLabel: 'Phone number',
        phonePlaceholder: '+1 000 000 0000',
        submit: 'See my diagnosis',
        error: 'Please enter a valid email and phone number.',
      },
      nav: { next: 'Next', back: 'Back', close: 'Close' },
      results: {
        ecosystemRobust: {
          title: 'Robust Ecosystem / E-commerce',
          description:
            'Your project is about selling, scaling and connecting multiple processes. You need a robust platform built to support real growth.',
        },
        conversionUrgency: {
          title: 'Conversion Urgency',
          description:
            "You already have a digital presence, but it isn't producing results. The focus should be on optimizing conversion, not starting from zero.",
        },
        leadMachine: {
          title: 'Lead-Generation Machine / Landing Page',
          description:
            'You need a landing page focused entirely on capturing leads and turning traffic into real opportunities.',
        },
        perceptionGap: {
          title: 'Perception Gap',
          description:
            "Your experience and quality aren't reflected in your current digital image. You need a presence that backs up your work.",
        },
        authorityPositioning: {
          title: 'Authority & Positioning',
          description:
            'You want to showcase your portfolio and strengthen your brand with a corporate website that conveys authority.',
        },
        operationalBottleneck: {
          title: 'Operational Bottleneck',
          description:
            "You're losing valuable time on manual processes. You need a custom solution that automates your operation.",
        },
        exploratory: {
          title: 'Exploratory',
          description:
            "You're still defining the direction of your project. We'll help you build the strategy and the brand from scratch.",
        },
        strategicLaunch: {
          title: 'Strategic Launch',
          description:
            "You're about to launch or just getting started. The ideal moment to build a professional digital presence from day one.",
        },
      },
      submitting: 'Your diagnosis is ready. Sending your contact details…',
      submitError: 'Your diagnosis is ready, but we could not confirm receipt of your contact details. Please try again.',
      retry: 'Retry sending',
      finalMessage: 'We received your details. Our team will contact you to coordinate the next steps.',
    },
  },
  es: {
    seo: {
      title: 'Kaede Project — Consultoría y Desarrollo de TI e IA',
      description:
        'Consultoría y desarrollo de TI e IA para empresas: páginas web, asistentes de IA, automatización, CRM y plataformas a la medida enfocadas en crecimiento real.',
    },
    nav: {
      links: [
        { label: 'Soluciones', href: '#solutions' },
        { label: 'Precios', href: '#pricing' },
        { label: 'Proyectos', href: '#projects' },
        { label: 'Nosotros', href: '#about' },
        { label: 'Contacto', href: '#contact' },
      ],
      cta: 'Iniciar un proyecto',
      home: 'Inicio',
      contactLabel: 'Contáctanos',
    },
    hero: {
      eyebrow: 'Consultoría y desarrollo de TI e IA',
      title: 'Tu proyecto, *hecho* *realidad.*',
      description:
        'Creamos tu página web, conectamos tu CRM y automatizamos tu atención con IA, para que tu negocio venda más sin sumar más trabajo.',
      ctaPrimary: 'Inicia tu proyecto',
      ctaSecondary: 'Explorar soluciones',
      tagline: 'Tu socio de TI e IA, para empresas de todos los tamaños.',
      whatsappUrl:
        whatsappUrl('Hola. Estoy listo para iniciar un proyecto con ustedes. ¿Cuáles son los siguientes pasos?'),
    },
    solutionsIntro: {
      tag: '( 1 ) Qué hacemos',
      title: 'TI e IA para *crecer.*',
      navigationLabel: 'Explora nuestros servicios',
    },
    services: [
      {
        number: '01',
        title: 'Desarrollo web',
        headline: 'Sitios web hechos para vender y crecer con tu negocio.',
        cta: 'Construir mi sitio web',
        whatsappUrl: whatsappUrl('Hola. Quiero desarrollar un sitio web para mi negocio. ¿Podemos hablar de mi proyecto?'),
        items: [
          'Landing Pages',
          'Sitios Corporativos',
          'E-commerce',
          'Sitios a Medida',
          'Plataformas Web',
          'Desarrollo Web Complejo',
        ],
      },
      {
        number: '02',
        title: 'Inteligencia artificial',
        headline: 'Consultoría y desarrollo de IA alrededor de procesos reales, no de tendencias.',
        cta: 'Integrar IA en mi negocio',
        whatsappUrl: whatsappUrl('Hola. Quiero conocer sus servicios de consultoría y desarrollo de IA para mi negocio.'),
        items: [
          'Consultoría de IA',
          'Asistentes de IA',
          'Agentes de IA',
          'Integraciones de IA',
          'Flujos de contenido',
          'Procesamiento inteligente de datos',
          'Herramientas de IA a medida',
        ],
      },
      {
        number: '03',
        title: 'Automatización',
        headline: 'Conecta tus herramientas y automatiza procesos repetitivos.',
        cta: 'Automatizar mi operación',
        whatsappUrl: whatsappUrl('Hola. Quiero automatizar procesos repetitivos y conectar las herramientas de mi negocio.'),
        items: [
          'Automatización de flujos',
          'Enrutamiento de leads',
          'Notificaciones',
          'Sincronización de datos',
          'Automatización de marketing',
          'Automatización de ventas',
          'Operaciones internas',
        ],
      },
      {
        number: '04',
        title: 'CRM e Integraciones',
        headline: 'Construimos sistemas conectados que convierten información dispersa en operaciones estructuradas.',
        cta: 'Conectar mi CRM',
        whatsappUrl: whatsappUrl('Hola. Necesito ayuda para implementar o conectar un CRM con las herramientas de mi negocio.'),
        items: [
          'Implementación de CRM',
          'Personalización de CRM',
          'Pipelines de leads',
          'Integraciones API',
          'Plataformas de terceros',
          'Dashboards de negocio',
          'Sistemas internos',
        ],
      },
    ],
    serviceCards: [
      {
        tag: 'Construir',
        title: 'Desarrollo Web',
        description: 'Landing pages, sitios corporativos, tiendas online y plataformas a medida — un servicio, a la medida.',
      },
      {
        tag: 'Pensar',
        title: 'Inteligencia Artificial',
        description: 'Consultoría y desarrollo de IA: asistentes y agentes conectados a cómo realmente opera tu negocio.',
      },
      {
        tag: 'Conectar',
        title: 'Automatización + CRM',
        description: 'Tu sitio web, CRM, IA y equipo, funcionando como un solo sistema conectado.',
      },
    ],
    webDev: {
      tag: '( 2 ) Desarrollo Web',
      title: 'Una web a tu *medida.*',
      bestForLabel: 'Ideal para',
      options: [
        {
          id: 'landing',
          name: 'Landing Page',
          price: formatPlanPrice('es', 'landing'),
          description:
            'Una página enfocada, diseñada para presentar tu oferta, capturar leads y convertir tráfico en oportunidades.',
          bestFor: ['Campañas', 'Lanzamientos de producto', 'Promociones de servicios', 'Generación de leads'],
          cta: 'Crear mi landing page',
          whatsappUrl:
            whatsappUrl('Hola. Me interesa el plan de Landing Page. Quiero conocer los pasos para empezar.'),
        },
        {
          id: 'corporate',
          name: 'Sitio Corporativo',
          price: formatPlanPrice('es', 'corporate'),
          description:
            'Un sitio web profesional diseñado para posicionar tu marca, comunicar tu valor y generar confianza con tus clientes.',
          bestFor: ['Empresas', 'Agencias', 'Marcas en crecimiento', 'Instituciones'],
          cta: 'Crear mi sitio web',
          whatsappUrl:
            whatsappUrl('Hola. Quiero desarrollar un Sitio Web Corporativo con ustedes. Me gustaría discutir los detalles.'),
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          price: formatPlanPrice('es', 'ecommerce'),
          description:
            'Una tienda online escalable diseñada para mostrar productos, simplificar las compras y potenciar tus ventas digitales.',
          bestFor: ['Marcas de retail', 'Catálogos de producto', 'Marcas de belleza', 'Negocios basados en productos'],
          cta: 'Crear mi tienda online',
          whatsappUrl:
            whatsappUrl('Hola. Busco crear una tienda en línea (E-commerce). ¿Podemos agendar una reunión para iniciar?'),
        },
        {
          id: 'custom',
          name: 'Solución Web a Medida',
          price: 'Hablemos',
          description:
            'Para plataformas, portales, integraciones avanzadas y productos digitales que van más allá de un sitio web tradicional.',
          bestFor: [
            'Portales de clientes',
            'Plataformas de membresía',
            'Sistemas internos',
            'Aplicaciones web',
            'Integraciones avanzadas',
            'Dashboards a medida',
            'Plataformas digitales complejas',
          ],
          cta: 'Solicitar cotización',
          whatsappUrl:
            whatsappUrl('Hola. Quiero convertir mi idea en una plataforma a la medida con Kaede Project. ¿Cómo podemos empezar?'),
        },
      ],
    },
    pricing: {
      quote: 'Solicitar cotización',
      diagnosticPrompt:
        '¿No sabes qué opción se ajusta a tu proyecto? Responde unas preguntas rápidas y te decimos qué necesitas.',
      diagnosticCta: 'Hacer diagnóstico rápido',
    },
    process: {
      tag: '( 4 ) Proceso',
      title: 'Así creamos tu *proyecto.*',
      stages: [
        {
          id: 'brief', title: 'Descubrir',
          description: 'Escuchamos, entendemos tu negocio y encontramos dónde puede aportar la tecnología.',
        },
        {
          id: 'scope', title: 'Definir',
          description: 'Convertimos lo aprendido en prioridades, un alcance claro y un plan para tu proyecto.',
        },
        {
          id: 'design', title: 'Diseñar',
          description: 'Damos forma a la experiencia, la estructura y la dirección visual antes de desarrollar.',
        },
        {
          id: 'build', title: 'Desarrollar',
          description: 'Hacemos realidad el diseño y probamos cómo funciona cada parte del proyecto.',
        },
        {
          id: 'launch', title: 'Lanzar',
          description: 'Publicamos la solución, comprobamos las conexiones y preparamos a tu equipo para usarla.',
        },
      ],
    },
    capabilities: {
      tag: '( 5 ) Capacidades',
      items: [
        'Consultoría de TI',
        'Consultoría de IA',
        'Desarrollo Web',
        'Inteligencia Artificial',
        'Automatización',
        'CRM',
        'Integraciones API',
        'E-commerce',
        'Plataformas Empresariales',
        'UI/UX',
      ],
    },
    projectsSection: {
      tag: '( 6 ) Proyectos seleccionados',
      title: 'Proyectos *reales.*',
    },
    about: {
      tag: '( 7 ) Nosotros',
      statement:
        'Somos el socio de TI e IA para empresas que quieren crecer sin complicar su operación: te asesoramos, construimos lo que necesitas y lo conectamos para que tu negocio funcione como un solo sistema.',
      highlights: ['socio de TI e IA', 'un solo sistema.'],
    },
    finalCta: {
      tag: '( 9 ) Hablemos',
      title: 'Hablemos de tu *proyecto.*',
      description: 'Cuéntanos qué necesita tu negocio. Te asesoramos sobre el mejor camino y lo construimos contigo.',
      ctaPrimary: 'Construyámoslo',
      ctaSecondary: 'Solicitar cotización',
    },
    notFound: {
      title: 'Página *no* *encontrada.*',
      description: 'La página que buscas no existe o cambió de lugar.',
      cta: 'Volver al inicio',
    },
    faq: {
      tag: '( 8 ) Preguntas frecuentes',
      title: 'Preguntas *frecuentes.*',
      items: [
        {
          question: '¿Cuánto cuesta una página web?',
          answer:
            'Una Landing Page cuesta 900.000 COP, un Sitio Corporativo 1\'400.000 COP y una tienda E-commerce 1\'900.000 COP. Las plataformas, portales e integraciones avanzadas se cotizan de forma individual una vez entendemos el alcance.',
        },
        {
          question: '¿Ofrecen consultoría de TI e IA?',
          answer:
            'Sí. Antes de construir, te ayudamos a definir qué necesita realmente tu negocio: qué procesos automatizar, dónde aporta la IA y qué herramientas conectar. Luego lo construimos contigo.',
        },
        {
          question: '¿Qué tipos de sitios web desarrollan?',
          answer:
            'Landing pages para campañas y captación de leads, sitios corporativos, tiendas online y plataformas web a la medida, como portales de clientes, sitios de membresía y sistemas internos.',
        },
        {
          question: '¿Qué se puede automatizar en mi negocio?',
          answer:
            'El trabajo repetitivo: asignación de leads, notificaciones, sincronización de datos entre herramientas, seguimientos de marketing y ventas, y operaciones internas. Conectamos las herramientas que ya usas para que funcionen como un solo sistema.',
        },
        {
          question: '¿Pueden integrar inteligencia artificial en mi negocio?',
          answer:
            'Sí. Creamos asistentes y agentes de IA, integramos IA en tus herramientas actuales y armamos flujos de contenido y procesamiento de datos pensados para cómo opera realmente tu negocio.',
        },
        {
          question: '¿Implementan y personalizan un CRM?',
          answer:
            'Sí. Implementamos y personalizamos sistemas CRM, construimos pipelines de leads, los conectamos por API con tu sitio web y otras plataformas, y creamos dashboards para que tu equipo vea lo que importa.',
        },
        {
          question: '¿Cuánto tiempo toma un proyecto?',
          answer:
            'Depende del alcance, la cantidad de páginas, las integraciones y el contenido disponible. Antes de empezar, definimos las etapas, los entregables y un tiempo estimado en la propuesta. Si cambia el alcance, también puede cambiar el cronograma.',
        },
        {
          question: '¿Necesito tener listo el diseño y los contenidos?',
          answer:
            'Podemos partir de tu marca y los materiales que ya tienes, o identificar lo que hace falta crear. En la etapa de descubrimiento acordamos qué textos, imágenes, información de productos y otros recursos necesita el proyecto, y quién los aporta.',
        },
        {
          question: '¿Pueden mejorar mi página web actual?',
          answer:
            'Primero revisamos su estructura, tecnología y los resultados que quieres mejorar. Con eso evaluamos si conviene optimizar el sitio existente, conectar nuevas funciones o desarrollar una nueva versión. No siempre es necesario empezar de cero.',
        },
        {
          question: '¿Puedo contratar solo uno de sus servicios?',
          answer:
            'Sí. Podemos enfocarnos en una página web, una automatización puntual, una solución de IA o una integración. Definimos un alcance que resuelva esa necesidad y encaje con las herramientas que ya usas, para que empieces por una prioridad clara.',
        },
        {
          question: '¿Pueden conectar las herramientas que ya utilizo?',
          answer:
            'Revisamos cómo intercambian información tus herramientas y qué integraciones permiten. Los permisos de acceso, las API disponibles y las limitaciones de cada plataforma nos ayudan a definir qué se puede conectar y qué requiere la implementación.',
        },
        {
          question: '¿Cómo sé si necesito IA o una automatización?',
          answer:
            'Si una tarea sigue reglas claras y repite los mismos pasos, una automatización puede ser suficiente. La IA puede ayudar cuando hace falta interpretar texto o generar respuestas. Revisamos primero el proceso y, cuando tiene sentido, combinamos ambas.',
        },
        {
          question: '¿Hay costos recurrentes además del desarrollo?',
          answer:
            'El hosting, el dominio, las suscripciones de software y el consumo de API pueden tener costos propios. En la propuesta aclaramos qué cubre la implementación y qué costos dependen de proveedores externos o del uso, para que puedas planear más allá del desarrollo inicial.',
        },
        {
          question: '¿El proyecto puede crecer por etapas?',
          answer:
            'Sí. Podemos definir un alcance inicial alrededor de la necesidad más importante y planear después nuevas funciones, como una tienda, una conexión con tu CRM o una automatización. Cada nueva etapa se define y cotiza antes de implementarla.',
        },
        {
          question: '¿Cómo inicio un proyecto con Kaede Project?',
          answer:
            'Escríbenos por WhatsApp o haz el diagnóstico rápido de esta página. Trabajamos por etapas (descubrir, definir, diseñar, desarrollar y lanzar) y, antes de empezar, te enviamos una cotización con el alcance y los tiempos.',
        },
      ],
    },
    footer: {
      copyright: '© 2026 Kaede Project. Todos los derechos reservados.',
      secondary: 'Diseñado y desarrollado por Kaede Project.',
    },
    diagnostic: {
      title: 'Diagnóstico rápido',
      questionLabel: 'Pregunta',
      questions: [
        {
          question: '¿Cuál es la función principal que debe cumplir tu sitio web?',
          options: [
            'Vender productos o suscripciones',
            'Captar clientes potenciales o agendar citas',
            'Mostrar un portafolio o presentación corporativa',
            'Plataforma o sistema complejo a medida',
            'Otra',
          ],
        },
        {
          question: '¿Cuál es el mayor obstáculo digital de tu negocio hoy?',
          options: [
            'No existo en internet de forma profesional',
            'Tengo una web, pero no atrae clientes ni ventas',
            'Mi imagen actual no refleja la calidad de mi trabajo',
            'Pierdo mucho tiempo en procesos manuales',
            'No estoy seguro, necesito un diagnóstico',
          ],
        },
        {
          question: '¿En qué estado se encuentra el diseño y contenido de tu marca?',
          options: [
            'Tengo manual de marca, referencias y textos',
            'Tengo logo básico, pero necesito diseño web y textos',
            'Necesito construir todo desde cero',
          ],
        },
        {
          question: '¿Qué métrica te gustaría mejorar primero?',
          options: ['Más leads', 'Ventas automatizadas', 'Posicionamiento premium', 'Ahorrar tiempo operativo'],
        },
        {
          question: '¿Qué tamaño estimas para este proyecto?',
          options: [
            'Landing page',
            'Web corporativa de 2 a 5 páginas',
            'Plataforma robusta / +6 páginas / tienda grande',
            'No estoy seguro',
          ],
        },
        {
          question: '¿Cuál es la acción principal que quieres que tus clientes hagan?',
          options: [
            'Comprar',
            'Registrarse/dejar sus datos',
            'Conocer la empresa, validar experiencia y contactar',
            'Combinación o algo específico',
          ],
        },
        {
          question: '¿Cuánto tiempo lleva activo tu negocio?',
          options: ['A punto de lanzarse', 'Menos de 1 año', '1 a 3 años', 'Más de 3 años'],
        },
      ],
      contact: {
        title: 'Un último paso',
        description: 'Déjanos tus datos para enviarte el diagnóstico y coordinar los siguientes pasos.',
        emailLabel: 'Correo electrónico',
        emailPlaceholder: 'tucorreo@email.com',
        phoneLabel: 'Número telefónico',
        phonePlaceholder: '+57 300 000 0000',
        submit: 'Ver mi diagnóstico',
        error: 'Por favor completa un correo y teléfono válidos.',
      },
      nav: { next: 'Siguiente', back: 'Atrás', close: 'Cerrar' },
      results: {
        ecosystemRobust: {
          title: 'Ecosistema Robusto / E-commerce',
          description:
            'Tu proyecto apunta a vender, escalar y conectar múltiples procesos. Necesitas una plataforma robusta que soporte un crecimiento real.',
        },
        conversionUrgency: {
          title: 'Urgencia de Conversión',
          description:
            'Ya tienes presencia digital, pero no está generando resultados. El foco debe estar en optimizar la conversión, no en empezar de cero.',
        },
        leadMachine: {
          title: 'Máquina de Captación / Landing Page',
          description:
            'Necesitas una landing page enfocada 100% en captar leads y convertir tráfico en oportunidades reales.',
        },
        perceptionGap: {
          title: 'Brecha de Percepción',
          description:
            'Tu experiencia y calidad no se están reflejando en tu imagen digital actual. Necesitas una presencia que respalde tu trabajo.',
        },
        authorityPositioning: {
          title: 'Autoridad y Posicionamiento',
          description:
            'Buscas mostrar tu portafolio y consolidar tu marca con una web corporativa que transmita autoridad.',
        },
        operationalBottleneck: {
          title: 'Cuello de Botella Operativo',
          description:
            'Estás perdiendo tiempo valioso en procesos manuales. Necesitas una solución a medida que automatice tu operación.',
        },
        exploratory: {
          title: 'Exploratorio',
          description:
            'Todavía estás definiendo el rumbo de tu proyecto. Te ayudamos a construir la estrategia y la marca desde cero.',
        },
        strategicLaunch: {
          title: 'Lanzamiento Estratégico',
          description:
            'Estás por lanzarte o apenas empezando. Es el momento ideal para construir una presencia digital profesional desde el día uno.',
        },
      },
      submitting: 'Tu diagnóstico está listo. Estamos enviando tus datos de contacto…',
      submitError: 'Tu diagnóstico está listo, pero no pudimos confirmar la recepción de tus datos. Intenta enviarlos de nuevo.',
      retry: 'Reintentar envío',
      finalMessage: 'Recibimos tus datos. Nuestro equipo te contactará para coordinar los siguientes pasos.',
    },
  },
}
