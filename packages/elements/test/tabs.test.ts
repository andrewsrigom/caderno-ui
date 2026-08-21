import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import type { CadTabChangeEvent } from '../src/tabs/cad-tabs.js'
import '../src/tabs/index.js'
import { expectRegistered, nextFrame } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

const settleTabs = async (tabs: HTMLElementTagNameMap['cad-tabs']) => {
  await tabs.updateComplete
  tabs.shadowRoot?.querySelector('slot')?.dispatchEvent(new Event('slotchange'))
  await tabs.updateComplete
}

describe('cad-tabs', () => {
  it('registers the controller and panel through the individual tabs entrypoint', () => {
    expectRegistered('cad-tabs')
    expectRegistered('cad-tab')
  })

  it('connects declarative panels and supports real keyboard navigation', async () => {
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
    document.body.addEventListener('cad-tab-change', listener, { once: true })
    const user = userEvent.setup()
    await user.click(buttons![1]!)
    await user.keyboard('{ArrowLeft}')
    await tabs.updateComplete

    expect(tabs.activeTab).toBe('problem')
    expect(tabs.getAttribute('active-tab')).toBe('problem')
    expect(tabs.shadowRoot?.activeElement).toBe(buttons?.[0])
    expect(listener.mock.calls[0]?.[0].bubbles).toBe(true)
    expect(listener.mock.calls[0]?.[0].composed).toBe(true)
    expect(listener.mock.calls[0]?.[0].detail).toEqual({
      activeTab: 'problem',
      previousTab: 'contract',
    })
  })

  it('tracks dynamic direct children and disconnects cleanly', async () => {
    const tabs = document.createElement('cad-tabs')
    const first = document.createElement('cad-tab')
    first.name = 'first'
    first.label = 'First'
    tabs.append(first)
    document.body.append(tabs)
    await settleTabs(tabs)

    const second = document.createElement('cad-tab')
    second.name = 'second'
    second.label = 'Second'
    tabs.append(second)
    await nextFrame()
    await tabs.updateComplete
    expect(tabs.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(2)

    tabs.remove()
    second.label = 'Changed while disconnected'
    await nextFrame()
    expect(tabs.isConnected).toBe(false)
  })

  it('fails open for duplicate panel names', async () => {
    const tabs = document.createElement('cad-tabs')
    const first = document.createElement('cad-tab')
    const duplicate = document.createElement('cad-tab')
    first.name = duplicate.name = 'same'
    tabs.append(first, duplicate)
    document.body.append(tabs)
    await settleTabs(tabs)

    expect(tabs.dataset.invalid).toBe('true')
    expect(first.hidden).toBe(false)
    expect(duplicate.hidden).toBe(false)
  })
})
