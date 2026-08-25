import { afterEach, describe, expect, it } from 'vitest'

import '../src/highlight/cad-highlight.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-highlight', () => {
  it('uses a native mark and preserves slotted text', async () => {
    expectRegistered('cad-highlight')
    const element = document.createElement('cad-highlight')
    element.textContent = 'Evidence'
    document.body.append(element)
    await element.updateComplete
    expect(element.shadowRoot?.querySelector('mark')).not.toBeNull()
    expect(element.textContent).toBe('Evidence')
  })
})
