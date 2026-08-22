# ADR 0006: optional dependency-heavy entrypoints

**Status:** accepted

## Context

The chart elements use Rough.js to generate their hand-drawn SVG marks. Exporting
charts from a package root would make applications download that dependency even
when they only use lightweight interface primitives.

## Decision

Package roots expose the lightweight core catalog. Features with a material
dependency cost use explicit, matching subpaths across the canonical elements
and framework adapters. Charts are available from
`@caderno-ui/elements/chart` and `@caderno-ui/react/chart`; Astro continues to
use component-specific facade exports.

Bundle validation must fail if a dependency-heavy feature leaks into a root
entrypoint. API reports, package checks, and consumer fixtures must exercise the
optional subpath independently.

## Consequences

- applications pay the Rough.js cost only when they import charts;
- the root entrypoint no longer promises to register the entire catalog;
- laboratories that demonstrate the whole catalog import optional features
  explicitly;
- each future dependency-heavy feature needs its own isolation, API, and
  consumer coverage.
