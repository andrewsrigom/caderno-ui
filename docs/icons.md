# Icon scaling policy

`cad-icon` accepts a dynamic `name`, so its default implementation uses the
complete local registry from `@caderno-ui/icons`. It never fetches remote SVGs
and remains deterministic offline and during SSR.

This convenience has an explicit ceiling:

- `config/bundle-budgets.json` caps the compressed icon entrypoint;
- the same file caps the number of names in the full registry;
- `pnpm bundle:check` fails when either ceiling is crossed;
- consumers that do not render `cad-icon` do not receive the registry through
  unrelated element or React subpaths.

Before the registry reaches its approved count or compressed-size ceiling, the
library must introduce generated per-icon subpaths or explicit icon-set
registration. Fetching icons remotely will not become the default behavior.
