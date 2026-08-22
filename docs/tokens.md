# Token contract

Caderno UI ships one public token entry point: `@caderno-ui/tokens/notebook.css`.
It loads primitives first and semantic defaults second. Consumers should normally
override semantic tokens; primitives exist to keep the system internally
consistent and are not theme roles by themselves.

## Taxonomy

| Layer     | Pattern                                                                                | Purpose                                             |
| --------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Primitive | `--cad-color-*`, `--cad-space-*`, `--cad-radius-*`, `--cad-duration-*`, `--cad-ease-*` | Raw scales and palette values                       |
| Semantic  | `--cad-bg`, `--cad-ink`, `--cad-surface-raised`, `--cad-post-it-*-bg`                  | Theme roles consumed by components and applications |
| Component | `--cad-alert-bg`, `--cad-tabs-panel-bg`                                                | Optional, documented overrides for one component    |
| Private   | `--_*` inside a shadow root                                                            | Implementation detail; never a consumer contract    |

New public variables use the `--cad-` prefix. Semantic colors are named by
purpose, while palette families publish background and foreground together.
Avoid consuming a raw `--cad-color-*` value from a component: doing so bypasses
the light/dark mapping.

Use `--cad-surface-raised` for cards and paper placed above the page, and
`--cad-surface-sunken` for tracks or inset regions. These roles keep elevation
meaning stable even when their concrete colors change between themes.

## Contrast-safe pairs

The following pairs are checked in both themes at a minimum contrast ratio of
4.5:1:

- `--cad-ink` on `--cad-bg`
- `--cad-link` and `--cad-focus-ring` on `--cad-bg`
- every matching `--cad-post-it-*-ink` on `--cad-post-it-*-bg`
- `--cad-sticker-violet-ink` on `--cad-sticker-violet-bg`

Treat each pair as indivisible when overriding a palette. A custom background
without its corresponding foreground is not assumed to remain accessible.

## Automated audit

Run `pnpm tokens:check`. The check scans package and application sources,
validates that every used token exists or is an explicitly documented component
override, detects dependency cycles, verifies complete dark and light semantic
maps, and evaluates the promised contrast pairs. Its detailed diagnostic report
is generated under the ignored `.artifacts` directory.
