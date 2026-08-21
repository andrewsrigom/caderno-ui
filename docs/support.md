# Support policy

## Runtime and tooling

Caderno UI publishes ESM-only packages. Node.js is used for installation,
build tooling and server rendering; the custom elements themselves execute in
the browser.

| Surface    | Supported range                                              | CI requirement                                   |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------ |
| Node.js    | 20 and newer                                                 | oldest supported LTS and current project version |
| React      | 18 and 19                                                    | oldest and newest declared peer                  |
| Astro      | 5, 6 and 7                                                   | oldest and newest declared peer                  |
| TypeScript | declarations compatible with Bundler and NodeNext resolution | packed-package checks                            |

The project may raise a minimum in a minor release while it remains below
`1.0`, but the change must have a Changeset and release-note callout.

## Browsers

Caderno UI supports evergreen browsers represented by the current Playwright
Chromium, Firefox and WebKit engines used in CI. Public features should be
Baseline Widely Available at the time they are introduced. A newer platform
feature requires either progressive enhancement or a documented support
decision.

The browser suite covers:

- Chromium, Firefox and WebKit end-to-end behavior;
- keyboard and focus behavior in a real browser;
- current light and dark themes;
- meaningful content before upgrade and without JavaScript;
- RTL, forced-colors and reduced-motion behavior where applicable.

## Public compatibility

- Package exports, custom-element names, attributes, properties, events,
  slots, CSS Parts and public custom properties are versioned contracts.
- State-change events bubble and cross Shadow DOM boundaries.
- Individual entrypoints must not register unrelated elements.
- Framework packages adapt the canonical custom elements and do not own
  behavior or styling.
- Deprecations must be documented before removal unless a security issue makes
  an immediate change necessary.

Only the latest published minor release receives security fixes while the
project is below `1.0`.
