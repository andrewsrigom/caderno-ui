import { afterEach, describe, expect, it } from 'vitest'

import '../src/tape/cad-tape.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-tape', () => {
  it('is decorative and exposes its surface as a CSS part', async () => {
    expectRegistered('cad-tape')
    const element = document.createElement('cad-tape')
    element.tilt = 2
    document.body.append(element)
    await element.updateComplete
    const surface = element.shadowRoot?.querySelector('[part="base"]')
    expect(surface?.getAttribute('aria-hidden')).toBe('true')
    expect(surface?.getAttribute('style')).toContain('2deg')
  })
})
