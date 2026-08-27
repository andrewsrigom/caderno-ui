import { afterEach, describe, expect, it } from 'vitest'

import '../src/table/cad-table.js'
import { expectRegistered } from './contract.js'

function createColumn(key: string, label: string) {
  const column = document.createElement('cad-table-column')
  column.key = key
  column.label = label
  return column
}

function createRow(values: Record<string, string>) {
  const row = document.createElement('cad-table-row')
  for (const [column, value] of Object.entries(values)) {
    const cell = document.createElement('cad-table-cell')
    cell.column = column
    cell.textContent = value
    row.append(cell)
  }
  return row
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-table', () => {
  for (const variant of ['grid', 'ruled'] as const) {
    for (const typography of ['hand', 'body'] as const) {
      it(`uses one borderless blue header band in ${variant}/${typography}`, async () => {
        const table = document.createElement('cad-table')
        table.variant = variant
        table.typography = typography
        table.caption = 'Review queue'
        table.style.setProperty('--cad-table-ink', '#005bac')
        table.style.setProperty('--cad-table-paper', '#fff')
        table.append(
          createColumn('note', 'Note'),
          createColumn('status', 'Status'),
          createRow({ note: 'Caching', status: 'Ready' }),
          createRow({ note: 'Queues', status: 'Draft' }),
        )
        document.body.append(table)
        await table.updateComplete

        const headers = [...table.shadowRoot!.querySelectorAll('th')]
        const background = getComputedStyle(headers[0]!).backgroundColor
        expect(background).not.toBe('rgba(0, 0, 0, 0)')
        for (const header of headers) {
          const style = getComputedStyle(header)
          expect(style.color).toBe('rgb(0, 91, 172)')
          expect(style.backgroundColor).toBe(background)
          expect(style.backgroundImage).toBe('none')
          expect(style.borderWidth).toBe('0px')
          expect(getComputedStyle(header, '::after').content).toBe('none')
        }
        const caption = table.shadowRoot!.querySelector('caption')!
        expect(getComputedStyle(caption).borderBottomWidth).toBe('0px')
        const rows = table.shadowRoot!.querySelectorAll('tbody tr')
        const firstCell = rows[0]!.querySelector('td')!
        expect(getComputedStyle(firstCell).borderTopWidth).toBe('0px')
        expect(getComputedStyle(firstCell).borderRightWidth).toBe(
          variant === 'grid' ? '1px' : '0px',
        )
        expect(
          getComputedStyle(rows[1]!.querySelector('td')!).borderTopWidth,
        ).toBe('1px')
      })
    }
  }

  it('renders technical values as code without interpreting markup', async () => {
    const table = document.createElement('cad-table')
    expect(table.typography).toBe('hand')
    table.typography = 'body'
    const column = createColumn('type', 'Type')
    column.format = 'code'
    table.append(column, createRow({ type: '<script>alert(1)</script>' }))
    document.body.append(table)
    await table.updateComplete
    expect(table).toHaveAttribute('typography', 'body')
    expect(table.shadowRoot?.querySelector('td code')?.textContent).toBe(
      '<script>alert(1)</script>',
    )
    expect(table.shadowRoot?.querySelector('script')).toBeNull()
  })
  it('renders a native named table from declarative children', async () => {
    for (const tagName of [
      'cad-table',
      'cad-table-cell',
      'cad-table-column',
      'cad-table-row',
    ] as const) {
      expectRegistered(tagName)
    }

    const table = document.createElement('cad-table')
    expect(table.variant).toBe('grid')
    table.caption = 'Expected costs'
    table.append(
      createColumn('tool', 'Structure'),
      createColumn('lookup', 'Lookup'),
      createRow({ lookup: 'O(1)', tool: 'Map' }),
      createRow({ lookup: 'O(n)', tool: 'Array' }),
    )
    document.body.append(table)
    await table.updateComplete

    expect(table.shadowRoot?.querySelector('caption')?.textContent).toContain(
      'Expected costs',
    )
    expect(table.shadowRoot?.querySelectorAll('thead th')).toHaveLength(2)
    expect(table.shadowRoot?.querySelectorAll('tbody tr')).toHaveLength(2)
    expect(table.shadowRoot?.querySelector('[part="base"]')).toHaveAttribute(
      'tabindex',
      '0',
    )
    expect(table.shadowRoot?.querySelector('tbody tr')?.textContent).toContain(
      'Map',
    )
  })

  it('updates when child cell text changes and exposes an empty state', async () => {
    const table = document.createElement('cad-table')
    const column = createColumn('status', 'Status')
    table.append(column)
    document.body.append(table)
    await table.updateComplete

    expect(
      table.shadowRoot?.querySelector('[part="empty"]')?.textContent?.trim(),
    ).toBe('No data')

    const row = createRow({ status: 'Draft' })
    table.append(row)
    await new Promise((resolve) => setTimeout(resolve))
    await table.updateComplete
    expect(
      table.shadowRoot?.querySelector('tbody td')?.textContent?.trim(),
    ).toBe('Draft')

    const cell = row.querySelector('cad-table-cell')
    if (cell) cell.textContent = 'Ready'
    await new Promise((resolve) => setTimeout(resolve))
    await table.updateComplete
    expect(
      table.shadowRoot?.querySelector('tbody td')?.textContent?.trim(),
    ).toBe('Ready')
  })
})
