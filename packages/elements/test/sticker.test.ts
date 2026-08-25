import { afterEach, describe, expect, it } from 'vitest'

import '../src/sticker/cad-sticker.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-sticker', () => {
  it('renders a label and optional decorative icon', async () => {
    expectRegistered('cad-sticker')
    const element = document.createElement('cad-sticker')
    element.icon = 'idea'
    element.label = 'New'
    document.body.append(element)
    await element.updateComplete
    expect(element.shadowRoot?.querySelector('[part="icon"]')).not.toBeNull()
    expect(
      element.shadowRoot?.querySelector('[part="text"]')?.textContent,
    ).toContain('New')
  })
})
