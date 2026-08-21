# ADR 0001: auto-registering element entrypoints

**Status:** accepted

## Decision

`@caderno-ui/elements/<component>` exports the element class and registers its
`cad-*` tag as an import side effect. The root entrypoint registers the whole
catalog and is intended for laboratories or consumers that explicitly want
that behavior.

Every registration remains guarded by `customElements.get()` and by the
availability of the registry so that server imports are safe.

## Consequences

- application imports stay concise;
- subpath isolation and `sideEffects` metadata become tested contracts;
- advanced class-only or scoped-registry entrypoints may be added later, but
  are not part of the 0.2 contract.
