# Support policy

## Runtime and tooling

Caderno UI publishes ESM-only packages. Node.js is used for installation,
build tooling and server rendering; the custom elements themselves execute in
the browser.

| Surface    | Supported range                                              | CI requirement                              |
| ---------- | ------------------------------------------------------------ | ------------------------------------------- |
| Node.js    | 22.12 and newer                                              | Node 22 and 24 LTS                          |
| React      | 18 and 19                                                    | oldest and newest declared peer             |
| Astro      | 5, 6 and 7                                                   | oldest and newest declared peer             |
| Next.js    | 16 with React 19                                             | packed App Router SSR and static export     |
| Vue        | 3 with Vite                                                  | custom-element properties, events and slots |
| Svelte     | 5 with Vite                                                  | custom-element properties, events and slots |
| TypeScript | declarations compatible with Bundler and NodeNext resolution | packed-package checks                       |

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

## Limits

React component entrypoints are client boundaries, not a Lit SSR renderer.
Server output preserves slotted HTML; internal controls require browser upgrade.
The hosted notes example is a static export. A separate request-time Next.js
server fixture proves the SSR path. Nuxt, SvelteKit and additional adapters are
not included in this matrix.

Screen-reader combinations require recorded manual verification. Automated axe,
keyboard and platform tests do not establish NVDA, VoiceOver or JAWS support.
