import { afterEach, describe, expect, it } from 'vitest'

import '../src/icon/cad-icon.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-icon', () => {
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
})
