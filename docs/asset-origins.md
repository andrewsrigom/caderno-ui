# Asset origins

Caderno UI does not bundle third-party fonts, icon files, photographs, or
illustration packs in its published packages.

| Asset                         | Origin                                             | Distribution                                          |
| ----------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| `packages/icons/src/index.ts` | Original path data maintained as Caderno UI source | Published under the repository MIT license            |
| `apps/docs/public/og.png`     | Project artwork maintained in this repository      | Documentation-only; covered by the repository license |
| Playwright visual snapshots   | Generated from Caderno UI's own laboratory page    | Test-only; not included in npm packages               |

The font stacks in the token package only name system or user-installed fonts;
no font binaries are redistributed. A future external asset must record its
source URL, author, license, modification status, and shipped package here
before it can be merged.
