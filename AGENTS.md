# Caderno UI

This repository is the canonical implementation and distribution workspace for Caderno UI.

## Public contracts

- Custom-element tags use the `cad-` prefix.
- Primitive values use attributes, complex values use properties, composition uses slots, and output uses DOM events.
- Public events must bubble and cross shadow boundaries.
- Theme customization uses `--cad-*` custom properties and documented CSS parts.
- Framework packages are adapters. They must not duplicate component behavior or styles.

## Compatibility

- Preserve semantic HTML and keyboard behavior.
- Components with meaningful content need an understandable pre-upgrade or no-JavaScript state.
- Add subpath entry points instead of requiring consumers to register the entire library.

## Git branches

- Never create, rename, switch to, commit on, or push a branch whose name starts with `codex/`.
