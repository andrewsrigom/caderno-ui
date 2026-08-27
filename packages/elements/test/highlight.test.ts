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

  it('starts as a yellow marker and reflects another treatment', async () => {
    const element = document.createElement('cad-highlight')
    document.body.append(element)
    await element.updateComplete

    expect(element.tone).toBe('yellow')
    expect(element.variant).toBe('marker')
    expect(element.getAttribute('tone')).toBe('yellow')
    expect(element.getAttribute('variant')).toBe('marker')

    element.tone = 'lavender'
    element.variant = 'double'
    await element.updateComplete

    expect(element.getAttribute('tone')).toBe('lavender')
    expect(element.getAttribute('variant')).toBe('double')
  })
})
