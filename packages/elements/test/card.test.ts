import { afterEach, describe, expect, it } from 'vitest'

import '../src/card/cad-card.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-card', () => {
  it('registers the composable card family without registering icons', async () => {
    for (const tagName of [
      'cad-card',
      'cad-card-content',
      'cad-card-footer',
      'cad-card-header',
      'cad-card-kicker',
      'cad-card-title',
    ] as const) {
      expectRegistered(tagName)
    }
    expect(customElements.get('cad-icon')).toBeUndefined()

    const card = document.createElement('cad-card')
    const header = document.createElement('cad-card-header')
    const title = document.createElement('cad-card-title')
    const heading = document.createElement('h2')
    const content = document.createElement('cad-card-content')
    const footer = document.createElement('cad-card-footer')
    heading.textContent = 'Architecture'
    title.append(heading)
    header.append(title)
    content.textContent = 'Typed contracts'
    footer.textContent = 'Reviewed'
    card.append(header, content, footer)
    document.body.append(card)
    await Promise.all([
      card.updateComplete,
      header.updateComplete,
      title.updateComplete,
      content.updateComplete,
      footer.updateComplete,
    ])

    expect(
      card.shadowRoot?.querySelector('article[part="base"]'),
    ).not.toBeNull()
    expect(header.shadowRoot?.querySelector('header')).not.toBeNull()
    expect(title.textContent).toContain('Architecture')
    expect(content.textContent).toContain('Typed contracts')
    expect(footer.shadowRoot?.querySelector('footer')).not.toBeNull()
  })

  it('renders a native anchor when href is provided', async () => {
    const element = document.createElement('cad-card')
    element.href = '/components'
    element.textContent = 'Components'
    document.body.append(element)
    await element.updateComplete

    expect(element.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/components',
    )
  })
})
