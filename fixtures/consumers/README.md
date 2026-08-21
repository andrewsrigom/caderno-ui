# Packed-package consumer fixtures

These fixtures are copied to an ignored artifact directory and installed from
the five packed `.tgz` files. They intentionally sit outside the pnpm
workspace, so source aliases and workspace links cannot make a broken publish
appear healthy.

`pnpm consumers:check` covers HTML/Vite, React CSR and SSR, Astro static build,
TypeScript Bundler and NodeNext resolution, and direct Node ESM imports. CI
runs the same suite across the supported Node, React, and Astro matrix.
