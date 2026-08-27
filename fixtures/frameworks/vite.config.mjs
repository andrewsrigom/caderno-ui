import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'node:path'
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: { isCustomElement: (tag) => tag.startsWith('cad-') },
      },
    }),
    svelte(),
    {
      name: 'assert-selective-caderno-imports',
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type !== 'chunk') continue
          for (const module of Object.keys(output.modules)) {
            if (/roughjs|cad-chart|\/gsap\/|@caderno-ui\/motion/.test(module))
              throw new Error(
                `Optional dependency leaked into the consumer: ${module}`,
              )
          }
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        react: resolve('react/index.html'),
        vue: resolve('vue/index.html'),
        svelte: resolve('svelte/index.html'),
      },
    },
  },
})
