import { defineConfig } from 'astro/config'

const isDevelopmentServer = process.argv.includes('dev')

export default defineConfig({
  base: isDevelopmentServer ? '/' : '/caderno-ui',
  site: 'https://andrewsrigom.github.io',
  trailingSlash: 'always',
})
