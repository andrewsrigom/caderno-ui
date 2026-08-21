# `@caderno-ui/react`

Typed React wrappers for the canonical Caderno UI custom elements.

```bash
pnpm add @caderno-ui/react react
```

```tsx
import { CadAlert } from '@caderno-ui/react'

export function Notice() {
  return <CadAlert variant="warning">Review needed</CadAlert>
}
```

The wrappers map DOM properties and typed custom events through `@lit/react`; component behavior and styles remain in `@caderno-ui/elements`. The package is ESM-only and supports React 18 and 19.
