# @caderno-ui/motion

## 0.5.1

### Patch Changes

- 54d511a: Clarify package READMEs and replace abstract example text with note-taking scenarios. No API, style, or behavior changes.

## 0.5.0

### Minor Changes

- e18736b: Consolidate framework integration without changing the visual direction.

  - Require Node 22.12 or newer; verify Node 22/24 and React 18/19.
  - Publish React component entrypoints with `use client` for App Router consumers.
  - Map native form `input` and `change` events explicitly. React `onInput` reports editing; `onChange` reports native commitment, unlike React's native text inputs.
  - Reset form controls to initial properties as well as initial HTML attributes.
  - Synchronize checkbox state and FormData before dispatching `input`; keep checkbox and switch edit/commit events consistent even when React rerenders between native events.
  - Do not recreate dismissed toasts or unmounted hosts when asynchronous tasks settle.
  - Add an isolated Next.js notes example and packed React, Next, Vue and Svelte consumers.
  - Keep feedback and link inks readable across themes, without out-of-sync palette transitions.
  - Self-host the existing Caveat typeface in the documentation and examples instead of relying on local font installation.

  See the migration guide for event handling, selective imports and SSR limitations.

## 0.4.1

## 0.4.0

## 0.3.1

## 0.3.0

### Minor Changes

- 4916af4: Add a shared motion vocabulary, animated accordion disclosure, viewport-aware
  chart drawing and replay, dynamic tab and modal entrances, and an opt-in GSAP
  package with scoped enter, exit, stagger, and scroll-reveal choreography.
