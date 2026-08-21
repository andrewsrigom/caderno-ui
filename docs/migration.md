# SeniorPath migration

## Current slice

The first migration proves the shared architecture with components that cover different contracts:

- `cad-alert`: slots, variants, dismiss action, and a composed event.
- `cad-bookmark`: pressed state, storage persistence, and a composed event.
- `cad-tabs` with `cad-tab`: declarative children, keyboard navigation, named tab panels, and no-JavaScript content.
- `cad-icon`: the shared renderer for the existing 40 SeniorPath doodles.

SeniorPath keeps its existing Astro component imports as compatibility facades. The facades now delegate to `@caderno-ui/astro`, so product pages can migrate incrementally without a broad call-site rewrite.

During local development SeniorPath links directly to the sibling workspace packages. After the first release, replace the `link:` dependencies with matching published semver versions.

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
