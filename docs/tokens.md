# Token contract

Caderno UI ships one public token entry point: `@caderno-ui/tokens/notebook.css`.
It loads primitives first and semantic defaults second. Consumers should normally
override semantic tokens; primitives exist to keep the system internally
consistent and are not theme roles by themselves.

The default theme is light, with a white background. Set `data-theme="dark"`
on `<html>` to choose dark mode. Remove the attribute or set it to `light` to
return to white. System preferences do not change the theme.

## Taxonomy

| Layer     | Pattern                                                                                | Purpose                                             |
| --------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Primitive | `--cad-color-*`, `--cad-space-*`, `--cad-radius-*`, `--cad-duration-*`, `--cad-ease-*` | Raw scales, timing, and palette values              |
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

## Motion roles

Semantic motion tokens keep CSS feedback and page choreography on the same
rhythm. Component styles consume these roles directly; `@caderno-ui/motion`
publishes matching JavaScript defaults for coordinated sequences.

| Token                            | Default   | Role                               |
| -------------------------------- | --------- | ---------------------------------- |
| `--cad-motion-duration-feedback` | `140ms`   | direct press, hover, and selection |
| `--cad-motion-duration-enter`    | `420ms`   | content settling into the page     |
| `--cad-motion-duration-exit`     | `220ms`   | content leaving the page           |
| `--cad-motion-ease-feedback`     | spring    | tactile component response         |
| `--cad-motion-ease-enter`        | out       | decelerating arrival               |
| `--cad-motion-ease-exit`         | in        | accelerating departure             |
| `--cad-motion-distance-sm`       | `0.35rem` | compact state change               |
| `--cad-motion-distance-md`       | `0.85rem` | page or group entrance             |
| `--cad-motion-stagger`           | `60ms`    | delay between related items        |

Theme scopes may override these roles, but decorative movement must still be
disabled when `prefers-reduced-motion: reduce` matches.

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
