# Architecture

## One implementation, small adapters

`@caderno-ui/elements` implements the components with Lit. HTML, React, Astro,
Vue, and Svelte all use these same custom elements.

Framework adapters must stay thin:

- `@caderno-ui/react` maps properties and typed custom events with `@lit/react`.
- `@caderno-ui/astro` provides Astro components and server-rendered slotted content.
- Vue and Svelte use the custom elements directly.

## Package boundaries

| Package      | Owns                                                | Does not own                |
| ------------ | --------------------------------------------------- | --------------------------- |
| `tokens`     | Standalone `--cad-*` theme and motion defaults      | Component rendering         |
| `icons`      | Typed doodle data and names                         | Framework components        |
| `elements`   | Semantics, keyboard behavior, state, events, styles | Application business rules  |
| `motion`     | GSAP presets, reduced motion, and cleanup           | Product-specific page flows |
| `react`      | React properties, events, and refs                  | Component behavior          |
| `astro`      | Astro props and progressive markup                  | Component behavior          |
| `laboratory` | Development examples and contract inspection        | Published API               |

## Public contract

- Tags use the short `cad-` prefix.
- Serializable primitives are attributes; richer values are properties.
- Content composition uses slots.
- State changes emit typed DOM events that bubble and cross shadow boundaries.
- Visual customization uses `--cad-*` properties and documented CSS parts.
- Individual entry points register only the elements a consumer imports.
- Features with material dependency cost, such as charts, remain optional subpaths and are excluded from package root entry points.
- Page animations use `@caderno-ui/motion`; ScrollTrigger is loaded only by its `/scroll` subpath.
- Meaningful content remains readable before upgrade and without JavaScript.

## Extensibility

Applications compose components into editors, article layouts, and dashboards.
Shared styles and behavior stay in the packages, so applications receive fixes
through dependency updates. See the documentation recipes for composition examples.
