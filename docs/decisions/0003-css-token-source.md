# ADR 0003: CSS is the token source of truth for 0.2

**Status:** accepted

## Decision

CSS custom properties remain the token source of truth. Tokens are separated
into primitive, semantic, component and theme layers, with compatibility
entrypoints composing those layers.

No JSON token format or external token compiler is introduced until another
platform or design tool needs generated output.

## Consequences

- consumers can inspect and override the published contract directly;
- a small repository-owned audit validates names, references and theme
  completeness;
- adding multiplatform generation later requires a new ADR.
