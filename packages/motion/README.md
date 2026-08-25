# `@caderno-ui/motion`

Accessible, notebook-native motion presets for Caderno UI. The package keeps
GSAP behind an explicit dependency boundary so applications can opt into richer
choreography without adding it to the base custom-element bundle.

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

Scroll-triggered choreography is isolated in its own entry point:

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
