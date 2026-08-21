# `@caderno-ui/elements`

Framework-agnostic `cad-*` custom elements implemented with Lit.

```bash
pnpm add @caderno-ui/elements @caderno-ui/icons
```

```ts
import '@caderno-ui/elements/alert'
```

```html
<cad-alert variant="warning">
  <span slot="title">Review needed</span>
  The implementation and contract have diverged.
</cad-alert>
```

Import individual entry points (`alert`, `bookmark`, `icon`, or `tabs`) to register only the elements you use. Import `@caderno-ui/elements/fallback.css` for useful pre-upgrade and no-JavaScript styles. The package is ESM-only.

The package ships a [Custom Elements Manifest](./custom-elements.json) with attributes, events, CSS parts, and CSS custom properties.
