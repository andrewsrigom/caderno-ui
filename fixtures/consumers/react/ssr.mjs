import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { CadAlert } from '@caderno-ui/react/alert'
import { CadBadge } from '@caderno-ui/react/badge'
import { CadBookmark } from '@caderno-ui/react/bookmark'
import { CadChart, CadChartItem } from '@caderno-ui/react/chart'
import { CadIcon } from '@caderno-ui/react/icon'
import { CadNote } from '@caderno-ui/react/note'
import { CadProgress } from '@caderno-ui/react/progress'
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
      createElement(CadBadge, { tone: 'mint' }, 'Ready'),
      createElement(
        CadNote,
        { heading: 'Fixture note' },
        'Static note content.',
      ),
      createElement(CadProgress, { label: 'Packed progress', value: 75 }),
      createElement(
        CadChart,
        { heading: 'Packed chart' },
        createElement(CadChartItem, { label: 'Notes', value: 4 }, 'Notes: 4'),
      ),
    ),
  ),
)

for (const tag of [
  'cad-tabs',
  'cad-tab',
  'cad-alert',
  'cad-badge',
  'cad-bookmark',
  'cad-chart',
  'cad-chart-item',
  'cad-icon',
  'cad-note',
  'cad-progress',
]) {
  if (!markup.includes(`<${tag}`)) throw new Error(`React SSR omitted ${tag}.`)
}
