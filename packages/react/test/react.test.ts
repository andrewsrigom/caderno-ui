import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Link, MemoryRouter, useLocation, useNavigate } from 'react-router'

import {
  CadAlert as CadAlertElement,
  type CadDismissEvent,
} from '@caderno-ui/elements/alert'
import {
  CadChart as CadChartElement,
  CadChartItem as CadChartItemElement,
} from '@caderno-ui/elements/chart'
import { CadAlert } from '../src/alert.js'
import { CadChart, CadChartItem } from '../src/chart.js'
import { CadList, CadListItem } from '../src/list.js'

describe('@caderno-ui/react', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('maps React props and typed custom events to the canonical element', async () => {
    const onDismiss = vi.fn<(event: CadDismissEvent) => void>()
    expect('heading' in CadAlertElement.prototype).toBe(true)

    act(() => {
      root.render(
        createElement(
          CadAlert,
          {
            dismissible: true,
            heading: 'Review needed',
            onDismiss,
            variant: 'warning',
          },
          'The implementation and contract have diverged.',
        ),
      )
    })

    const alert = container.querySelector('cad-alert')
    expect(alert).toBeInstanceOf(customElements.get('cad-alert'))
    await alert?.updateComplete
    expect(alert?.heading).toBe('Review needed')
    expect(alert?.variant).toBe('warning')

    act(() => {
      alert?.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click()
    })

    expect(onDismiss).toHaveBeenCalledOnce()
    expect(onDismiss.mock.calls[0]?.[0].detail).toEqual({
      variant: 'warning',
    })
  })

  it('maps declarative chart data without a parallel React implementation', () => {
    act(() => {
      root.render(
        createElement(
          CadChart,
          { heading: 'Review trend', seed: 7, type: 'line' },
          createElement(CadChartItem, { label: 'Ready', value: 9 }, 'Ready: 9'),
        ),
      )
    })

    const chart = container.querySelector('cad-chart')
    const item = container.querySelector('cad-chart-item')
    expect(chart).toBeInstanceOf(CadChartElement)
    expect(item).toBeInstanceOf(CadChartItemElement)
    expect(chart?.heading).toBe('Review trend')
    expect(chart?.seed).toBe(7)
    expect(item?.label).toBe('Ready')
    expect(item?.value).toBe(9)
  })

  it('composes real router links and programmatic actions without nested anchors', async () => {
    let finishSave: () => void = () => {}
    const saveReview = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSave = resolve
        }),
    )
    function ReviewActions() {
      const navigate = useNavigate()
      const location = useLocation()
      return createElement(
        'div',
        null,
        createElement('output', null, location.pathname),
        createElement(
          CadList,
          { label: 'Review actions' },
          createElement(CadListItem, null, 'Two notes ready for review.'),
          createElement(
            CadListItem,
            null,
            createElement(Link, { slot: 'action', to: '/notes' }, 'Open notes'),
          ),
          createElement(
            CadListItem,
            null,
            createElement(
              'button',
              {
                slot: 'action',
                type: 'button',
                onClick: () => {
                  void saveReview().then(() => navigate('/reviews'))
                },
              },
              'Save and continue',
            ),
          ),
        ),
      )
    }
    act(() =>
      root.render(
        createElement(MemoryRouter, null, createElement(ReviewActions)),
      ),
    )
    const list = container.querySelector('cad-list')!
    const items = [...container.querySelectorAll('cad-list-item')]
    await list.updateComplete
    await Promise.all(items.map((item) => item.updateComplete))
    expect(list.variant).toBe('bullet')
    expect(list.compact).toBe(false)
    expect(container.querySelectorAll('a')).toHaveLength(1)
    for (const item of items)
      expect(item.shadowRoot?.querySelector('a')).toBeNull()
    const link = container.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/notes')
    act(() => link.click())
    expect(container.querySelector('output')?.textContent).toBe('/notes')
    expect(items[0].shadowRoot?.querySelector('.arrow')).toBeNull()
    expect(items[1].shadowRoot?.querySelector('.arrow')).not.toBeNull()
    expect(items[2].shadowRoot?.querySelector('.arrow')).not.toBeNull()
    const button = container.querySelector<HTMLButtonElement>(
      'button[slot="action"]',
    )!
    act(() => button.click())
    expect(saveReview).toHaveBeenCalledOnce()
    expect(container.querySelector('output')?.textContent).toBe('/notes')
    await act(async () => {
      finishSave()
      await saveReview.mock.results[0].value
    })
    expect(container.querySelector('output')?.textContent).toBe('/reviews')
  })
})
