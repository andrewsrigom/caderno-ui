# Accessibility policy and manual checks

Accessibility is part of each component's public behavior. Automated browser
tests cover semantics, accessible names, ARIA state and relationships, keyboard
operation, focus, light/dark contrast checks from axe, RTL, forced colors,
reduced motion, reflow, and target size.

Automation cannot establish the quality of a screen-reader experience. Before
a relevant release, manually verify the changed interaction using at least:

- NVDA with the current supported Firefox or Chrome on Windows;
- VoiceOver with the current supported Safari on macOS;
- keyboard-only navigation at 100% and 200% zoom;
- Windows High Contrast or an equivalent forced-colors configuration.

For each changed component, record the browser, assistive technology version,
operating system, scenario, announcement/focus result, and any accepted
limitation in the release pull request. Do not describe a combination as tested
unless that evidence exists.

The manual checklist is:

1. The control has an understandable name and role before interaction.
2. State changes are announced once and focus remains predictable.
3. Every action is possible without a pointer and there is no keyboard trap.
4. Reading and focus order follow the visual and logical order.
5. At 200% zoom, content reflows without hiding actions or meaning.
6. Forced colors preserve boundaries, focus indicators, and selected states.
7. Reduced motion removes decorative transitions without removing feedback.
