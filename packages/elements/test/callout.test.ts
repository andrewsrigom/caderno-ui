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

  it('selects an icon and heading from the variant', async () => {
    const element = document.createElement('cad-callout')
    element.variant = 'tip'
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot?.querySelector('[part="title"]')?.textContent,
    ).toContain('Tip')
    expect(
      element.shadowRoot?.querySelector('cad-icon')?.getAttribute('name'),
    ).toBe('lightbulb')
  })
})
