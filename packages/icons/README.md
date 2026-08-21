# `@caderno-ui/icons`

Typed, hand-drawn SVG path data used by Caderno UI.

```bash
pnpm add @caderno-ui/icons
```

```ts
import { cadIcons, type CadIconName } from '@caderno-ui/icons'

const icon: CadIconName = 'spark'
const paths = cadIcons[icon]
```

This data-only package is framework-independent and tree-shakeable. It is ESM-only.
