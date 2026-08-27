# `@caderno-ui/elements`

Framework-agnostic `cad-*` custom elements implemented with Lit.

In an existing project with a build tool such as Vite:

```bash
pnpm add @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat
```

```ts
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
import '@caderno-ui/elements/alert'
```

```html
<cad-alert variant="warning">
  <span slot="title">Unsaved changes</span>
  Save your notes before leaving this page.
</cad-alert>
```

Import individual entry points (`alert`, `bookmark`, `icon`, or `tabs`) to register only the elements you use. Load styles and fonts once at the application root. The fallback stylesheet keeps content readable before JavaScript initializes. The package is ESM-only.

Import `@caderno-ui/elements/scrollbar.css` after the theme for matching native page and component scrollbars. Customize `--cad-scrollbar-thumb`, `--cad-scrollbar-thumb-hover`, `--cad-scrollbar-track`, and `--cad-scrollbar-size` (10px). Touch and forced-color modes keep platform controls; Firefox keeps its native thin shape.

The package ships a [Custom Elements Manifest](./custom-elements.json) with attributes, events, CSS parts, and CSS custom properties.

## Text and article content

Import `@caderno-ui/elements/typography.css` after the theme. Apply `cad-type-display`, `cad-type-heading`, `cad-type-title`, `cad-type-label`, `cad-type-body`, `cad-type-meta`, or `cad-type-code` to native HTML. Import `@caderno-ui/elements/prose.css` and wrap article content in `.cad-prose` for headings, paragraphs, lists, links, and tables.

Code blocks can read a native `<pre><code>` child. The source stays readable without JavaScript; after registration the component adds syntax colors and copies the same source. Use the `code` property when setting code dynamically.
