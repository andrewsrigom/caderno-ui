import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Local source and its adapter dependency must share the renderer's React.
  resolve: { dedupe: ['react', 'react-dom'] },
  test: {
    include: ['test/*.browser.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
    },
    restoreMocks: true,
  },
})
