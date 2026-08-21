# Component proposal: `<cad-name>`

Copy this template for a component proposal before implementation. Delete
sections that genuinely do not apply, but make the omission explicit.

## Problem and boundary

- User problem:
- Why this belongs in the library:
- Non-goals:
- Comparable patterns reviewed:

## Public contract

- Tag and individual import:
- Attributes and reflected state:
- JavaScript-only properties:
- Slots and fallback content:
- Events, detail shape, bubbling, and composition:
- CSS custom properties and parts:
- Methods, if unavoidable:

## States and behavior

Describe defaults, disabled/read-only/invalid/empty/loading states, dynamic child
updates, reconnection, persistence, and failure behavior. Include a state table
when more than two states interact.

## Accessibility

- Native semantic or ARIA pattern:
- Accessible name source:
- Keyboard model and focus destination:
- Announcements and live-region behavior:
- High contrast, zoom/reflow, RTL, and reduced-motion considerations:
- Manual assistive-technology checks required:

## Framework and platform behavior

- HTML before upgrade and without JavaScript:
- React property/event mapping:
- Astro facade and fallback markup:
- SSR/import safety:
- Browser/platform APIs and fallback strategy:

## Verification and release

- Browser-mode contract tests:
- End-to-end accessibility and platform tests:
- Visual states and snapshots:
- Bundle impact:
- Documentation examples:
- Changeset level and migration notes:
