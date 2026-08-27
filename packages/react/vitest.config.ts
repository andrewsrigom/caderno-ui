import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    conditions: ['browser'],
  },
  test: {
    include: ['test/react.test.ts'],
    environment: 'jsdom',
    restoreMocks: true,
  },
})
