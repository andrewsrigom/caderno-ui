import { afterEach, describe, expect, it } from 'vitest'

import '../src/chart/cad-chart.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

const createItem = (label: string, value: number) => {
  const item = document.createElement('cad-chart-item')
  item.label = label
  item.value = value
  item.textContent = `${label}: ${value}`
  return item
}

describe('cad-chart', () => {
  it('renders deterministic rough bars and an accessible data table', async () => {
    expectRegistered('cad-chart')
    expectRegistered('cad-chart-item')
    const chart = document.createElement('cad-chart')
    chart.heading = 'Weekly reading'
    chart.append(createItem('Monday', 4), createItem('Tuesday', 7))
    document.body.append(chart)
    await chart.updateComplete

    const drawing = chart.shadowRoot?.querySelector('[data-rough]')
    const firstDrawing = drawing?.innerHTML
    expect(drawing?.children).toHaveLength(2)
    expect(chart.shadowRoot?.querySelectorAll('tbody tr')).toHaveLength(2)
    expect(
      chart.shadowRoot?.querySelector('caption')?.textContent?.trim(),
    ).toBe('Weekly reading')

    chart.requestUpdate()
    await chart.updateComplete
    expect(drawing?.innerHTML).toBe(firstDrawing)
  })

  it('supports line and donut chart modes from the same declarative data', async () => {
    const chart = document.createElement('cad-chart')
    chart.append(
      createItem('Design', 5),
      createItem('Build', 8),
      createItem('Review', 3),
    )
    document.body.append(chart)

    chart.type = 'line'
    await chart.updateComplete
    expect(
      chart.shadowRoot?.querySelector('[data-rough]')?.children.length,
    ).toBe(4)

    chart.type = 'donut'
    await chart.updateComplete
    expect(
      chart.shadowRoot?.querySelector('[data-rough]')?.children,
    ).toHaveLength(3)
    expect(chart.shadowRoot?.querySelector('.donut-hole')).not.toBeNull()
  })

  it('reacts to declarative item changes and clamps negative values', async () => {
    const chart = document.createElement('cad-chart')
    const item = createItem('Open issues', -4)
    chart.append(item)
    document.body.append(chart)
    await chart.updateComplete

    expect(chart.shadowRoot?.querySelector('tbody td')?.textContent).toBe('0')
    item.value = 12
    await new Promise<void>((resolve) => setTimeout(resolve))
    await chart.updateComplete
    expect(chart.shadowRoot?.querySelector('tbody td')?.textContent).toBe('12')
  })

  it('normalizes invalid drawing options and labels the figure from its title slot', async () => {
    const chart = document.createElement('cad-chart')
    const title = document.createElement('span')
    title.slot = 'title'
    title.textContent = 'Custom chart title'
    chart.fillStyle = 'invalid' as never
    chart.roughness = Number.NaN
    chart.seed = Number.NaN
    chart.append(title, createItem('Ready', 9))
    document.body.append(chart)
    await chart.updateComplete

    expect(
      chart.shadowRoot?.querySelector('[data-rough]')?.children,
    ).toHaveLength(1)
    expect(
      chart.shadowRoot
        ?.querySelector('figure')
        ?.getAttribute('aria-labelledby'),
    ).toBe('chart-title')
    expect(
      chart.shadowRoot?.querySelector('table')?.getAttribute('aria-labelledby'),
    ).toBe('chart-title')
  })
})
