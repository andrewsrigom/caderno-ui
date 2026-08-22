# Caderno UI

Caderno UI is a notebook-inspired, framework-agnostic interface system. Its canonical components are standards-based custom elements implemented with Lit. Framework packages only adapt those elements to each ecosystem.

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

<Alert title="Review the contract" variant="warning">
  <p>The contract and implementation have diverged.</p>
</Alert>
```

Vue, Svelte, and other frameworks can consume the `cad-*` custom elements directly. React has a dedicated wrapper because React's custom-event and property mapping benefits from an explicit adapter. A Vue wrapper should only be added if it provides real framework-specific value; it must not duplicate component logic.

## Themes and extension

Import `@caderno-ui/tokens/notebook.css` for the defaults, set `data-theme="light"` on the document root for light mode, or override the `--cad-*` variables from your application. Components expose CSS parts for targeted visual customization while keeping their behavior canonical.

This follows the useful part of the shadcn model—clear, composable primitives and ownership-friendly styling—without copying component implementations into every application. Consumers install versioned packages and extend them through tokens, slots, events, and CSS parts.

## Releases

Changes to public packages require a Changeset. The release workflow creates a
version pull request and, after it is merged, publishes the exact tarballs that
passed package validation and npm's dry run. Publishing is restricted to GitHub
Actions with Trusted Publishing and provenance; maintainers can exercise the
same path without mutation through `pnpm release:dry-run`.

See [architecture](./docs/architecture.md), [architecture decisions](./docs/decisions/README.md), [tokens](./docs/tokens.md), [accessibility](./docs/accessibility.md), [release and recovery](./docs/release.md), [icon scaling](./docs/icons.md), and [migration](./docs/migration.md) for the SeniorPath rollout strategy.
