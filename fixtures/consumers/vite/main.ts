import '@caderno-ui/elements/alert'
import '@caderno-ui/tokens/notebook.css'

import { CadAlert } from '@caderno-ui/react/alert'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

if (!customElements.get('cad-alert')) {
  throw new Error(
    'The individual element entrypoint did not register cad-alert.',
  )
}
if (customElements.get('cad-bookmark') || customElements.get('cad-tabs')) {
  throw new Error('The alert subpath registered an unrelated custom element.')
}

const container = document.querySelector('#react-root')
if (!container) throw new Error('React fixture root is missing.')

createRoot(container).render(
  createElement(
    CadAlert,
    { heading: 'Packed React adapter' },
    'SSR-safe content.',
  ),
)
