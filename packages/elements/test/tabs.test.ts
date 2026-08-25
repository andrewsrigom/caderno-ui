import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import type { CadTabChangeEvent } from '../src/tabs/cad-tabs.js'
import '../src/tabs/index.js'
import { expectRegistered, nextFrame } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

function createTab(value: string, label: string) {
  const trigger = document.createElement('cad-tab-trigger')
  trigger.value = value
  trigger.label = label
  trigger.textContent = label

  const content = document.createElement('cad-tab-content')
  content.value = value
  content.textContent = `${label} content`
  return { content, trigger }
}

async function createTabs() {
  const tabs = document.createElement('cad-tabs')
  const list = document.createElement('cad-tabs-list')
  list.label = 'Review stages'
  const problem = createTab('problem', 'Problem')
  const contract = createTab('contract', 'Contract')
  list.append(problem.trigger, contract.trigger)
  tabs.append(list, problem.content, contract.content)
  document.body.append(tabs)
  await nextFrame()
  await tabs.updateComplete
  await Promise.all([
    problem.trigger.updateComplete,
    contract.trigger.updateComplete,
    problem.content.updateComplete,
    contract.content.updateComplete,
  ])
  return { contract, list, problem, tabs }
}

describe('cad-tabs', () => {
  it('registers the complete compound family through one entrypoint', () => {
    expectRegistered('cad-tabs')
    expectRegistered('cad-tabs-list')
    expectRegistered('cad-tab-trigger')
    expectRegistered('cad-tab-content')
    expect(customElements.get('cad-icon')).toBeUndefined()
  })

  it('connects triggers and panels with a controlled value', async () => {
    const { contract, problem, tabs } = await createTabs()
    tabs.value = 'contract'
    await tabs.updateComplete
    await nextFrame()

    expect(contract.trigger.active).toBe(true)
    expect(contract.content.active).toBe(true)
    expect(problem.trigger.active).toBe(false)
    expect(problem.content.active).toBe(false)
    expect(
      contract.trigger.shadowRoot
        ?.querySelector('button')
        ?.getAttribute('aria-selected'),
    ).toBe('true')
  })

  it('supports keyboard navigation and emits a composed value change', async () => {
    const { contract, problem, tabs } = await createTabs()
    tabs.value = 'contract'
    await tabs.updateComplete
    await nextFrame()

    const listener = vi.fn<(event: CadTabChangeEvent) => void>()
    document.body.addEventListener('cad-tab-change', listener, { once: true })
    const contractButton = contract.trigger.shadowRoot?.querySelector('button')
    contractButton?.focus()
    const user = userEvent.setup()
    await user.keyboard('{ArrowLeft}')
    await nextFrame()

    expect(tabs.value).toBe('problem')
    expect(problem.trigger.shadowRoot?.activeElement).toBe(
      problem.trigger.shadowRoot?.querySelector('button'),
    )
    expect(listener.mock.calls[0]?.[0].detail).toEqual({
      previousValue: 'contract',
      value: 'problem',
    })
    expect(listener.mock.calls[0]?.[0].bubbles).toBe(true)
    expect(listener.mock.calls[0]?.[0].composed).toBe(true)
  })

  it('tracks dynamic composition and fails open for mismatched values', async () => {
    const { list, tabs } = await createTabs()
    const extra = createTab('evidence', 'Evidence')
    list.append(extra.trigger)
    await nextFrame()
    expect(tabs.dataset.invalid).toBe('true')

    tabs.append(extra.content)
    await nextFrame()
    expect(tabs.dataset.invalid).toBeUndefined()

    tabs.remove()
    extra.trigger.label = 'Changed while disconnected'
    await nextFrame()
    expect(tabs.isConnected).toBe(false)
  })
})
