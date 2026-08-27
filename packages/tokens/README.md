# `@caderno-ui/tokens`

Shared colors, fonts, spacing, and motion values for Caderno UI.

```bash
pnpm add @caderno-ui/tokens
```

```ts
import '@caderno-ui/tokens/notebook.css'
```

The default theme is light, with a white background. System preferences do not
change it. Set `data-theme="dark"` on `<html>` to opt into dark mode. Remove the
attribute or set it to `light` to return to white.

Override `--cad-*` variables in your stylesheet. When changing colors, update
background and text pairs together and check their contrast.

Semantic motion roles are included for component feedback, content entrance and
exit, movement distance, and stagger. Use them for CSS transitions; coordinated
JavaScript choreography is available from `@caderno-ui/motion`.

The token taxonomy, checked color pairs, and extension rules are documented in
the repository's token contract.
