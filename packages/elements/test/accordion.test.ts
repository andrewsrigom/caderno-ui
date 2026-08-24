import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/accordion/cad-accordion.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-accordion', () => {
  it('uses native details and keeps a single item open', async () => {
    expectRegistered('cad-accordion')
    expectRegistered('cad-accordion-item')
    const accordion = document.createElement('cad-accordion')
    const first = document.createElement('cad-accordion-item')
    const second = document.createElement('cad-accordion-item')
    accordion.mode = 'single'
    first.heading = 'First'
    first.open = true
    second.heading = 'Second'
    accordion.append(first, second)
    document.body.append(accordion)
    await Promise.all([
      accordion.updateComplete,
      first.updateComplete,
      second.updateComplete,
    ])

    second.shadowRoot?.querySelector('summary')?.click()
    await vi.waitFor(() => expect(second.open).toBe(true))
    await first.updateComplete

    expect(first.open).toBe(false)
    expect(second.shadowRoot?.querySelector('details')?.open).toBe(true)
  })

  it('emits a composed toggle event and blocks disabled disclosure', async () => {
    const item = document.createElement('cad-accordion-item')
    const toggle = vi.fn()
    item.heading = 'Contract'
    document.body.addEventListener('cad-accordion-toggle', toggle)
    document.body.append(item)
    await item.updateComplete

    item.shadowRoot?.querySelector('summary')?.click()
    await vi.waitFor(() => expect(toggle).toHaveBeenCalledOnce())

    item.disabled = true
    item.open = false
    await item.updateComplete
    item.shadowRoot?.querySelector('summary')?.click()
    expect(item.open).toBe(false)
  })
})
