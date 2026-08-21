import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { CadAlert } from '@caderno-ui/react/alert'
import { CadBookmark } from '@caderno-ui/react/bookmark'
import { CadIcon } from '@caderno-ui/react/icon'
import { CadTab, CadTabs } from '@caderno-ui/react/tabs'

const markup = renderToString(
  createElement(
    CadTabs,
    { defaultTab: 'note', label: 'Fixture tabs' },
    createElement(
      CadTab,
      { label: 'Note', name: 'note' },
      createElement(
        CadAlert,
        { heading: 'Packed SSR' },
        'Content survives SSR.',
      ),
      createElement(CadBookmark, { label: 'Save' }),
      createElement(CadIcon, { name: 'spark' }),
    ),
  ),
)

for (const tag of [
  'cad-tabs',
  'cad-tab',
  'cad-alert',
  'cad-bookmark',
  'cad-icon',
]) {
  if (!markup.includes(`<${tag}`)) throw new Error(`React SSR omitted ${tag}.`)
}
