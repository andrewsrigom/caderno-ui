# `@caderno-ui/react`

Typed React wrappers for the canonical Caderno UI custom elements.

```bash
pnpm add @caderno-ui/react react
```

```tsx
import { CadAlert } from '@caderno-ui/react/alert'

export function Notice() {
  return <CadAlert variant="warning">Review needed</CadAlert>
}
```

Prefer component subpaths so an application only pays for the wrappers and
element registrations it uses. The root `@caderno-ui/react` export remains
available for convenience, but imports every current component.

The wrappers map DOM properties and typed custom events through `@lit/react`; component behavior and styles remain in `@caderno-ui/elements`. The package is ESM-only and supports React 18 and 19.
