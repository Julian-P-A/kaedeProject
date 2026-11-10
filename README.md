
# Kaede Project

### IT & AI Consulting and Development

Sitio web corporativo de **Kaede Project**, una marca enfocada en consultoría tecnológica, desarrollo web, inteligencia artificial, automatización de procesos y soluciones digitales para empresas.

El proyecto fue desarrollado utilizando tecnologías modernas del ecosistema React, con énfasis en rendimiento, experiencia de usuario, diseño responsive, accesibilidad y posicionamiento SEO.

🌐 **Sitio web:** [www.kaedeproject.com](https://www.kaedeproject.com)

---

## Tecnologías utilizadas

- **React 19** — Desarrollo de interfaces mediante componentes reutilizables.
- **TypeScript** — Tipado estático y mayor mantenibilidad del código.
- **TanStack Start** — Framework para aplicaciones React con renderizado del lado del servidor.
- **TanStack Router** — Enrutamiento basado en archivos.
- **Vite 8** — Herramienta de desarrollo y compilación.
- **Tailwind CSS 4** — Estilos y diseño responsive.
- **Framer Motion** — Animaciones e interacciones visuales.
- **Radix UI** — Componentes interactivos accesibles.
- **Web3Forms** — Recepción de formularios de contacto.
- **Playwright** — Pruebas automatizadas de extremo a extremo.
- **Nitro** — Infraestructura de servidor y despliegue.

## Funcionalidades principales

### 1. Sitio web corporativo

Landing page diseñada para presentar los servicios, proyectos, soluciones tecnológicas e identidad de Kaede Project.

Incluye:

- Diseño responsive para móviles, tablets y escritorio.
- Navegación interactiva entre secciones.
- Animaciones durante el desplazamiento.
- Componentes visuales reutilizables.
- Presentación de servicios y portafolio.
- Sección de preguntas frecuentes.
- Botones de contacto mediante WhatsApp.

### 2. Soporte multilenguaje

El sitio está disponible en español e inglés.

- `/es` — Versión en español.
- `/en` — Versión en inglés.

La ruta principal detecta el idioma preferido del navegador y redirige a la versión correspondiente.

### 3. Diagnóstico interactivo

Herramienta que permite identificar las necesidades digitales de un potencial cliente mediante un cuestionario de siete preguntas.

El sistema:

1. Presenta las preguntas de diagnóstico.
2. Registra las respuestas seleccionadas.
3. Evalúa los resultados mediante reglas de decisión.
4. Genera una recomendación según el perfil del usuario.
5. Solicita información de contacto.
6. Envía los datos mediante Web3Forms.

### 4. Servicios y planes

Presentación de soluciones de desarrollo web y servicios tecnológicos, incluyendo:

- Landing pages.
- Sitios web corporativos.
- Comercio electrónico.
- Desarrollo web personalizado.
- Consultoría en inteligencia artificial.
- Automatización de procesos.
- Integraciones de CRM y ecosistemas digitales.

Los planes se muestran con información adaptada al idioma y mercado correspondiente.

### 5. Animaciones e interacciones

Se implementaron diferentes componentes para mejorar la experiencia visual:

- Animaciones de aparición mediante scroll.
- Efectos de escritura y revelación de textos.
- Animaciones ASCII.
- Cursor personalizado.
- Contadores animados.
- Transiciones entre componentes.
- Etapas del proyecto con fotografías y una capa ASCII.
- Galería de proyectos con dos filas en movimiento continuo.

Las animaciones contemplan las preferencias de movimiento reducido del usuario.

### 6. Optimización SEO

El sitio incorpora configuraciones para mejorar su indexación y presentación en buscadores:

- Metadatos dinámicos por idioma.
- Etiquetas Open Graph.
- Etiquetas canonical y hreflang.
- Datos estructurados JSON-LD.
- Sitemap XML.
- Archivo robots.txt.
- Imágenes para compartir en redes sociales.
- Información estructurada de servicios y preguntas frecuentes.

### 7. Analítica y contacto

- Integración con Google Tag Manager.
- Formulario de diagnóstico conectado a Web3Forms.
- Enlaces de contacto mediante WhatsApp.
- Enlaces hacia redes sociales y portafolio.

---

## Estructura del proyecto

```text
kaedeProject/
├── public/
│   ├── ascii/
│   ├── fonts/
│   ├── logo.png
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── components/
│   │   ├── animations/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Solutions.tsx
│   │   ├── Diagnostic.tsx
│   │   ├── Projects.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   │
│   ├── context/
│   │   ├── LanguageContext.tsx
│   │   └── DiagnosticContext.tsx
│   │
│   ├── data/
│   │   ├── translations.ts
│   │   └── pricing.ts
│   │
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   └── styles.css
│
├── tests/
│   ├── e2e/
│   └── *.test.ts
│
├── scripts/
├── package.json
├── vite.config.ts
├── playwright.config.ts
└── tsconfig.json
```

## Instalación y ejecución

### Requisitos previos

- Node.js en una versión compatible con las dependencias del proyecto.
- npm.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Julian-P-A/kaedeProject.git
```

### 2. Acceder al directorio

```bash
cd kaedeProject
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

```env
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

La clave de Web3Forms es necesaria para enviar los resultados del formulario de diagnóstico.

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en:

```text
http://localhost:3000
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza la compilación |
| `npm run typecheck` | Comprueba los tipos de TypeScript |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta pruebas unitarias |
| `npm run test:e2e` | Ejecuta pruebas E2E con Playwright |
| `npm run generate-routes` | Genera el árbol de rutas |

Para ejecutar las pruebas E2E por primera vez puede ser necesario instalar Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

## Arquitectura

La aplicación utiliza una arquitectura basada en componentes React y enrutamiento mediante TanStack Router.

La organización del código permite separar:

- **Componentes:** elementos de interfaz y secciones del sitio.
- **Contextos:** manejo del idioma y estado del diagnóstico.
- **Datos:** traducciones y configuración de planes.
- **Hooks:** reutilización de lógica de React.
- **Librerías internas:** funciones de contacto, SEO y diagnóstico.
- **Rutas:** navegación y carga de páginas.
- **Pruebas:** validación de lógica y comportamiento de la aplicación.

## Despliegue

El proyecto utiliza Nitro y dispone de configuración para despliegue en Vercel mediante su preset correspondiente.

Para generar una compilación de producción:

```bash
npm run build
```

Antes del despliegue se deben configurar las variables de entorno necesarias en la plataforma de alojamiento.

## Pruebas

El proyecto incluye pruebas para verificar:

- Lógica del diagnóstico interactivo.
- Comportamiento de idiomas y redirecciones.
- Generación de enlaces de contacto.
- Configuración de precios.
- Interacciones del formulario.
- Navegación móvil.
- Accesibilidad del diálogo.
- Comportamiento de componentes visuales.

## Objetivo del proyecto

Desarrollar una experiencia web moderna que represente la identidad digital de Kaede Project y facilite la presentación de sus servicios tecnológicos.

El proyecto integra diseño de interfaces, desarrollo frontend, renderizado del lado del servidor, internacionalización, optimización SEO y herramientas de captación de clientes.

## Autor

**Julian-P-A**

GitHub: [github.com/Julian-P-A](https://github.com/Julian-P-A)

## Sitio oficial

[Kaede Project](https://www.kaedeproject.com)

---

Desarrollado con React, TypeScript y TanStack Start.
