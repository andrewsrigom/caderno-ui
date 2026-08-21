# Contributing

Thank you for helping improve Caderno UI.

## Local development

1. Install Node.js 20 or newer and enable Corepack.
2. Run `pnpm install`.
3. Run `pnpm verify` before opening a pull request.
4. Add a Changeset with `pnpm changeset` for changes that affect a published package.

Keep component behavior in `@caderno-ui/elements`. Framework packages should adapt the public custom-element contract without duplicating styles or behavior.

Component CSS follows [`docs/css-conventions.md`](./docs/css-conventions.md),
and token additions must satisfy [`docs/tokens.md`](./docs/tokens.md) plus
`pnpm tokens:check`.

## Adding a component

1. Start from [`docs/component-spec-template.md`](./docs/component-spec-template.md).
2. Preview the scaffold with
   `pnpm create:component --name sticky-note --dry-run`.
3. Generate it without `--dry-run`, then fill in behavior, semantics, tests, and
   documentation.
4. Add event and type metadata to `config/components.json`, if needed, and run
   `pnpm adapters:generate`.
5. Complete [`docs/definition-of-done.md`](./docs/definition-of-done.md).

`pnpm adapters:check` prevents generated React wrappers, package subpaths,
Astro facades, and component documentation from drifting apart.

The tested runtime and peer versions are defined in the [support policy](./docs/support.md). A public component is complete only after its public contracts and `pnpm verify` are green.

## Changesets and public API

Run `pnpm changeset` whenever a pull request changes published source,
package metadata, tokens, the Custom Elements Manifest, or another file shipped
in a package. Tests, internal tooling, and documentation-only changes do not
need a Changeset when they leave published artifacts untouched.

The five public packages remain in a fixed version group while the library is
below 1.0. Choose the release level according to the compatibility policy in
`docs/support.md`. TypeScript API changes must also update the committed
reports with `pnpm api:report`.

Dependency updates must pass `pnpm security:check`. If an install script or
license expression is genuinely required, review it and update the matching
policy file in `config/` in the same change. Record any new visual asset in
[`docs/asset-origins.md`](./docs/asset-origins.md).
