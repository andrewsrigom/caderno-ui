---
'@caderno-ui/elements': minor
'@caderno-ui/astro': minor
'@caderno-ui/react': minor
---

Preserve the default handwritten blue list, individual dashed borders, solid bullets, and circled numbers. Add `compact` to remove row frames and extra spacing without changing the markers. Native editorial lists keep their existing styles.

Add an `action` slot for a native anchor or button, including router links. The control owns the entire row and its behavior; the list keeps the border and decorative trailing arrow without nesting or proxying controls. Static items have no arrow. The native `href` shortcut remains available. Documentation and React Router integration tests cover static content, navigation, and asynchronous actions.
