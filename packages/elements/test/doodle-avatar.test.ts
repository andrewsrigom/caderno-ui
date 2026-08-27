import { afterEach, describe, expect, it } from 'vitest'

import '../src/doodle-avatar/cad-doodle-avatar.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-doodle-avatar', () => {
  it('renders a decorative hand-drawn variant by default', async () => {
    expectRegistered('cad-doodle-avatar')
    const element = document.createElement('cad-doodle-avatar')
    element.variant = 'happy'
    document.body.append(element)
    await element.updateComplete

    const drawing = element.shadowRoot?.querySelector('[part="drawing"]')

    expect(drawing?.querySelectorAll('path')).toHaveLength(10)
    expect(drawing?.getAttribute('aria-hidden')).toBe('true')
    expect(drawing?.hasAttribute('role')).toBe(false)
  })

  it('becomes an accessible image when labelled', async () => {
    const element = document.createElement('cad-doodle-avatar')
    element.label = 'Ada smiling'
    element.variant = 'wink'
    document.body.append(element)
    await element.updateComplete

    const drawing = element.shadowRoot?.querySelector('[part="drawing"]')

    expect(drawing?.getAttribute('role')).toBe('img')
    expect(drawing?.getAttribute('aria-label')).toBe('Ada smiling')
    expect(drawing?.hasAttribute('aria-hidden')).toBe(false)
  })

  it('falls back to the happy drawing for an unknown runtime value', async () => {
    const element = document.createElement('cad-doodle-avatar')
    element.setAttribute('variant', 'unknown')
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot?.querySelectorAll('[part="drawing"] path'),
    ).toHaveLength(10)
  })
})
