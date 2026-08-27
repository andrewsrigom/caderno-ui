import { defineConfig } from '@playwright/test'

// Separate origin and fresh browser contexts: never reuse a developer's demo.
export default defineConfig({
  testDir: './tests/docs',
  outputDir: '.artifacts/docs-tests',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5187/caderno-ui/',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    browserName: 'chromium',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command:
      'pnpm --filter @caderno-ui/docs exec astro preview --host 127.0.0.1 --port 5187',
    url: 'http://127.0.0.1:5187/caderno-ui/',
    reuseExistingServer: false,
  },
})
