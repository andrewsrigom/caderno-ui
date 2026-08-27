# `@caderno-ui/astro`

Astro facades for Caderno UI with useful server-rendered content before custom elements upgrade.

```bash
pnpm add @caderno-ui/astro astro
```

```astro
---
import Alert from '@caderno-ui/astro/Alert.astro'
import List from '@caderno-ui/astro/List.astro'
import ListItem from '@caderno-ui/astro/ListItem.astro'
import '@caderno-ui/tokens/notebook.css'
---

<Alert heading="Review needed" variant="warning">
  The implementation and contract have diverged.
</Alert>

<List label="Review">
  <ListItem>Read the contract.</ListItem>
  <ListItem><a {...{ slot: 'action' }} href="/notes/">Open notes</a></ListItem>
</List>
```

Import facades by their individual exported paths. The package supports Astro
5, 6 and 7. Do not apply `client:*` hydration directives: each facade registers
its own custom element. Native content in slots remains readable before upgrade.

Use the spread form above when a native child's `slot` must reach the custom
element instead of being consumed as an Astro slot. Complex properties (for
example chart data) are assigned in a browser script. Never duplicate the
component's styles in the consuming app.
