import { afterEach, describe, expect, it } from 'vitest'

import '../src/card/cad-card.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-card', () => {
  it('renders an article with heading, body, footer, and public parts', async () => {
    expectRegistered('cad-card')
    const element = document.createElement('cad-card')
    element.heading = 'Architecture'
    element.innerHTML = 'Typed contracts<span slot="footer">Reviewed</span>'
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot?.querySelector('article[part="base"]'),
    ).not.toBeNull()
    expect(
      element.shadowRoot?.querySelector('[part="title"]')?.textContent,
    ).toContain('Architecture')
    expect(element.shadowRoot?.querySelector('[part="footer"]')).not.toBeNull()
  })

  it('renders a native anchor when href is provided', async () => {
    const element = document.createElement('cad-card')
    element.href = '/components'
    element.heading = 'Components'
    document.body.append(element)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/components',
    )
  })
})
