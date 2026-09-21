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

interface EcosystemNode {
  label: string
  status: string
}

export type ProjectId = 'fuego' | 'celestina' | 'leadgen'

interface Project {
  id: ProjectId
  name: string
  category: string
  description: string
}

export interface Translations {
  seo: { title: string; description: string }
  nav: { links: NavLink[]; cta: string }
  hero: {
    eyebrow: string
    title: string
    description: string
    ctaPrimary: string
    ctaSecondary: string
    whatsappUrl: string
  }
  dashboard: {
    barTitle: string
    status: string
    action: string
    flow: string[]
    flowLabel: string
    cards: {
      leads: { label: string; value: string }
      automation: { label: string; value: string }
      crm: { label: string; value: string }
      ai: { label: string; value: string }
      website: { label: string; value: string }
    }
    disclaimer: string
  }
  solutionsIntro: { tag: string; title: string; description: string }
  services: Service[]
  serviceCards: ServiceCardCopy[]
  webDev: {
    tag: string
    title: string
    bestForLabel: string
    options: WebDevOption[]
  }
  pricing: { quote: string; diagnosticPrompt: string; diagnosticCta: string }
  process: { tag: string; title: string; stages: { number: string; title: string }[] }
  capabilities: { tag: string; items: string[] }
  projectsSection: { tag: string; title: string; items: Project[] }
  about: { tag: string; statement: string; supporting: string }
  ecosystem: { tag: string; title: string; nodes: EcosystemNode[] }
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
    finalMessage: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    seo: {
      title: 'Kaede Project — Digital Development, AI & Automation',
      description:
        'Kaede Project designs and builds websites, AI solutions, automations, CRM systems and custom digital platforms focused on real business growth.',
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
    },
    hero: {
      eyebrow: 'Kaede Project / Digital Solutions',
      title: 'Let’s make your next project a *reality.*',
      description:
        'We design and build digital solutions powered by strategy, technology and AI to help your business grow faster.',
      ctaPrimary: 'Start your project',
      ctaSecondary: 'Explore solutions',
      whatsappUrl:
        'https://wa.me/573151883229?text=Hello.%20I%20am%20ready%20to%20start%20a%20project%20with%20you.%20What%20are%20the%20next%20steps%3F',
    },
    dashboard: {
      barTitle: 'Kaede Operations',
      status: 'All systems live',
      action: 'New workflow',
      flow: ['Website', 'Lead captured', 'CRM', 'AI qualification', 'Automation', 'Sales team'],
      flowLabel: 'Live workflow',
      cards: {
        leads: { label: 'New Leads', value: '+247' },
        automation: { label: 'Automated', value: '93%' },
        crm: { label: 'CRM', value: 'Pipeline Active' },
        ai: { label: 'AI Agent', value: 'Running' },
        website: { label: 'Online', value: '99.9%' },
      },
      disclaimer: 'Illustrative interface — conceptual, not a live client dashboard.',
    },
    solutionsIntro: {
      tag: '( 1 ) What we do',
      title: 'Digital solutions built for real business *goals.*',
      description:
        'From websites to AI-powered platforms, we create digital experiences that connect brands with people, automate processes and drive measurable growth.',
    },
    services: [
      {
        number: '01',
        title: 'Web Development',
        headline: 'Web experiences engineered around your business.',
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
        headline: 'AI solutions designed around real workflows, not hype.',
        items: [
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
        description: 'AI assistants and agents wired into how your business actually works.',
      },
      {
        tag: 'Connect',
        title: 'Automation + CRM',
        description: 'Your website, CRM, AI and team, working as one connected system.',
      },
    ],
    webDev: {
      tag: '( 2 ) Web Development',
      title: 'One web service. Built around what your business actually *needs.*',
      bestForLabel: 'Best for',
      options: [
        {
          id: 'landing',
          name: 'Landing Page',
          price: '300 USD',
          description:
            'A focused digital experience designed to present your offer, capture leads and turn traffic into opportunities.',
          bestFor: ['Campaigns', 'Product launches', 'Service promotions', 'Lead generation'],
          cta: 'Launch my landing page',
          whatsappUrl:
            'https://wa.me/573151883229?text=Hello.%20I%20am%20interested%20in%20the%20Landing%20Page%20plan.%20I%20want%20to%20know%20the%20steps%20to%20start.',
        },
        {
          id: 'corporate',
          name: 'Corporate Website',
          price: '450 USD',
          description:
            'A professional website designed to position your brand, communicate your value and create trust with clients.',
          bestFor: ['Companies', 'Agencies', 'Growing brands', 'Institutions'],
          cta: 'Build my website',
          whatsappUrl:
            'https://wa.me/573151883229?text=Hello.%20I%20want%20to%20build%20a%20Corporate%20Website%20with%20you.%20I%20would%20like%20to%20discuss%20the%20details.',
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          price: '600 USD',
          description:
            'A scalable online store designed to showcase products, simplify purchases and support your digital sales.',
          bestFor: ['Retail brands', 'Product catalogs', 'Beauty brands', 'Product-based businesses'],
          cta: 'Create my online store',
          whatsappUrl:
            'https://wa.me/573151883229?text=Hello.%20I%20am%20looking%20to%20create%20an%20online%20store%20(E-commerce).%20Can%20we%20schedule%20a%20meeting%20to%20start%3F',
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
            'https://wa.me/573151883229?text=Hello.%20I%20want%20to%20transform%20my%20idea%20into%20a%20digital%20solution%20with%20Kaede%20Project.%20How%20can%20we%20start%3F',
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
      title: 'Strategy, design and technology working *together.*',
      stages: [
        { number: '01', title: 'Discover' },
        { number: '02', title: 'Define' },
        { number: '03', title: 'Design' },
        { number: '04', title: 'Build' },
        { number: '05', title: 'Connect' },
        { number: '06', title: 'Launch' },
      ],
    },
    capabilities: {
      tag: '( 5 ) Capabilities',
      items: [
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
      title: 'Real projects, real *scope.*',
      items: [
        {
          id: 'fuego',
          name: 'Fuego E-sports',
          category: 'Corporate Website',
          description:
            'Website for an e-sports organization showcasing its identity, roster, tournaments and achievements through a dynamic and immersive experience.',
        },
        {
          id: 'celestina',
          name: 'Celestina Cosmetics',
          category: 'E-commerce',
          description: 'Online store designed to improve product discovery, navigation and the buying experience.',
        },
        {
          id: 'leadgen',
          name: 'Lead Generation',
          category: 'Landing Page',
          description:
            'High-conversion landing experience focused on campaigns, lead capture and measurable business outcomes.',
        },
      ],
    },
    about: {
      tag: '( 7 ) About',
      statement:
        'We design and develop digital experiences that connect brands with people, drive measurable growth and turn business goals into real results.',
      supporting: 'From websites to intelligent business systems — we build it, you grow it.',
    },
    ecosystem: {
      tag: '( 3 ) Connected Ecosystem',
      title: 'Your digital ecosystem should work as *one* *system.*',
      nodes: [
        { label: 'Website', status: 'Live' },
        { label: 'CRM', status: 'Connected' },
        { label: 'AI', status: 'Active' },
        { label: 'Automation', status: 'Running' },
        { label: 'Analytics', status: 'Tracking' },
      ],
    },
    finalCta: {
      tag: '( 9 ) Make the solution a reality',
      title: 'Your next digital solution *starts* *here.*',
      description: 'Let’s transform your idea into a functional, intelligent and growth-focused digital experience.',
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
      title: 'Answers before you *ask.*',
      items: [
        {
          question: 'How much does a website cost?',
          answer:
            'A Landing Page is 300 USD, a Corporate Website is 450 USD and an E-commerce store is 600 USD. Platforms, portals and advanced integrations are quoted individually once we understand the scope.',
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
          question: 'How do I start a project with Kaede Project?',
          answer:
            'Write to us on WhatsApp or take the quick diagnostic on this page. We then go through Discover, Define, Design, Build, Connect and Launch, and confirm scope and timeline in a quote before we start.',
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
      finalMessage: 'You will receive a call from our team shortly.',
    },
  },
  es: {
    seo: {
      title: 'Kaede Project — Desarrollo Digital, IA y Automatización',
      description:
        'Kaede Project diseña y desarrolla sitios web, soluciones con IA, automatizaciones, CRM y plataformas digitales enfocadas en el crecimiento real de los negocios.',
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
    },
    hero: {
      eyebrow: 'Kaede Project / Soluciones Digitales',
      title: 'Hagamos *realidad* tu próximo proyecto.',
      description:
        'Diseñamos y desarrollamos soluciones digitales impulsadas por estrategia, tecnología e IA para ayudar a tu negocio a crecer más rápido.',
      ctaPrimary: 'Inicia tu proyecto',
      ctaSecondary: 'Explorar soluciones',
      whatsappUrl:
        'https://wa.me/573151883229?text=Hola.%20Estoy%20listo%20para%20iniciar%20un%20proyecto%20con%20ustedes.%20%C2%BFCu%C3%A1les%20son%20los%20siguientes%20pasos%3F',
    },
    dashboard: {
      barTitle: 'Kaede Operations',
      status: 'Todos los sistemas activos',
      action: 'Nuevo flujo',
      flow: ['Sitio web', 'Lead capturado', 'CRM', 'Calificación IA', 'Automatización', 'Equipo de ventas'],
      flowLabel: 'Flujo en vivo',
      cards: {
        leads: { label: 'Nuevos Leads', value: '+247' },
        automation: { label: 'Automatizado', value: '93%' },
        crm: { label: 'CRM', value: 'Pipeline Activo' },
        ai: { label: 'Agente IA', value: 'Activo' },
        website: { label: 'En línea', value: '99.9%' },
      },
      disclaimer: 'Interfaz ilustrativa — conceptual, no es un dashboard real de cliente.',
    },
    solutionsIntro: {
      tag: '( 1 ) Qué hacemos',
      title: 'Soluciones digitales creadas para objetivos de negocio *reales.*',
      description:
        'Desde sitios web hasta plataformas impulsadas por IA, creamos experiencias digitales que conectan marcas con personas, automatizan procesos y generan crecimiento medible.',
    },
    services: [
      {
        number: '01',
        title: 'Desarrollo Web',
        headline: 'Experiencias web desarrolladas alrededor de tu negocio.',
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
        title: 'Inteligencia Artificial',
        headline: 'Soluciones de IA diseñadas alrededor de procesos reales, no de tendencias.',
        items: [
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
        description: 'Asistentes y agentes de IA conectados a cómo realmente opera tu negocio.',
      },
      {
        tag: 'Conectar',
        title: 'Automatización + CRM',
        description: 'Tu sitio web, CRM, IA y equipo, funcionando como un solo sistema conectado.',
      },
    ],
    webDev: {
      tag: '( 2 ) Desarrollo Web',
      title: 'Un solo servicio web. Construido alrededor de lo que tu negocio realmente *necesita.*',
      bestForLabel: 'Ideal para',
      options: [
        {
          id: 'landing',
          name: 'Landing Page',
          price: '900.000 COP',
          description:
            'Una experiencia digital enfocada, diseñada para presentar tu oferta, capturar leads y convertir tráfico en oportunidades.',
          bestFor: ['Campañas', 'Lanzamientos de producto', 'Promociones de servicios', 'Generación de leads'],
          cta: 'Crear mi landing page',
          whatsappUrl:
            'https://wa.me/573151883229?text=Hola.%20Me%20interesa%20el%20plan%20de%20Landing%20Page.%20Quiero%20conocer%20los%20pasos%20para%20empezar.',
        },
        {
          id: 'corporate',
          name: 'Sitio Corporativo',
          price: "1'400.000 COP",
          description:
            'Un sitio web profesional diseñado para posicionar tu marca, comunicar tu valor y generar confianza con tus clientes.',
          bestFor: ['Empresas', 'Agencias', 'Marcas en crecimiento', 'Instituciones'],
          cta: 'Crear mi sitio web',
          whatsappUrl:
            'https://wa.me/573151883229?text=Hola.%20Quiero%20desarrollar%20un%20Sitio%20Web%20Corporativo%20con%20ustedes.%20Me%20gustar%C3%ADa%20discutir%20los%20detalles.',
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          price: "1'900.000 COP",
          description:
            'Una tienda online escalable diseñada para mostrar productos, simplificar las compras y potenciar tus ventas digitales.',
          bestFor: ['Marcas de retail', 'Catálogos de producto', 'Marcas de belleza', 'Negocios basados en productos'],
          cta: 'Crear mi tienda online',
          whatsappUrl:
            'https://wa.me/573151883229?text=Hola.%20Busco%20crear%20una%20tienda%20en%20l%C3%ADnea%20(E-commerce).%20%C2%BFPodemos%20agendar%20una%20reuni%C3%B3n%20para%20iniciar%3F',
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
            'https://wa.me/573151883229?text=Hola.%20Quiero%20transformar%20mi%20idea%20en%20una%20soluci%C3%B3n%20digital%20con%20Kaede%20Project.%20%C2%BFC%C3%B3mo%20podemos%20empezar%3F',
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
      title: 'Estrategia, diseño y tecnología trabajando *juntas.*',
      stages: [
        { number: '01', title: 'Descubrir' },
        { number: '02', title: 'Definir' },
        { number: '03', title: 'Diseñar' },
        { number: '04', title: 'Desarrollar' },
        { number: '05', title: 'Conectar' },
        { number: '06', title: 'Lanzar' },
      ],
    },
    capabilities: {
      tag: '( 5 ) Capacidades',
      items: [
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
      title: 'Proyectos reales, alcance *real.*',
      items: [
        {
          id: 'fuego',
          name: 'Fuego E-sports',
          category: 'Sitio Corporativo',
          description:
            'Sitio web para una organización de e-sports que muestra su identidad, roster, torneos y logros a través de una experiencia dinámica e inmersiva.',
        },
        {
          id: 'celestina',
          name: 'Celestina Cosmetics',
          category: 'E-commerce',
          description: 'Tienda online diseñada para mejorar el descubrimiento de productos, la navegación y la experiencia de compra.',
        },
        {
          id: 'leadgen',
          name: 'Lead Generation',
          category: 'Landing Page',
          description:
            'Experiencia de landing de alta conversión enfocada en campañas, captura de leads y resultados de negocio medibles.',
        },
      ],
    },
    about: {
      tag: '( 7 ) Nosotros',
      statement:
        'Diseñamos y desarrollamos experiencias digitales que conectan marcas con personas, generan crecimiento medible y convierten objetivos de negocio en resultados reales.',
      supporting: 'Desde sitios web hasta sistemas empresariales inteligentes — nosotros lo construimos, tú lo haces crecer.',
    },
    ecosystem: {
      tag: '( 3 ) Ecosistema Conectado',
      title: 'Tu ecosistema digital debería funcionar como *un* *solo* *sistema.*',
      nodes: [
        { label: 'Sitio Web', status: 'Activo' },
        { label: 'CRM', status: 'Conectado' },
        { label: 'IA', status: 'Activa' },
        { label: 'Automatización', status: 'Ejecutando' },
        { label: 'Analítica', status: 'Monitoreando' },
      ],
    },
    finalCta: {
      tag: '( 9 ) Hagamos realidad la solución',
      title: 'Tu próxima solución digital *empieza* *aquí.*',
      description: 'Transformemos tu idea en una experiencia digital funcional, inteligente y enfocada en el crecimiento.',
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
      title: 'Respuestas antes de que *preguntes.*',
      items: [
        {
          question: '¿Cuánto cuesta una página web?',
          answer:
            'Una Landing Page cuesta 900.000 COP, un Sitio Corporativo 1\'400.000 COP y una tienda E-commerce 1\'900.000 COP. Las plataformas, portales e integraciones avanzadas se cotizan de forma individual una vez entendemos el alcance.',
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
          question: '¿Cómo inicio un proyecto con Kaede Project?',
          answer:
            'Escríbenos por WhatsApp o haz el diagnóstico rápido en esta página. Después recorremos Descubrir, Definir, Diseñar, Desarrollar, Conectar y Lanzar, y confirmamos alcance y tiempos en una cotización antes de empezar.',
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
      finalMessage: 'En breve recibirá una llamada de nuestro equipo',
    },
  },
}
