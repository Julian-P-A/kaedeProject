import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // Vite handles development requests before Nitro's production route rules.
  server: {
    proxy: {
      '/gtagmetrics/': {
        target: 'https://www.googletagmanager.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gtagmetrics\//, '/'),
      },
    },
  },
  plugins: [
    devtools(),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : undefined,
      rollupConfig: { external: [/^@sentry\//] },
      // First-party path for Google Tag Manager (loaded from __root.tsx), so
      // the tag is served from our own domain. On Vercel this becomes an edge rewrite.
      routeRules: {
        '/gtagmetrics/**': { proxy: 'https://www.googletagmanager.com/**' },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
