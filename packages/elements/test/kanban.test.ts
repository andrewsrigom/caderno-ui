import { afterEach, describe, expect, it } from 'vitest'

import '../src/kanban/cad-kanban.js'
import { expectRegistered, nextFrame } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-kanban', () => {
  it('registers the compound board and counts direct cards', async () => {
    expectRegistered('cad-kanban')
    expectRegistered('cad-kanban-column')
    expectRegistered('cad-kanban-card')

    const board = document.createElement('cad-kanban')
    board.label = 'Release readiness'
    const column = document.createElement('cad-kanban-column')
    column.title = 'In review'
    column.append(
      document.createElement('cad-kanban-card'),
      document.createElement('cad-kanban-card'),
    )
    board.append(column)
    document.body.append(board)
    await nextFrame()

    expect(column.count).toBe(2)
    expect(
      board.shadowRoot
        ?.querySelector('[role="list"]')
        ?.getAttribute('aria-label'),
    ).toBe('Release readiness')
    expect(column.shadowRoot?.querySelectorAll('[role="list"]')).toHaveLength(1)
  })

  it('updates the visible count when a card is added', async () => {
    const column = document.createElement('cad-kanban-column')
    document.body.append(column)
    await nextFrame()
    column.append(document.createElement('cad-kanban-card'))
    await nextFrame()
    expect(column.count).toBe(1)
  })
})
