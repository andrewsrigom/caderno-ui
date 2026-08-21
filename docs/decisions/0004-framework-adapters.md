# ADR 0004: framework adapters stay thin and justified

**Status:** accepted

## Decision

Framework packages map properties, events and server-friendly markup to the
canonical `cad-*` elements. They do not duplicate component behavior or
styles.

React receives generated typed wrappers because custom events and property
mapping benefit from them. Astro facades remain intentional and handwritten
when they provide meaningful server-rendered fallback. Vue, Svelte and other
framework wrappers are added only when they solve a demonstrated integration
problem.

## Consequences

- framework support does not multiply component implementations;
- React subpaths mirror element subpaths;
- not every element automatically needs an Astro facade.
