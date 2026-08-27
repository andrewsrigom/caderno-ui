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

## Documentation as a consumer

- Build the documentation shell and reusable UI with published Caderno UI components or public CSS patterns. Keep page content, layout, and demo scenarios local.
- Fix missing behavior in the canonical element and its adapters, not with documentation-only component overrides.
- Use selective runtime imports. A type-only import does not register an element.
- Run `pnpm docs:check` and `pnpm test:docs` after shared documentation changes. The latter uses an isolated production preview on port 5187 and fresh browser contexts; never seed, clear, or reuse the developer's SeniorPath or demo storage.

## Documentation writing

- Explain Caderno UI as simple, intuitive interfaces inspired by pen on white paper. Keep framework support explicit: HTML, React, Astro, Vue, and Svelte.
- Write in plain English. Use the page or component name as the heading and a short purpose statement before examples.
- Keep meaningful variations, copyable examples, API details, accessibility requirements, and limitations. Remove repeated labels, slogans, and implementation details that do not help usage.
- Check defaults and examples against the source. Show code must match the rendered example.
- White is the default theme, regardless of system preferences. Dark mode requires an explicit user or application choice.

## Git branches

- Never create, rename, switch to, commit on, or push a branch whose name starts with `codex/`.
