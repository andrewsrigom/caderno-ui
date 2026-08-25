# Motion contract

Caderno UI treats motion as interaction language, not decoration. Components
should feel like paper being lifted, placed, marked, or dismissed while keeping
content legible before JavaScript runs.

## Ownership

| Layer        | Owner                  | Examples                                       |
| ------------ | ---------------------- | ---------------------------------------------- |
| Feedback     | `@caderno-ui/elements` | press, hover, selection, disclosure, data draw |
| Vocabulary   | `@caderno-ui/tokens`   | duration, easing, distance, stagger            |
| Choreography | `@caderno-ui/motion`   | enter, exit, grouped reveal, scroll reveal     |
| Composition  | consumer application   | targets, trigger points, page-level sequencing |

Applications may choose where motion occurs, but should consume the Caderno UI
vocabulary instead of importing GSAP or inventing unrelated timings.

## Component motion

Stateful components move by default when the movement explains what changed:

- accordion content expands and collapses with height, opacity, and direction;
- chart marks draw with stagger when they enter the viewport or data changes;
- active tab panels settle into place when selection changes;
- modal paper and backdrop enter as one focused layer;
- buttons, cards, tabs, tooltips, toasts, progress, and loading states provide
  local feedback appropriate to their interaction.

These behaviors use CSS or the Web Animations API and semantic motion tokens, so
`@caderno-ui/elements` remains free of GSAP. Accordion and chart expose
`animation="none"` for deliberately static instances. Charts also expose
`replay()` for an explicit user-requested replay. All automatic component motion
is removed when reduced motion is requested.

## Core choreography

The core package scopes selectors, tracks animation state, and restores inline
styles during cleanup:

```ts
import { createMotionScope } from '@caderno-ui/motion'

const section = document.querySelector('[data-study-section]')
const motion = createMotionScope(section ?? undefined)

motion.enter('[data-motion-item]', {
  from: 'below',
  stagger: 0.06,
})

// Run this when the route or feature unmounts.
motion.revert()
```

`enter()` and `exit()` accept explicit duration, ease, distance, stagger,
rotation, and scale overrides. Defaults match the public token vocabulary and
provide a small paper-settling gesture rather than a generic large slide.

## Scroll choreography

ScrollTrigger has a separate entry point so it cannot leak into the core motion
or element bundles:

```ts
import { createScrollReveal } from '@caderno-ui/motion/scroll'

const reveal = createScrollReveal('[data-motion-item]', {
  root: document.querySelector('main') ?? undefined,
  start: 'top 82%',
  once: true,
})

reveal.revert()
```

Prefer one-time reveals. Avoid scroll hijacking, long pinned passages, and
animations that make reading progress depend on precise pointer or wheel input.

## Reduced motion and lifecycle

- meaningful content must be present and visible in the source document;
- reduced motion applies state changes immediately without spatial animation;
- motion must never be the only indication of focus, validation, selection, or
  completion;
- call `revert()` before replacing a route, dialog, or feature scope;
- use CSS or the Web Animations API for self-contained component state and the
  motion package for coordinated multi-element sequences.
