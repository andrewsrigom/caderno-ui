const imports = [
  '@caderno-ui/elements',
  '@caderno-ui/elements/alert',
  '@caderno-ui/elements/badge',
  '@caderno-ui/elements/bookmark',
  '@caderno-ui/elements/chart',
  '@caderno-ui/elements/drawer',
  '@caderno-ui/elements/footer',
  '@caderno-ui/elements/header',
  '@caderno-ui/elements/icon',
  '@caderno-ui/elements/note',
  '@caderno-ui/elements/popover',
  '@caderno-ui/elements/progress',
  '@caderno-ui/elements/slider',
  '@caderno-ui/elements/switch',
  '@caderno-ui/elements/tabs',
  '@caderno-ui/icons',
  '@caderno-ui/motion',
  '@caderno-ui/motion/scroll',
  '@caderno-ui/react',
  '@caderno-ui/react/alert',
  '@caderno-ui/react/badge',
  '@caderno-ui/react/bookmark',
  '@caderno-ui/react/chart',
  '@caderno-ui/react/drawer',
  '@caderno-ui/react/footer',
  '@caderno-ui/react/header',
  '@caderno-ui/react/icon',
  '@caderno-ui/react/note',
  '@caderno-ui/react/popover',
  '@caderno-ui/react/progress',
  '@caderno-ui/react/slider',
  '@caderno-ui/react/switch',
  '@caderno-ui/react/tabs',
]

for (const specifier of imports) await import(specifier)

// CSS entry points must resolve in the published package without registering JS.
for (const specifier of [
  '@caderno-ui/elements/fallback.css',
  '@caderno-ui/elements/navigation.css',
  '@caderno-ui/elements/prose.css',
  '@caderno-ui/elements/scrollbar.css',
]) {
  import.meta.resolve(specifier)
}
