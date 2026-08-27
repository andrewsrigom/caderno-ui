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

## Forms and composition

Use `onInput` for text editing and `onChange` for native commitment (text blur,
checkbox toggle, slider commit). Unlike React's native text `onChange`, these
are DOM events, not synthetic per-keystroke events. Read the typed
`event.currentTarget.value` or `.checked` synchronously.

```tsx
const [title, setTitle] = useState('')
<CadInput value={title} onInput={(event) => setTitle(event.currentTarget.value)} />
```

Reset controlled state in the form's `onReset` handler. `ref` receives the
custom element: use its public `focus()`, `checkValidity()` or `reportValidity()`.
The control participates in native `FormData` through its `name`.

Provide a real anchor, router link or button in `CadListItem`'s `action` slot.
The consumer owns navigation; don't nest a link inside another link.

## Server rendering

Component subpaths preserve `use client`, including in the distributed ESM.
Next.js Server Components can compose these client boundaries. Event callbacks
and non-serializable values belong in a Client Component.

This is **not Lit shadow-root SSR**: slotted HTML renders on the server, while
internal controls and behavior initialize in the browser. Use native headings,
links and paragraphs in slots for useful initial content. Do not mask hydration
problems with `ssr: false` or `suppressHydrationWarning`.

The [integration guide](https://andrewsrigom.github.io/caderno-ui/integrations/react/)
includes executable consumers and the Next.js notes example.
