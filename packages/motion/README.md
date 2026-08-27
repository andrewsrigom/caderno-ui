# `@caderno-ui/motion`

Optional animation presets for Caderno UI, with reduced-motion support.
This package uses GSAP; importing the base custom elements does not load it.

```bash
pnpm add @caderno-ui/motion
```

Use a scope for page or feature entrance and exit sequences:

```ts
import { createMotionScope } from '@caderno-ui/motion'

const section = document.querySelector('[data-study-section]')
const motion = createMotionScope(section ?? undefined)

motion.enter('[data-motion-item]', { stagger: 0.06 })

// Reverts inline animation state and cancels active animations.
motion.revert()
```

Scroll animations use a separate entry point:

```ts
import { createScrollReveal } from '@caderno-ui/motion/scroll'

const reveal = createScrollReveal('[data-motion-item]', {
  root: document.querySelector('main') ?? undefined,
  start: 'top 82%',
})

reveal.revert()
```

Both APIs honor `prefers-reduced-motion`. Keep meaningful content visible in the
unanimated document, call `revert()` when a page or feature unmounts, and use
`@caderno-ui/tokens` for CSS-driven component feedback.
