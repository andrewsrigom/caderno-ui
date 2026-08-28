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

  it('contains horizontal overflow inside a grid without adding vertical scrolling', async () => {
    const container = document.createElement('div')
    container.style.cssText = 'display: grid; width: 320px;'
    const board = document.createElement('cad-kanban')
    for (const title of ['To do', 'In progress', 'Done']) {
      const column = document.createElement('cad-kanban-column')
      column.title = title
      board.append(column)
    }
    container.append(board)
    document.body.append(container)
    await nextFrame()

    const viewport =
      board.shadowRoot!.querySelector<HTMLElement>('[part="board"]')!
    expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth)
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth)
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.clientHeight + 1)

    const card = document.createElement('cad-kanban-card')
    card.textContent = 'A task with enough detail to wrap inside the column.'
    board.querySelector('cad-kanban-column')!.append(card)
    await nextFrame()
    expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth)
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.clientHeight + 1)
  })
})
