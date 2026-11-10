import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  projects: [
    { name: 'chromium' },
    {
      name: 'webkit-iphone',
      testMatch: '**/ascii-video.spec.ts',
      use: { ...devices['iPhone 13'], browserName: 'webkit', launchOptions: {} },
    },
  ],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    browserName: 'chromium',
    reducedMotion: 'reduce',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3100 --strictPort',
    // Contact requests are intercepted by the tests; no real key is needed.
    env: { VITE_WEB3FORMS_ACCESS_KEY: 'playwright-test-key' },
    url: 'http://127.0.0.1:3100/en',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
})
