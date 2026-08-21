# Component definition of done

A public component is ready only when every applicable item below is complete.

## Contract

- The proposal defines the problem, non-goals, public API, states, and failure
  behavior.
- The element has an individual entry point and guarded registration.
- Attributes, properties, slots, events, CSS properties, and parts are described
  in source JSDoc and represented in the generated manifest.
- Custom events are typed and intentionally specify bubbling and composition.
- Dynamic content, disconnection, duplicate/invalid input, and platform failure
  paths are covered where applicable.

## Accessibility and CSS

- Native semantics are preferred; accessible names and state relationships are
  verified.
- Keyboard-only operation, focus visibility, 200% reflow, RTL, reduced motion,
  forced colors, and a minimum 44px target are evaluated where applicable.
- Styles follow the CSS conventions and use semantic tokens with portable
  fallbacks.
- Color overrides are published as checked foreground/background pairs.
- Manual assistive-technology checks are recorded when automation cannot cover
  the behavior.

## Ecosystem and delivery

- Browser tests cover registration, defaults, reflection, slots, events, and
  interaction.
- React and Astro adapters remain thin and the adapter inventory is current.
- Consumer fixtures, SSR imports, package tarballs, type resolution, and bundle
  isolation remain green.
- Documentation contains a working example, generated API reference, usage
  guidance, and accessibility notes.
- API reports, baselines, and a Changeset are updated when the public artifact
  changes.
- `pnpm verify` passes from a clean checkout.
