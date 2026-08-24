import { afterEach, describe, expect, it } from 'vitest'

import '../src/divider/cad-divider.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-divider', () => {
  it('is decorative by default', async () => {
    expectRegistered('cad-divider')
    const element = document.createElement('cad-divider')
    document.body.append(element)
    await element.updateComplete

    const divider = element.shadowRoot?.querySelector('[part="base"]')
    expect(divider?.getAttribute('role')).toBe('none')
    expect(divider?.getAttribute('aria-hidden')).toBe('true')
  })

  it('exposes separator semantics when requested', async () => {
    const element = document.createElement('cad-divider')
    element.decorative = false
    element.orientation = 'vertical'
    document.body.append(element)
    await element.updateComplete

    const divider = element.shadowRoot?.querySelector('[part="base"]')
    expect(divider?.getAttribute('role')).toBe('separator')
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical')
  })
})
