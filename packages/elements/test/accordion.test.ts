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

    expect(first.tone).toBe('blue')
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

  it('animates disclosure content and keeps it rendered while closing', async () => {
    const item = document.createElement('cad-accordion-item')
    item.heading = 'Animated explanation'
    item.style.setProperty('--cad-motion-duration-enter', '40ms')
    item.style.setProperty('--cad-motion-duration-exit', '40ms')
    item.textContent = 'The content follows the notebook motion language.'
    document.body.append(item)
    await item.updateComplete

    const details = item.shadowRoot?.querySelector('details')
    const content = item.shadowRoot?.querySelector('.content')
    item.shadowRoot?.querySelector('summary')?.click()
    await item.updateComplete

    expect(item.open).toBe(true)
    expect(details?.open).toBe(true)
    expect(content?.getAnimations()).toHaveLength(1)
    expect(
      (content?.getAnimations()[0]?.effect as KeyframeEffect).getKeyframes()[0]
        ?.height,
    ).toBe('0px')

    await vi.waitFor(() => expect(content?.getAnimations()).toHaveLength(0))
    item.shadowRoot?.querySelector('summary')?.click()
    await item.updateComplete

    expect(item.open).toBe(false)
    expect(details?.open).toBe(true)
    expect(content?.getAnimations()).toHaveLength(1)
    await vi.waitFor(() => expect(details?.open).toBe(false))
  })
})
