import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { CadAlert } from '../dist/index.js'

const markup = renderToString(
  createElement(
    CadAlert,
    { heading: 'Review needed', variant: 'warning' },
    'The implementation and contract have diverged.',
  ),
)

if (
  !markup.includes('<cad-alert') ||
  !markup.includes('The implementation and contract have diverged.')
) {
  throw new Error('React SSR did not preserve the custom element content.')
}
