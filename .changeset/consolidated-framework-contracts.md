---
'@caderno-ui/elements': minor
'@caderno-ui/react': minor
'@caderno-ui/astro': minor
'@caderno-ui/icons': minor
'@caderno-ui/motion': minor
'@caderno-ui/tokens': minor
---

Consolidate framework integration without changing the visual direction.

- Require Node 22.12 or newer; verify Node 22/24 and React 18/19.
- Publish React component entrypoints with `use client` for App Router consumers.
- Map native form `input` and `change` events explicitly. React `onInput` reports editing; `onChange` reports native commitment, unlike React's native text inputs.
- Reset form controls to initial properties as well as initial HTML attributes.
- Synchronize checkbox state and FormData before dispatching `input`.
- Do not recreate dismissed toasts or unmounted hosts when asynchronous tasks settle.
- Add an isolated Next.js notes example and packed React, Next, Vue and Svelte consumers.
- Keep feedback and link inks readable across themes, without out-of-sync palette transitions.
- Self-host the existing Caveat typeface in the documentation and examples instead of relying on local font installation.

See the migration guide for event handling, selective imports and SSR limitations.
