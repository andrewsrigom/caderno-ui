# Caderno UI

Simple, intuitive UI components inspired by handwritten notes and pen on white paper. Works in HTML, React, Astro, Vue, Svelte, and whatever comes next.

[![CI](https://github.com/andrewsrigom/caderno-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewsrigom/caderno-ui/actions/workflows/ci.yml)
[![Documentation](https://github.com/andrewsrigom/caderno-ui/actions/workflows/pages.yml/badge.svg)](https://andrewsrigom.github.io/caderno-ui/)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**[Read the documentation](https://andrewsrigom.github.io/caderno-ui/)** · Live examples, component APIs, theming, and framework integrations.

## Packages

| Package                | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `@caderno-ui/tokens`   | Theme tokens and standalone light/dark defaults     |
| `@caderno-ui/icons`    | Typed hand-drawn SVG path data                      |
| `@caderno-ui/elements` | `cad-*` custom elements implemented with Lit        |
| `@caderno-ui/motion`   | Accessible, opt-in GSAP choreography and presets    |
| `@caderno-ui/react`    | Typed React wrappers around the custom elements     |
| `@caderno-ui/astro`    | Astro facades with declarative, pre-upgrade content |

## Development

```bash
pnpm install
pnpm verify
pnpm dev
```

Node.js 20 or newer is required. Published packages are ESM-only.

See the [support policy](./docs/support.md) for the tested Node, browser,
React, Astro, TypeScript, and compatibility matrix.

## HTML usage

```html
<link rel="stylesheet" href="@caderno-ui/tokens/notebook.css" />

<cad-alert variant="warning" dismissible>
  <span slot="title">Review the contract</span>
  Complex values belong to properties; attributes remain serializable.
</cad-alert>

<script type="module">
  import '@caderno-ui/elements/alert'
</script>
```

Import individual element entry points in application code. The `@caderno-ui/elements` root entry point registers the lightweight core set. Charts stay behind `@caderno-ui/elements/chart`, so Rough.js is only loaded by applications that opt into data visualization.

Coordinated page motion follows the same boundary. Component feedback remains
CSS-driven, while applications opt into scoped GSAP presets from
`@caderno-ui/motion` and load ScrollTrigger only through
`@caderno-ui/motion/scroll`.

## Framework adapters

React consumes the same elements through typed wrappers:

```tsx
import { CadAlert } from '@caderno-ui/react/alert'

export function ReviewNotice() {
  return (
    <CadAlert
      dismissible
      heading="Review the contract"
      variant="warning"
      onDismiss={(event) => console.log(event.detail.variant)}
    >
      The contract and implementation have diverged.
    </CadAlert>
  )
}
```

Astro facades keep useful server-rendered content before the custom element upgrades:

```astro
---
import Alert from '@caderno-ui/astro/Alert.astro'
---

<Alert heading="Review the contract" variant="warning">
  <p>The contract and implementation have diverged.</p>
</Alert>
```

Vue, Svelte, and other frameworks can consume the `cad-*` custom elements directly. React has a dedicated wrapper because React's custom-event and property mapping benefits from an explicit adapter. A Vue wrapper should only be added if it provides real framework-specific value; it must not duplicate component logic.

## Themes and extension

Import `@caderno-ui/tokens/notebook.css` for a white background by default. Dark mode requires `data-theme="dark"` on `<html>`; system preferences do not change the theme. Override `--cad-*` CSS variables to customize colors, fonts, and spacing, or use the CSS parts listed in each component’s API.

Install versioned packages and compose your content through slots. Component behavior stays in the library.

## Releases

Changes to public packages require a Changeset. The release workflow creates a
version pull request and, after it is merged, publishes the exact tarballs that
passed package validation and npm's dry run. Publishing is restricted to GitHub
Actions with Trusted Publishing and provenance; maintainers can exercise the
same path without mutation through `pnpm release:dry-run`.

See [architecture](./docs/architecture.md), [architecture decisions](./docs/decisions/README.md), [tokens](./docs/tokens.md), [accessibility](./docs/accessibility.md), [release and recovery](./docs/release.md), [icon scaling](./docs/icons.md), and [migration](./docs/migration.md) for the SeniorPath rollout strategy.
