# Migration guide

## Upgrading from 0.4 to 0.5

- Update all installed `@caderno-ui/*` packages together; remove development
  `link:` / `file:` overrides from the delivery lockfile.
- Tooling now requires Node 22.12 or newer (CI: 22/24).
- React forms explicitly map native `input` and `change`. Use `onInput` for
  controlled text editing, not the per-keystroke `onChange` convention of React
  native inputs. Read `.value` / `.checked` from `event.currentTarget`.
- Checkbox, switch and radio emit `input` followed by `change` for the same
  discrete action, with the updated state available to both handlers. A React
  render triggered by the input handler cannot revert the pending commit.
- Reset controlled React state in `form.onReset`. Native form reset now restores
  the initial property value, including values provided by adapters.
- Component React subpaths retain `use client`. In Next.js keep event callbacks
  in client files; native slotted content remains server-renderable. This does
  not provide Lit shadow-root SSR.
- Async toast completion no longer revives dismissed notifications or removed
  hosts. Mount a host for the lifetime of the flow that owns the feedback.
- List item `action` slots accept consumer-owned anchors, router links or buttons.
  Use `compact` for the borderless list without changing markers or numbering.
- Shared `typography.css` and `prose.css` own editorial text. Remove duplicated
  product-level styling rather than overriding library parts to recreate it.

## Upgrading from 0.3 to 0.4

Update all installed `@caderno-ui/*` packages to `0.4.0` together. Keep imports
selective and use the published packages in your application; a local link is only
an opt-in development workflow.

- White is now the default theme. Set `data-theme="dark"` explicitly for dark
  mode. Let site tokens reference Caderno tokens instead of overriding the
  library with a second palette.
- `cad-paper` and `cad-tape`, their import paths, and their adapters were removed.
  Use `cad-card` for a content surface or `cad-note` for a note. Decorative tape
  is part of the note, not a separate component.
- Cards are flat by default. Remove an explicit `folded` setting to adopt the
  default, or retain it only where the folded treatment is intentional.
- `cad-step` uses `status` instead of `tone`: `pending`, `current`, `complete`,
  `warning`, `error`, or `disabled`. Do not translate a decorative color into a
  completion state. Use the marker and status slots for contextual content.
- `cad-progress` is a horizontal native progress bar. Replace `variant="steps"`,
  `current`, and `steps` with `value` and `max`, or use `cad-steps` for a sequence.
  The ring variant and its CSS part were removed. Progress tones are `blue`,
  `mint`, `amber`, `red`, and `neutral`; replace `lemon` with `amber` and `coral`
  with `red` where those colors indicate warning and error states.
- Chart legends are opt-in with `show-legend`. Tab tones are deprecated and
  ignored; inactive tabs use the surface and the active tab uses blue.
- Import `@caderno-ui/elements/scrollbar.css` to adopt the shared scrollbar and
  remove equivalent consumer scrollbar rules.

Run integration tests in an isolated copy with temporary content and fresh
browser contexts. Never point fixture generation at the developer's content
directory or reuse the developer's browser storage.

## Consumer boundary

Applications own product content, routes, and layout. Components, typography,
tokens, and interactions come from Caderno UI. Report shared defects with a
self-contained reproduction using the public library API, without requiring
access to a particular application.
Vue and Svelte currently use native custom elements, without new adapters.

## Acceptance checks for every component

- Semantic and keyboard behavior works in a real browser.
- Public events bubble and are composed.
- Light and dark themes use the same documented tokens.
- Server-rendered content has a useful pre-upgrade state.
- The package exposes an individual import path.
- Lit, React, and Astro types compile without duplicating the implementation.
