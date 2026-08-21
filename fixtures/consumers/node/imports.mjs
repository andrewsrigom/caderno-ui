const imports = [
  '@caderno-ui/elements',
  '@caderno-ui/elements/alert',
  '@caderno-ui/elements/bookmark',
  '@caderno-ui/elements/icon',
  '@caderno-ui/elements/tabs',
  '@caderno-ui/icons',
  '@caderno-ui/react',
  '@caderno-ui/react/alert',
  '@caderno-ui/react/bookmark',
  '@caderno-ui/react/icon',
  '@caderno-ui/react/tabs',
]

for (const specifier of imports) await import(specifier)
