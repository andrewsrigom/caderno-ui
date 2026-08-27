---
'@caderno-ui/astro': minor
'@caderno-ui/elements': minor
'@caderno-ui/react': minor
'@caderno-ui/tokens': minor
---

Add `cad-drawer` as a modal edge panel with four placements, three sizes, focus restoration, scroll locking, and typed lifecycle events across Elements, React, and Astro.

Add the standalone `cad-doodle-avatar`, composable `cad-list`, form-associated `cad-switch`, single-value or range `cad-slider`, and top-layer `cad-popover` components, expose them through the Elements, React, and Astro entrypoints, refine the notebook visual language across form controls, navigation, content, and data-display components, rework `cad-highlight` with native marker, underline, and double-stroke treatments in seven tones, redesign `cad-spinner` with semantic tones, four sizes, and seven indeterminate motion treatments, rebuild `cad-steps` around explicit progress states, circular markers, responsive orientations, and composable marker and status slots, simplify `cad-progress` around native horizontal progress with sizes and semantic tones, and remove the redundant `cad-paper` and `cad-tape` public components.

Add the composable `cad-footer` landmark and `cad-footer-group` mobile disclosure across Elements, React, and Astro, with named application regions, four visual variants, responsive navigation, and accessible keyboard behavior.

Add the responsive `cad-header` banner across Elements, React, and Astro, with product-owned composition slots, five visual variants, an optional notebook handle, container-aware compact navigation, and a typed menu-toggle event.

Complete the BIC-pen visual pass across radio, checklist, bookmark, tooltip, skeleton, chart, Kanban, sticker, avatar, icon, and the Astro table of contents. Make chart legends opt-in so Cartesian charts do not repeat every data label as a series, while donut examples can request the legend explicitly.

Rework the component documentation around a primary live example followed by compact, faithful galleries for meaningful variants and persistent states. The rendered examples and their copyable source now cover chart types, feedback tones, loading treatments, layouts, placements, compositions, and responsive surfaces without multiplying decorative color combinations.

Make cards flat by default, place the title inside a ruled header, and add a `plain` variant that keeps header and footer dividers without an outer border. The folded treatment is now opt-in across Elements and Astro, and the no-JavaScript fallback follows the same section layout.

Use the public components in the documentation shell, homepage cards/actions, API tables, and code disclosures. Add opt-in CodeBlock copying with accessible success/failure feedback and a typed `cad-code-copy` event, body typography and code-formatted table columns, and native-HTML navigation styles. Forward current-link semantics and repair named slots and boolean serialization in the Astro adapters. Omit absent header/footer regions and keep modal keyboard focus inside slotted content. Test the production documentation on an isolated origin.

Make the shared token theme white by default. Dark mode now requires an explicit `data-theme="dark"` selection. Documentation no longer follows the operating system's dark preference automatically. Simplify the documentation copy around handwritten notes, practical usage, and concise component descriptions.

Use a continuous light-blue header band with blue text in tables, without per-column borders or underlines. Apply the same header treatment to native prose tables and remove repeated component names from API table captions. Make the table scroll container keyboard-focusable with the shared focus outline.

Use neutral surfaces for inactive tabs and blue with contrasting text for the selected tab. Remove decorative tab colors from examples, deprecate the ignored tab `tone` setting without breaking existing consumers, and keep keyboard focus visible inside the tab strip.

Add an opt-in `@caderno-ui/elements/scrollbar.css` stylesheet for shared native page and component scrollbars, with theme-aware blue ink, square thumbs where supported, and platform controls in forced-color and touch modes.

Refine badges as compact, non-interactive status annotations: replace the button-like frame with a decorative ink marker and a subtle highlight. Keep existing tones, customization tokens, and start slots; use an open marker without the highlight for the outline variant. Match the no-JavaScript fallback and add faithful examples in context.
