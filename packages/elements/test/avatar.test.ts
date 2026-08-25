import { afterEach, describe, expect, it } from 'vitest'

import '../src/avatar/cad-avatar.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-avatar', () => {
  it('renders initials, supporting copy, and a named status', async () => {
    expectRegistered('cad-avatar')
    const element = document.createElement('cad-avatar')
    element.name = 'Ada Lovelace'
    element.description = 'Author'
    element.status = 'online'
    element.statusLabel = 'Available'
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot?.querySelector('[part="image"]')?.textContent,
    ).toContain('AL')
    expect(
      element.shadowRoot?.querySelector('[part="description"]')?.textContent,
    ).toContain('Author')
    expect(
      element.shadowRoot
        ?.querySelector('[part="status"]')
        ?.getAttribute('aria-label'),
    ).toBe('Available')
  })
})
