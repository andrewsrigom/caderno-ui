# Asset origins

Caderno UI does not bundle third-party fonts, icon files, photographs, or
illustration packs in its published packages.

| Asset                         | Origin                                                                                                       | Distribution                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `packages/icons/src/index.ts` | Original path data maintained as Caderno UI source                                                           | Published under the repository MIT license            |
| `apps/docs/public/og.png`     | Project artwork maintained in this repository                                                                | Documentation-only; covered by the repository license |
| `docs/assets/components.png`  | Unedited browser capture of `apps/docs/src/pages/examples/preview.astro`, using public Caderno UI components | README-only; covered by the repository license        |
| Playwright visual snapshots   | Generated from Caderno UI's own laboratory page                                                              | Test-only; not included in npm packages               |

The font stacks in the token package only name system or user-installed fonts;
no font binaries are redistributed in npm library packages. A future external asset must record its
source URL, author, license, modification status, and shipped package here
before it can be merged.

## Documentation and example assets

The documentation, laboratory and private Next.js example self-host unmodified Caveat Latin 500/700 from
`@fontsource/caveat@5.3.0`. Copyright: The Caveat Project Authors (2014).
Source: https://github.com/googlefonts/caveat, distributed through
https://fontsource.org/fonts/caveat under SIL OFL 1.1. Its copyright and full
license ship as `public/Caveat-OFL.txt` in each application's static output.
Documentation preloads the fonts so the chosen handwriting does not depend on
fonts installed on the reader's computer. The published library still only
defines the public font stacks; applications choose how to load their fonts.
This does not change the MIT license of Caderno UI's original source.

Reviewed example/tool dependencies: `tslib` uses 0BSD and `caniuse-lite`
uses CC-BY-4.0. Their distributed copyright/license notices are retained.
The license checker permits these expressions only for those named packages.
The Next.js app also brings the Sharp/libvips server-side optional image stack
(Apache-2.0 / LGPL-3.0-or-later). It is not bundled into the library tarballs or
used by the static notes UI. These native packages retain their own licenses;
their acceptance is package-specific, not a blanket LGPL allowance for the library.
