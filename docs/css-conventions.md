# CSS conventions

These rules keep component styling portable across writing modes, themes,
platform preferences, and shadow boundaries.

## Layout and encapsulation

- Prefer logical properties such as `margin-inline`, `padding-block`, and
  `inset-inline-start` when direction can matter.
- Style internals through `:host`, slots, inherited custom properties, and
  documented `::part()` hooks. Do not depend on selectors that cross a shadow
  root.
- A public part is a compatibility commitment. Rename or remove one only under
  the compatibility policy.
- Keep stacking local. Components should create a local stacking context when
  needed and must not publish arbitrary global z-index scales. Elements that
  require the top layer should use the relevant platform primitive.

## Interaction and motion

- Keyboard focus uses `:focus-visible` and `--cad-focus-ring`.
- Interactive targets should be at least 44 by 44 CSS pixels unless the target
  is inline text or has equivalent spacing around it.
- Motion uses duration and easing tokens and must provide a
  `prefers-reduced-motion: reduce` path.
- Forced-colors mode must retain visible boundaries, selection, and focus.

## Values and fallbacks

Components consume semantic tokens, not raw palette primitives. A portable raw
fallback is allowed inside `var()` so elements remain usable when the token
stylesheet is absent. New component-specific variables must be documented in
the source JSDoc so they appear in the Custom Elements Manifest.

Use background/foreground token pairs together. The checked pairs and naming
rules are defined in [the token contract](./tokens.md).
