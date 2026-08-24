import { afterEach, describe, expect, it } from 'vitest'

import '../src/link/cad-link.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-link', () => {
  it('renders a native anchor and preserves its label slot', async () => {
    expectRegistered('cad-link')
    const element = document.createElement('cad-link')
    element.href = '/architecture'
    element.textContent = 'Architecture'
    document.body.append(element)
    await element.updateComplete

    const link = element.shadowRoot?.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/architecture')
    expect(link?.getAttribute('part')).toBe('base')
    expect(element.shadowRoot?.querySelector('slot')).not.toBeNull()
  })

  it('adds safe defaults and an indicator for external links', async () => {
    const element = document.createElement('cad-link')
    element.external = true
    element.href = 'https://example.com'
    document.body.append(element)
    await element.updateComplete

    const link = element.shadowRoot?.querySelector('a')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(
      element.shadowRoot?.querySelector('[part="external"]'),
    ).not.toBeNull()
  })
})
