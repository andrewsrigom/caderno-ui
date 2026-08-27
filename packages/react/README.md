# `@caderno-ui/react`

React components with typed properties, events, and refs for Caderno UI.

In an existing React project:

```bash
pnpm add @caderno-ui/react @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat
```

Load styles and fonts once in your application entry file or layout:

```ts
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
```

```tsx
import { CadAlert } from '@caderno-ui/react/alert'

export function Notice() {
  return (
    <CadAlert variant="warning">
      Save your notes before leaving this page.
    </CadAlert>
  )
}
```

Import by component to load only the adapters and elements you use.
The root `@caderno-ui/react` export registers the core set. Charts require a
separate `@caderno-ui/react/chart` import.

The wrappers map DOM properties and typed custom events through `@lit/react`; component behavior and styles remain in `@caderno-ui/elements`. The package is ESM-only and supports React 18 and 19.

## Forms and composition

Use `onInput` for text editing and `onChange` for native commitment (text blur,
checkbox toggle, slider commit). Unlike React's native text `onChange`, these
are DOM events, not synthetic per-keystroke events. Read the typed
`event.currentTarget.value` or `.checked` synchronously.

```tsx
import { useState } from 'react'
import { CadInput } from '@caderno-ui/react/input'

export function NoteTitle() {
  const [title, setTitle] = useState('')
  return (
    <CadInput
      label="Title"
      name="title"
      value={title}
      onInput={(event) => setTitle(event.currentTarget.value)}
    />
  )
}
```

Reset controlled state in the form's `onReset` handler. `ref` receives the
custom element: use its public `focus()`, `checkValidity()` or `reportValidity()`.
The control participates in native `FormData` through its `name`.

Provide a real anchor, router link or button in `CadListItem`'s `action` slot.
Your router or event handler controls navigation. Don't nest links.

## Server rendering

Component subpaths preserve `use client`, including in the distributed ESM.
Next.js Server Components can compose these client boundaries. Event callbacks
and non-serializable values belong in a Client Component.

This is **not Lit shadow-root SSR**: slotted HTML renders on the server, while
internal controls and behavior initialize in the browser. Use native headings,
links and paragraphs in slots for useful initial content. Do not mask hydration
problems with `ssr: false` or `suppressHydrationWarning`.

The [integration guide](https://andrewsrigom.github.io/caderno-ui/integrations/react/)
includes working examples and the Next.js notes app.
