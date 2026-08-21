import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CadTabChangeEvent } from '../src/tabs/cad-tabs.js'
import '../src/tabs/index.js'

afterEach(() => {
  document.body.replaceChildren()
})

const settleTabs = async (tabs: HTMLElementTagNameMap['cad-tabs']) => {
  await tabs.updateComplete
  tabs.shadowRoot?.querySelector('slot')?.dispatchEvent(new Event('slotchange'))
  await tabs.updateComplete
}

describe('cad-tabs', () => {
  it('connects declarative panels and supports keyboard navigation', async () => {
    const tabs = document.createElement('cad-tabs')
    tabs.defaultTab = 'contract'

    const problem = document.createElement('cad-tab')
    problem.label = 'Problem'
    problem.name = 'problem'

    const contract = document.createElement('cad-tab')
    contract.label = 'Contract'
    contract.name = 'contract'

    tabs.append(problem, contract)
    document.body.append(tabs)
    await settleTabs(tabs)

    const buttons =
      tabs.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    expect(buttons).toHaveLength(2)
    expect(buttons?.[1]?.getAttribute('aria-selected')).toBe('true')
    expect(problem.hidden).toBe(true)
    expect(contract.hidden).toBe(false)

    const listener = vi.fn<(event: CadTabChangeEvent) => void>()
    tabs.addEventListener('cad-tab-change', listener)
    buttons?.[1]?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
    )
    await tabs.updateComplete

    expect(tabs.activeTab).toBe('problem')
    expect(listener.mock.calls[0]?.[0].detail).toEqual({
      activeTab: 'problem',
      previousTab: 'contract',
    })
  })
})
