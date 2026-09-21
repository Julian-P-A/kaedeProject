# Kaede Project

Bilingual (EN/ES) landing page for **Kaede Project**, a digital development company specializing in web development, AI, automation, and CRM/integrations.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing)
- Vite
- Tailwind CSS v4
- Framer Motion

No backend, no database, no CMS — a single static/SSR route with all copy centralized in `src/data/translations.ts`.

## Getting started

```bash
bun install
bun --bun run dev
```

The site runs at `http://localhost:3000`.

## Build

```bash
bun run build
```

Output is written to `.output/`. Preview it with:

```bash
npx vite preview
```

## Project structure

```text
src/
  components/       Page sections (Header, Hero, Solutions, Projects, Footer, ...)
  components/animations/  Reusable Framer Motion reveal primitives
  context/          LanguageContext (language taken from the URL)
  data/translations.ts   All bilingual copy, single source of truth
  routes/           TanStack Router routes (__root.tsx, index.tsx)
public/             Static assets (favicons, project images, robots.txt, sitemap.xml)
```

## i18n

Each language has its own URL (`/en`, `/es`) with `canonical` and `hreflang` tags, and the header selector links between them. `/` is the `hreflang` x-default: it redirects to the language in the browser's `Accept-Language` header (English if none matches). SEO tags and JSON-LD (Organization, Service, FAQPage) are built per language in `src/lib/seo.ts`; `public/` holds `robots.txt` (AI crawlers allowed), `sitemap.xml` and `llms.txt`. All copy lives in `translations.ts` — add a new key there for both `en` and `es` when adding content.
