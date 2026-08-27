import { afterEach, describe, expect, it } from 'vitest'

import '../src/callout/cad-callout.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-callout', () => {
  it('renders static editorial content without live-region semantics', async () => {
    expectRegistered('cad-callout')
    const element = document.createElement('cad-callout')
    element.heading = 'Contract'
    element.textContent = 'Prefer attributes for primitive values.'
    document.body.append(element)
    await element.updateComplete

    const base = element.shadowRoot?.querySelector('aside')
    expect(base?.hasAttribute('role')).toBe(false)
    expect(
      element.shadowRoot?.querySelector('[part="title"]')?.textContent,
    ).toContain('Contract')
    expect(element.shadowRoot?.querySelector('[part="content"]')).not.toBeNull()
  })

  it('selects an intrinsic mark and heading from the variant', async () => {
    const element = document.createElement('cad-callout')
    element.variant = 'tip'
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot?.querySelector('[part="title"]')?.textContent,
    ).toContain('Tip')
    expect(
      element.shadowRoot?.querySelector('[part="icon"] svg'),
    ).not.toBeNull()
    expect(customElements.get('cad-icon')).toBeUndefined()
  })

  it('composes an optional editorial action without a live region', async () => {
    const element = document.createElement('cad-callout')
    const action = document.createElement('a')
    action.slot = 'action'
    action.href = '/composition'
    action.textContent = 'Read more'
    element.append('Supporting guidance.', action)
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="action"]')
        ?.assignedElements(),
    ).toEqual([action])
    expect(element.shadowRoot?.querySelector('[role]')).toBeNull()
  })
})
