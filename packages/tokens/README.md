# `@caderno-ui/tokens`

Standalone design tokens and light/dark defaults for Caderno UI.

```bash
pnpm add @caderno-ui/tokens
```

```ts
import '@caderno-ui/tokens/notebook.css'
```

The default theme is dark. Set `data-theme="light"` on the document root for
the light theme, or override the documented `--cad-*` custom properties in your
own stylesheet. Override matching background/foreground pairs together so the
contrast guarantee remains intact.

The token taxonomy, checked color pairs, and extension rules are documented in
the repository's token contract.
