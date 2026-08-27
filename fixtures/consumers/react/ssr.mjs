import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { CadAlert } from '@caderno-ui/react/alert'
import { CadBadge } from '@caderno-ui/react/badge'
import { CadBookmark } from '@caderno-ui/react/bookmark'
import { CadCard, CadCardContent } from '@caderno-ui/react/card'
import { CadChart, CadChartItem } from '@caderno-ui/react/chart'
import { CadDrawer } from '@caderno-ui/react/drawer'
import { CadFooter, CadFooterGroup } from '@caderno-ui/react/footer'
import { CadHeader } from '@caderno-ui/react/header'
import { CadIcon } from '@caderno-ui/react/icon'
import { CadNote } from '@caderno-ui/react/note'
import { CadPopover } from '@caderno-ui/react/popover'
import { CadProgress } from '@caderno-ui/react/progress'
import { CadSlider } from '@caderno-ui/react/slider'
import { CadSwitch } from '@caderno-ui/react/switch'
import {
  CadTabContent,
  CadTabs,
  CadTabsList,
  CadTabTrigger,
} from '@caderno-ui/react/tabs'

const markup = renderToString(
  createElement(
    'main',
    null,
    createElement(
      CadTabs,
      { defaultValue: 'note' },
      createElement(
        CadTabsList,
        { label: 'Fixture tabs' },
        createElement(CadTabTrigger, { label: 'Note', value: 'note' }, 'Note'),
      ),
      createElement(
        CadTabContent,
        { value: 'note' },
        createElement(
          CadCard,
          { folded: false },
          createElement(CadCardContent, null, 'Static card content.'),
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
          createElement(
            CadPopover,
            { anchor: 'fixture-trigger', heading: 'Packed popover' },
            'Static popover content.',
          ),
          createElement(
            CadDrawer,
            { heading: 'Packed drawer', placement: 'right' },
            'Static drawer content.',
          ),
          createElement(CadProgress, { label: 'Packed progress', value: 75 }),
          createElement(CadSlider, { label: 'Packed slider', value: 64 }),
          createElement(CadSwitch, { checked: true, label: 'Packed switch' }),
          createElement(
            CadChart,
            { heading: 'Packed chart' },
            createElement(
              CadChartItem,
              { label: 'Notes', value: 4 },
              'Notes: 4',
            ),
          ),
        ),
      ),
    ),
    createElement(
      CadHeader,
      { label: 'Packed header' },
      createElement('a', { href: '/components' }, 'Components'),
    ),
    createElement(
      CadFooter,
      { label: 'Packed footer' },
      createElement(
        CadFooterGroup,
        { heading: 'Product' },
        createElement('a', { href: '/components' }, 'Components'),
      ),
    ),
  ),
)

for (const tag of [
  'cad-tabs',
  'cad-tabs-list',
  'cad-tab-trigger',
  'cad-tab-content',
  'cad-alert',
  'cad-badge',
  'cad-bookmark',
  'cad-chart',
  'cad-chart-item',
  'cad-icon',
  'cad-note',
  'cad-popover',
  'cad-drawer',
  'cad-footer',
  'cad-footer-group',
  'cad-header',
  'cad-card',
  'cad-card-content',
  'cad-progress',
  'cad-slider',
  'cad-switch',
]) {
  if (!markup.includes(`<${tag}`)) throw new Error(`React SSR omitted ${tag}.`)
}
