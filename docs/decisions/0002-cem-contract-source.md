# ADR 0002: source and CEM own the machine-readable contract

**Status:** accepted

## Decision

TypeScript source, Lit property declarations and public JSDoc are the authored
contract. The Custom Elements Manifest generated from them is the canonical
machine-readable representation for documentation, validation and tooling.

API tables and framework metadata must derive from this contract. Narrative
guidance and examples remain authored documentation.

## Consequences

- generated files are committed only when consumers need them;
- CI rejects drift between implementation, CEM, exports and generated docs;
- private members must not become public documentation by accident.
