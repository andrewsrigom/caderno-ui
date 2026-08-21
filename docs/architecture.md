# Architecture

## One implementation, small adapters

`@caderno-ui/elements` is the canonical runtime. Lit provides rendering and reactive properties, while the browser-native custom-element contract makes every component consumable from HTML, Astro, React, Vue, Svelte, or another framework.

Framework adapters must stay thin:

- `@caderno-ui/react` maps properties and typed custom events with `@lit/react`.
- `@caderno-ui/astro` provides declarative facades and useful pre-upgrade markup.
- A future Vue package should map properties and events only; it should not copy rendering or styles.

## Package boundaries

| Package      | Owns                                                | Does not own               |
| ------------ | --------------------------------------------------- | -------------------------- |
| `tokens`     | Standalone `--cad-*` theme defaults                 | Component rendering        |
| `icons`      | Typed doodle data and names                         | Framework components       |
| `elements`   | Semantics, keyboard behavior, state, events, styles | Application business rules |
| `react`      | React event/property ergonomics                     | Component behavior         |
| `astro`      | Astro props and progressive markup                  | Component behavior         |
| `laboratory` | Development examples and contract inspection        | Published API              |

## Public contract

- Tags use the short `cad-` prefix.
- Serializable primitives are attributes; richer values are properties.
- Content composition uses slots.
- State changes emit typed DOM events that bubble and cross shadow boundaries.
- Visual customization uses `--cad-*` properties and documented CSS parts.
- Individual entry points register only the elements a consumer imports.
- Meaningful content remains readable before upgrade and without JavaScript.

## Extensibility

Caderno UI is a versioned component library first. A shadcn-style registry can be added later for recipes that are intentionally application-owned, such as a composed editor, article shell, or study dashboard. Canonical primitives should remain packaged so fixes to accessibility and behavior reach every consumer through normal dependency updates.
