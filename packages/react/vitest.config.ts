import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
    restoreMocks: true,
  },
})
