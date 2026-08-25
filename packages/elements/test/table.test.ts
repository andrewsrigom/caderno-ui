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
