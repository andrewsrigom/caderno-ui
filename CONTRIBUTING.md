# Contributing

English is the working language for issues, pull requests, and documentation.
Bug reproductions, examples, tests, and accessibility reports are all useful
contributions; not every contribution needs to change component code.

## Choose a task

- Look for [good first issues](https://github.com/andrewsrigom/caderno-ui/labels/good%20first%20issue) for small, defined tasks, or [help wanted](https://github.com/andrewsrigom/caderno-ui/labels/help%20wanted) for other accepted work.
- Comment before starting a substantial change so contributors do not duplicate work. Small typo fixes can go straight to a pull request.
- Use the [issue forms](https://github.com/andrewsrigom/caderno-ui/issues/new/choose) for bugs, feature proposals, and documentation or examples. An open proposal is not an implementation commitment; agree on scope before adding a component or changing an API.
- Keep reproductions self-contained. Contributing must not require access to a consuming application, private repository, or real user data.
- Report security vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).

## Local development

Install Node.js 22.12 or newer (22/24 are tested), clone your fork, and run
these commands from the repository root. Corepack uses the pnpm version pinned
in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm build:packages
pnpm docs:dev --host 127.0.0.1 --port 5180
```

Open `http://127.0.0.1:5180/` for the documentation. Use a free port if 5180 is
already in use. After editing a package, rerun `pnpm build:packages` so the
preview picks up the new build.

### Find the source

| Area                                | Location                              |
| ----------------------------------- | ------------------------------------- |
| Component behavior and styles       | `packages/elements/src/`              |
| Component browser tests             | `packages/elements/test/`             |
| Theme tokens and icons              | `packages/tokens/`, `packages/icons/` |
| React and Astro adapters            | `packages/react/`, `packages/astro/`  |
| Documentation and examples          | `apps/docs/src/`, `apps/notes/`       |
| Installed-package integration tests | `fixtures/`, `tests/frameworks/`      |

### Check a focused change

For example, run the note component's browser tests while working on it:

```sh
pnpm --filter @caderno-ui/elements exec vitest run test/note.test.ts
```

For documentation changes:

```sh
pnpm docs:check
pnpm test:docs
```

Before opening a pull request, run `pnpm verify` for package or cross-cutting
changes and report the commands and results. For documentation-only changes,
run `pnpm format:check` and the documentation checks above. CI runs the full
set of checks on pull requests.

Browser tests use fresh contexts and reserved ports: 5187 for documentation,
5198 for component scenarios, and 5192–5194 for framework consumers. Keep your
interactive preview on another port. Use a disposable clone for full
verification if another project relies on this checkout's local build or
`.artifacts/packs`; packaging checks replace those generated files.

Keep component behavior in `@caderno-ui/elements`. Framework packages should adapt the public custom-element contract without duplicating styles or behavior.

Component CSS follows [`docs/css-conventions.md`](./docs/css-conventions.md),
and token additions must satisfy [`docs/tokens.md`](./docs/tokens.md) plus
`pnpm tokens:check`.

## Adding a component

Start with an accepted feature proposal. Keep the existing handwritten visual
direction, public tokens, and composition rules.

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

See the [support policy](./docs/support.md) for tested versions. Before submitting a component, complete the definition of done and run `pnpm verify`.

## Accessibility reports

Follow the [manual checklist](./docs/accessibility.md). Record the component,
package version, browser, operating system, assistive technology, steps, and
observed behavior. A report of a failure is useful evidence. Do not mark a
combination as verified if it was not tested or if problems remain unexplained.

## Opening a pull request

Link the issue, keep the change focused, and include the checks you ran.
For visible changes, include the relevant before/after screenshots. Do not
update visual baselines without reviewing the difference. Note checks you
could not run; do not check them off as passed.

## Changesets and public API

Run `pnpm changeset` whenever a pull request changes published source,
package metadata, tokens, the Custom Elements Manifest, or another file shipped
in a package. Tests, internal tooling, and documentation-only changes do not
need a Changeset when they leave published artifacts untouched.

The six public packages remain in a fixed version group while the library is
below 1.0. Choose the release level according to the compatibility policy in
`docs/support.md`. TypeScript API changes must also update the committed
reports with `pnpm api:report`.

Dependency updates must pass `pnpm security:check`. If an install script or
license expression is genuinely required, review it and update the matching
policy file in `config/` in the same change. Record any new visual asset in
[`docs/asset-origins.md`](./docs/asset-origins.md).

## Documentation

- Explain what the component does and how to use it. Avoid slogans and repeated introductions.
- Use concrete examples, such as notes, forms, and reading lists. Keep implementation tasks out of example copy.
- Update the rendered example and its code sample together.
- Check version claims and quotation sources. Label fictional quotations as examples; retain asset credits and licenses.
