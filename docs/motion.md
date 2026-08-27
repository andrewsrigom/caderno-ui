# Motion

Component animations show state changes. Page animations are optional.
Content must remain readable before JavaScript runs and when motion is disabled.

## Packages

| Layer       | Owner                  | Examples                                       |
| ----------- | ---------------------- | ---------------------------------------------- |
| Feedback    | `@caderno-ui/elements` | press, hover, selection, disclosure, data draw |
| Settings    | `@caderno-ui/tokens`   | duration, easing, distance, stagger            |
| Sequences   | `@caderno-ui/motion`   | enter, exit, grouped reveal, scroll reveal     |
| Composition | consumer application   | targets, trigger points, page-level sequencing |

Use the shared tokens and presets for consistent timing across the application.

## Component motion

Stateful components move by default when the movement explains what changed:

- accordion content expands and collapses with height, opacity, and direction;
- chart marks draw with stagger when they enter the viewport or data changes;
- active tab panels animate when selection changes;
- modal and backdrop appear together;
- buttons, cards, tabs, tooltips, toasts, progress, and loading states provide
  local feedback appropriate to their interaction.

These behaviors use CSS or the Web Animations API and semantic motion tokens, so
`@caderno-ui/elements` remains free of GSAP. Accordion and chart expose
`animation="none"` for deliberately static instances. Charts also expose
`replay()` for an explicit user-requested replay. All automatic component motion
is removed when reduced motion is requested.

## Enter and exit animations

The motion package scopes selectors, tracks animation state, and restores inline
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
rotation, and scale overrides. Defaults match the shared motion tokens.

## Scroll animations

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
