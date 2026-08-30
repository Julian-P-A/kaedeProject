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
  context/          LanguageContext (EN/ES state)
  data/translations.ts   All bilingual copy, single source of truth
  routes/           TanStack Router routes (__root.tsx, index.tsx)
public/             Static assets (favicons, project images, robots.txt, sitemap.xml)
```

## i18n

Language defaults to English and switches client-side (no reload) via the selector in the header. All copy lives in `translations.ts` — add a new key there for both `en` and `es` when adding content.
