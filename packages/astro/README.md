# `@caderno-ui/astro`

Astro components for Caderno UI. Slotted content renders on the server before the custom elements initialize.

In an existing Astro project:

```bash
pnpm add @caderno-ui/astro @caderno-ui/elements @caderno-ui/tokens @fontsource/caveat
```

```astro
---
import Alert from '@caderno-ui/astro/Alert.astro'
import List from '@caderno-ui/astro/List.astro'
import ListItem from '@caderno-ui/astro/ListItem.astro'
import '@fontsource/caveat/latin-500.css'
import '@fontsource/caveat/latin-700.css'
import '@caderno-ui/tokens/notebook.css'
import '@caderno-ui/elements/fallback.css'
---

<Alert heading="Unsaved changes" variant="warning">
  Save your notes before leaving this page.
</Alert>

<List label="Review">
  <ListItem>Read the review notes.</ListItem>
  <ListItem><a {...{ slot: 'action' }} href="/notes/">Open notes</a></ListItem>
</List>
```

Load styles and fonts once in your application layout. Import components by their individual exported paths. The package supports Astro
5, 6 and 7. Do not apply `client:*` hydration directives: each component registers
its own custom element. Native content in slots remains readable before upgrade.

Use the spread form above when a native child's `slot` must reach the custom
element instead of being consumed as an Astro slot. Complex properties (for
example chart data) are assigned in a browser script. Never duplicate the
component's styles in the consuming app.
