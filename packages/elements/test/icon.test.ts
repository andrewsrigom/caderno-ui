import { afterEach, describe, expect, it } from 'vitest'

import '../src/icon/cad-icon.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-icon', () => {
  it('registers individually and is decorative by default', async () => {
    expectRegistered('cad-icon')
    const icon = document.createElement('cad-icon')
    document.body.append(icon)
    await icon.updateComplete

    const svg = icon.shadowRoot?.querySelector('svg')
    expect(icon.name).toBe('spark')
    expect(icon.getAttribute('name')).toBe('spark')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
    expect(svg?.hasAttribute('role')).toBe(false)
  })

  it('renders a labelled icon accessibly', async () => {
    const icon = document.createElement('cad-icon')
    icon.label = 'Saved'
    icon.name = 'bookmark'
    document.body.append(icon)

    await icon.updateComplete
    const svg = icon.shadowRoot?.querySelector('svg')

    expect(svg?.getAttribute('role')).toBe('img')
    expect(svg?.getAttribute('aria-label')).toBe('Saved')
    expect(svg?.querySelectorAll('path').length).toBeGreaterThan(0)
    expect(svg?.querySelector('path')?.namespaceURI).toBe(
      'http://www.w3.org/2000/svg',
    )
  })

  it('stays decorative when a framework assigns an undefined label', async () => {
    const icon = document.createElement('cad-icon')
    icon.label = undefined as unknown as string
    document.body.append(icon)
    await icon.updateComplete

    expect(
      icon.shadowRoot?.querySelector('svg')?.getAttribute('aria-hidden'),
    ).toBe('true')
  })
})
