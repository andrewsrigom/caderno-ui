# @caderno-ui/icons

## 0.5.1

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

## 0.2.1

## 0.2.0

### Minor Changes

- b1a3b36: Prepare Caderno UI's public contracts, packaging, compatibility tests, tokens,
  component tooling, and release automation for safely expanding the library.
  Add Badge, Note, and Progress primitives plus optional accessible bar, line, and
  donut charts rendered with Rough.js. Promote the reusable SeniorPath action and
  content foundations into Button, Link, Card, Divider, and static Callout public
  contracts, including Astro and React adapters, no-JavaScript fallbacks, API
  documentation, accessibility coverage, and refined laboratory examples.
  Add form-associated Input, Textarea, Checkbox, and Radio controls with native
  FormData, validation, reset, fieldset, and keyboard behavior. Add Accordion and
  AccordionItem on native details/summary semantics with optional single-open
  coordination and a composed toggle event.
  Add Spinner, Tooltip, Modal, Toast, and ToastHost feedback primitives with
  accessible native semantics, typed public events, focus management, safe
  imperative notifications, framework adapters, and cross-browser examples.
  Add Breadcrumb, Pagination, Avatar, Highlight, Tape, and Sticker primitives so
  navigation, identity, and notebook annotations can move out of application
  code while preserving native links, list semantics, visible fallbacks, and
  theme-safe decoration.
  Expand Progress with accessible bar, segmented, and ring variants, and align
  the pink and violet tone contracts used by notebook notes and annotations.
  Refine Card and Tabs into compound component families, replace implicit icon
  properties with explicit composition slots, and enforce per-entrypoint icon and
  Rough.js isolation in CI. Recover semantic Table, Blockquote, Checklist,
  CodeBlock, EmptyState, Steps, and Kanban families from proven application
  patterns, with framework adapters, progressive fallbacks, realistic docs, and
  cross-browser accessibility coverage.
