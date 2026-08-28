# @caderno-ui/elements

## 0.5.1

### Patch Changes

- 4976e28: Keep primary button text readable on hover. Fix unnecessary vertical scrolling in Kanban columns and allow boards to shrink inside grid layouts.
- 54d511a: Clarify package READMEs and replace abstract example text with note-taking scenarios. No API, style, or behavior changes.
- @caderno-ui/icons@0.5.1

## 0.5.0

### Minor Changes

- e18736b: Preserve the default handwritten blue list, individual dashed borders, solid bullets, and circled numbers. Add `compact` to remove row frames and extra spacing without changing the markers. Native editorial lists keep their existing styles.

  Add an `action` slot for a native anchor or button, including router links. The control owns the entire row and its behavior; the list keeps the border and decorative trailing arrow without nesting or proxying controls. Static items have no arrow. The native `href` shortcut remains available. Documentation and React Router integration tests cover static content, navigation, and asynchronous actions.

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

- e18736b: Expose shared typography classes and align editorial content with component text roles. Code blocks now highlight native server-rendered pre/code content while preserving the source for copying and no-JavaScript reading. Buttons and list links delegate programmatic focus to their native controls.

  Omit false boolean attributes in Astro adapters so breadcrumb links, list items, and form controls keep their intended state.

### Patch Changes

- Updated dependencies [e18736b]
  - @caderno-ui/icons@0.5.0

## 0.4.1

### Patch Changes

- Keep step titles, markers, and metadata in their named slots in Astro. Adapt horizontal steps to the available container width so they do not overlap adjacent content.
- @caderno-ui/icons@0.4.1

## 0.4.0

### Minor Changes

- Keep form-control declarations compatible with TypeScript 5 and 6 by using
  the platform `ShadowRootInit` contract for focus delegation.

- 64d9a4a: Add `cad-drawer` as a modal edge panel with four placements, three sizes, focus restoration, scroll locking, and typed lifecycle events across Elements, React, and Astro.

  Add the standalone `cad-doodle-avatar`, composable `cad-list`, form-associated `cad-switch`, single-value or range `cad-slider`, and top-layer `cad-popover` components, expose them through the Elements, React, and Astro entrypoints, refine the notebook visual language across form controls, navigation, content, and data-display components, rework `cad-highlight` with native marker, underline, and double-stroke treatments in seven tones, redesign `cad-spinner` with semantic tones, four sizes, and seven indeterminate motion treatments, rebuild `cad-steps` around explicit progress states, circular markers, responsive orientations, and composable marker and status slots, simplify `cad-progress` around native horizontal progress with sizes and semantic tones, and remove the redundant `cad-paper` and `cad-tape` public components.

  Add the composable `cad-footer` landmark and `cad-footer-group` mobile disclosure across Elements, React, and Astro, with named application regions, four visual variants, responsive navigation, and accessible keyboard behavior.

  Add the responsive `cad-header` banner across Elements, React, and Astro, with product-owned composition slots, five visual variants, an optional notebook handle, container-aware compact navigation, and a typed menu-toggle event.

  Complete the BIC-pen visual pass across radio, checklist, bookmark, tooltip, skeleton, chart, Kanban, sticker, avatar, icon, and the Astro table of contents. Make chart legends opt-in so Cartesian charts do not repeat every data label as a series, while donut examples can request the legend explicitly.

  Rework the component documentation around a primary live example followed by compact, faithful galleries for meaningful variants and persistent states. The rendered examples and their copyable source now cover chart types, feedback tones, loading treatments, layouts, placements, compositions, and responsive surfaces without multiplying decorative color combinations.

  Make cards flat by default, place the title inside a ruled header, and add a `plain` variant that keeps header and footer dividers without an outer border. The folded treatment is now opt-in across Elements and Astro, and the no-JavaScript fallback follows the same section layout.

  Use the public components in the documentation shell, homepage cards/actions, API tables, and code disclosures. Add opt-in CodeBlock copying with accessible success/failure feedback and a typed `cad-code-copy` event, body typography and code-formatted table columns, and native-HTML navigation styles. Forward current-link semantics and repair named slots and boolean serialization in the Astro adapters. Omit absent header/footer regions and keep modal keyboard focus inside slotted content. Test the production documentation on an isolated origin.

  Make the shared token theme white by default. Dark mode now requires an explicit `data-theme="dark"` selection. Documentation no longer follows the operating system's dark preference automatically. Simplify the documentation copy around handwritten notes, practical usage, and concise component descriptions.

  Use a continuous light-blue header band with blue text in tables, without per-column borders or underlines. Apply the same header treatment to native prose tables and remove repeated component names from API table captions. Make the table scroll container keyboard-focusable with the shared focus outline.

  Use neutral surfaces for inactive tabs and blue with contrasting text for the selected tab. Remove decorative tab colors from examples, deprecate the ignored tab `tone` setting without breaking existing consumers, and keep keyboard focus visible inside the tab strip.

  Add an opt-in `@caderno-ui/elements/scrollbar.css` stylesheet for shared native page and component scrollbars, with theme-aware blue ink, square thumbs where supported, and platform controls in forced-color and touch modes.

  Refine badges as compact, non-interactive status annotations: replace the button-like frame with a decorative ink marker and a subtle highlight. Keep existing tones, customization tokens, and start slots; use an open marker without the highlight for the outline variant. Match the no-JavaScript fallback and add faithful examples in context.

### Patch Changes

- @caderno-ui/icons@0.4.0

## 0.3.1

### Patch Changes

- 4ead231: Replace the rotating prose accordion arrow glyph with a stable CSS chevron.
- @caderno-ui/icons@0.3.1

## 0.3.0

### Minor Changes

- 4916af4: Add a shared motion vocabulary, animated accordion disclosure, viewport-aware
  chart drawing and replay, dynamic tab and modal entrances, and an opt-in GSAP
  package with scoped enter, exit, stagger, and scroll-reveal choreography.
- 4916af4: Add canonical compact breadcrumbs, editorial prose enhancement and styling, a table-of-contents facade, stable first-frame fallbacks, and the complete handwriting type scale.
- 4916af4: Add the composable `cad-skeleton` loading placeholder with text, rectangle, and
  circle shapes, bounded text lines, motion preferences, and framework adapters.

### Patch Changes

- @caderno-ui/icons@0.3.0

## 0.2.1

### Patch Changes

- @caderno-ui/icons@0.2.1

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
  Add a neutral Paper primitive with ruled, grid, dotted, and blank patterns.
  Upgrade CodeBlock with dependency-free syntax formatting and an actions slot,
  connect responsive Steps visually, and keep Modal title heading semantics
  owned by the consuming application.

### Patch Changes

- Updated dependencies [b1a3b36]
  - @caderno-ui/icons@0.2.0
