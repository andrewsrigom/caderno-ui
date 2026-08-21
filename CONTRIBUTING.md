# Contributing

Thank you for helping improve Caderno UI.

## Local development

1. Install Node.js 20 or newer and enable Corepack.
2. Run `pnpm install`.
3. Run `pnpm verify` before opening a pull request.
4. Add a Changeset with `pnpm changeset` for changes that affect a published package.

Keep component behavior in `@caderno-ui/elements`. Framework packages should adapt the public custom-element contract without duplicating styles or behavior.
