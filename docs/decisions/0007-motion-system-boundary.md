# ADR 0007: motion is an opt-in system capability

**Status:** accepted

## Context

Caderno UI components already provide isolated hover, focus, selection, and
loading transitions. Product pages also need coordinated entrances, staggered
content, and scroll choreography. Implementing those sequences independently in
SeniorPath would split the interaction language, while shipping GSAP from every
custom element would add an unnecessary dependency to the base bundle.

## Decision

Motion has three ownership layers:

1. `@caderno-ui/tokens` owns semantic durations, easing, distances, and stagger.
2. `@caderno-ui/elements` owns brief CSS or Web Animations feedback for
   self-contained component state changes, including animated disclosure and
   chart drawing.
3. `@caderno-ui/motion` owns accessible, reusable page choreography backed by
   GSAP.

The motion package is opt-in. Its root entry point provides scoped enter and
exit presets; ScrollTrigger remains isolated in `@caderno-ui/motion/scroll`.
Every preset honors `prefers-reduced-motion`, starts from meaningful visible
markup, and exposes explicit cleanup.

GSAP's [Standard “No Charge” License](https://gsap.com/community/standard-license/)
is approved for this package because Caderno UI provides code-driven interface
motion, not a visual no-code animation builder that competes with Webflow. The
license permits commercial websites, web applications, and digital interfaces.
If Caderno UI later adds visual animation-authoring capabilities, or adopts a
new GSAP release under revised terms, this approval must be reviewed again.

Consumer applications own the semantic decision of where a sequence runs and
which elements participate. They compose Caderno UI presets instead of importing
GSAP directly or defining a parallel animation vocabulary. Product-specific
names and business flows do not become design-system APIs.

## Consequences

- base custom-element and adapter bundles remain free of GSAP;
- component state changes remain dynamic without consumer setup, while semantic
  opt-outs and reduced-motion preferences keep motion controllable;
- SeniorPath can build richer pages while consuming one interaction system;
- scroll choreography is paid for only where its subpath is imported;
- route and component lifecycles must call `revert()` when their scope unmounts;
- repeated high-level page compositions may later justify a separate patterns
  package, but motion alone does not create that package boundary.
