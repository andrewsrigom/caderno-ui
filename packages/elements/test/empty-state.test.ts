import { afterEach, describe, expect, it } from 'vitest'

import '../src/empty-state/cad-empty-state.js'
import { expectRegistered, nextFrame } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-empty-state', () => {
  it('keeps product illustrations and actions opt-in through slots', async () => {
    expectRegistered('cad-empty-state')
    expect(customElements.get('cad-icon')).toBeUndefined()

    const empty = document.createElement('cad-empty-state')
    empty.title = 'No matching decisions'
    empty.description = 'Try a broader owner or status filter.'
    document.body.append(empty)
    await empty.updateComplete
    expect(empty.size).toBe('comfortable')
    expect(empty.tone).toBe('neutral')
    expect(
      empty.shadowRoot?.querySelector('.icon')?.hasAttribute('hidden'),
    ).toBe(true)

    const action = document.createElement('button')
    action.slot = 'actions'
    action.textContent = 'Clear filters'
    empty.append(action)
    await nextFrame()
    await empty.updateComplete
    expect(
      empty.shadowRoot?.querySelector('.actions')?.hasAttribute('hidden'),
    ).toBe(false)
  })

  it('composes context and independent recovery actions', async () => {
    const empty = document.createElement('cad-empty-state')
    empty.eyebrow = 'No projects yet'
    empty.size = 'compact'
    empty.tone = 'blue'

    const primary = document.createElement('button')
    primary.slot = 'primary'
    primary.textContent = 'Create project'
    const secondary = document.createElement('a')
    secondary.slot = 'secondary'
    secondary.textContent = 'Browse templates'
    empty.append(primary, secondary)
    document.body.append(empty)
    await nextFrame()
    await empty.updateComplete

    expect(empty.getAttribute('size')).toBe('compact')
    expect(empty.getAttribute('tone')).toBe('blue')
    expect(
      empty.shadowRoot?.querySelector('[part="eyebrow"]')?.textContent,
    ).toContain('No projects yet')
    expect(
      empty.shadowRoot
        ?.querySelector('[part="actions"]')
        ?.hasAttribute('hidden'),
    ).toBe(false)
  })
})
