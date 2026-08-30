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
  pricing: { heading: string; note: string; quote: string }
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
  footer: { copyright: string; secondary: string }
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
        { label: 'Projects', href: '#projects' },
        { label: 'Solutions', href: '#solutions' },
        { label: 'About', href: '#about' },
        { label: 'Pricing', href: '#pricing' },
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
      tag: '( 2 ) What we do',
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
      tag: '( 6 ) Web Development',
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
        },
        {
          id: 'corporate',
          name: 'Corporate Website',
          price: '450 USD',
          description:
            'A professional website designed to position your brand, communicate your value and create trust with clients.',
          bestFor: ['Companies', 'Agencies', 'Growing brands', 'Institutions'],
          cta: 'Build my website',
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          price: '600 USD',
          description:
            'A scalable online store designed to showcase products, simplify purchases and support your digital sales.',
          bestFor: ['Retail brands', 'Product catalogs', 'Beauty brands', 'Product-based businesses'],
          cta: 'Create my online store',
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
        },
      ],
    },
    pricing: {
      heading: 'Web development options',
      note: 'Custom requirements may require a tailored scope.',
      quote: 'Request a quote',
    },
    process: {
      tag: '( 8 ) Process',
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
      tag: '( 9 ) Capabilities',
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
      tag: '( 3 ) Selected projects',
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
      tag: '( 4 ) About',
      statement:
        'We design and develop digital experiences that connect brands with people, drive measurable growth and turn business goals into real results.',
      supporting: 'From websites to intelligent business systems — we build it, you grow it.',
    },
    ecosystem: {
      tag: '( 7 ) Connected Ecosystem',
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
      tag: '( 5 ) Make the solution a reality',
      title: 'Your next digital solution *starts* *here.*',
      description: 'Let’s transform your idea into a functional, intelligent and growth-focused digital experience.',
      ctaPrimary: 'Let’s build it',
      ctaSecondary: 'Request a quote',
    },
    footer: {
      copyright: '© 2026 Kaede Project. All rights reserved.',
      secondary: 'Designed and built by Kaede Project.',
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
        { label: 'Proyectos', href: '#projects' },
        { label: 'Soluciones', href: '#solutions' },
        { label: 'Nosotros', href: '#about' },
        { label: 'Precios', href: '#pricing' },
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
      tag: '( 2 ) Qué hacemos',
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
      tag: '( 6 ) Desarrollo Web',
      title: 'Un solo servicio web. Construido alrededor de lo que tu negocio realmente *necesita.*',
      bestForLabel: 'Ideal para',
      options: [
        {
          id: 'landing',
          name: 'Landing Page',
          price: '300 USD',
          description:
            'Una experiencia digital enfocada, diseñada para presentar tu oferta, capturar leads y convertir tráfico en oportunidades.',
          bestFor: ['Campañas', 'Lanzamientos de producto', 'Promociones de servicios', 'Generación de leads'],
          cta: 'Crear mi landing page',
        },
        {
          id: 'corporate',
          name: 'Sitio Corporativo',
          price: '450 USD',
          description:
            'Un sitio web profesional diseñado para posicionar tu marca, comunicar tu valor y generar confianza con tus clientes.',
          bestFor: ['Empresas', 'Agencias', 'Marcas en crecimiento', 'Instituciones'],
          cta: 'Crear mi sitio web',
        },
        {
          id: 'ecommerce',
          name: 'E-commerce',
          price: '600 USD',
          description:
            'Una tienda online escalable diseñada para mostrar productos, simplificar las compras y potenciar tus ventas digitales.',
          bestFor: ['Marcas de retail', 'Catálogos de producto', 'Marcas de belleza', 'Negocios basados en productos'],
          cta: 'Crear mi tienda online',
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
        },
      ],
    },
    pricing: {
      heading: 'Opciones de desarrollo web',
      note: 'Los requerimientos a medida pueden necesitar un alcance personalizado.',
      quote: 'Solicitar cotización',
    },
    process: {
      tag: '( 8 ) Proceso',
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
      tag: '( 9 ) Capacidades',
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
      tag: '( 3 ) Proyectos seleccionados',
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
      tag: '( 4 ) Nosotros',
      statement:
        'Diseñamos y desarrollamos experiencias digitales que conectan marcas con personas, generan crecimiento medible y convierten objetivos de negocio en resultados reales.',
      supporting: 'Desde sitios web hasta sistemas empresariales inteligentes — nosotros lo construimos, tú lo haces crecer.',
    },
    ecosystem: {
      tag: '( 7 ) Ecosistema Conectado',
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
      tag: '( 5 ) Hagamos realidad la solución',
      title: 'Tu próxima solución digital *empieza* *aquí.*',
      description: 'Transformemos tu idea en una experiencia digital funcional, inteligente y enfocada en el crecimiento.',
      ctaPrimary: 'Construyámoslo',
      ctaSecondary: 'Solicitar cotización',
    },
    footer: {
      copyright: '© 2026 Kaede Project. Todos los derechos reservados.',
      secondary: 'Diseñado y desarrollado por Kaede Project.',
    },
  },
}
