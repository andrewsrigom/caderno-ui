# `@caderno-ui/astro`

Astro facades for Caderno UI with useful server-rendered content before custom elements upgrade.

```bash
pnpm add @caderno-ui/astro astro
```

```astro
---
import Alert from '@caderno-ui/astro/Alert.astro'
import Tab from '@caderno-ui/astro/Tab.astro'
import Tabs from '@caderno-ui/astro/Tabs.astro'
---

<Alert heading="Review needed" variant="warning">
  The implementation and contract have diverged.
</Alert>

<Tabs defaultTab="contract" label="Component stages">
  <Tab label="Problem" name="problem" tone="coral">Define the need.</Tab>
  <Tab label="Contract" name="contract" tone="lemon">Define the API.</Tab>
</Tabs>
```

Available facades are `Alert.astro`, `Bookmark.astro`, `Icon.astro`, `Tab.astro`, and `Tabs.astro`. The package supports Astro 5, 6, and 7.
