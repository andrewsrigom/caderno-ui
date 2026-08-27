# SeniorPath migration

## Upgrading from 0.3 to 0.4

Update all installed `@caderno-ui/*` packages to `0.4.0` together. Keep imports
selective and use the published packages in SeniorPath; a local link is only
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

## Current slice

The first migration proves the shared architecture with components that cover different contracts:

- `cad-alert`: slots, variants, dismiss action, and a composed event.
- `cad-bookmark`: pressed state, storage persistence, and a composed event.
- `cad-tabs` with `cad-tab`: declarative children, keyboard navigation, named tab panels, and no-JavaScript content.
- `cad-icon`: the shared renderer for the existing 40 SeniorPath doodles.

SeniorPath keeps its existing Astro component imports as compatibility facades. The facades now delegate to `@caderno-ui/astro`, so product pages can migrate incrementally without a broad call-site rewrite.

SeniorPath consumes published package versions. Local links may be used while
developing a shared fix, but must not remain in a release lockfile.

## Recommended sequence

1. Publish the initial package set and consume exact compatible versions in SeniorPath.
2. Migrate low-state primitives next: button, link, badge, divider, sticker, and callout.
3. Migrate form controls with browser-level accessibility tests.
4. Migrate composed feedback components: toast, modal, tooltip, and empty state.
5. Migrate navigation and content recipes after their application-specific behavior has been separated from the visual primitive.
6. Add a Vue adapter only when a real Vue consumer exists; validate it against the same custom-element fixtures.

## Acceptance checks for every component

- Semantic and keyboard behavior works in a real browser.
- Public events bubble and are composed.
- Light and dark themes use the same documented tokens.
- Server-rendered content has a useful pre-upgrade state.
- The package exposes an individual import path.
- Lit, React, and Astro types compile without duplicating the implementation.
