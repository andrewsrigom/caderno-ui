# ADR 0005: resilient light DOM before Lit hydration

**Status:** accepted

## Decision

Meaningful content remains available as light DOM before custom-element
upgrade and when JavaScript is disabled. Astro facades may improve that
fallback. The project does not adopt Lit SSR, Declarative Shadow DOM hydration
or a component hydration protocol without a concrete product requirement.

## Consequences

- SSR checks verify import safety and preservation of useful markup;
- hydration-specific infrastructure is outside the 0.2 foundation;
- a future hydration implementation must preserve the current no-JavaScript
  contract or introduce an explicit breaking change.
