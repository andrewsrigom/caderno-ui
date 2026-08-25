import { afterEach, describe, expect, it } from 'vitest'

import '../src/paper/cad-paper.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-paper', () => {
  it('registers individually with neutral, notebook-native defaults', async () => {
    expectRegistered('cad-paper')
    const element = document.createElement('cad-paper')
    document.body.append(element)
    await element.updateComplete

    expect(element.elevation).toBe('flat')
    expect(element.margin).toBe(false)
    expect(element.pattern).toBe('ruled')
    expect(element.spacing).toBe('regular')
    expect(element.tone).toBe('paper')
    expect(element.shadowRoot?.querySelector('[part="base"]')).not.toBeNull()
    expect(element.shadowRoot?.querySelector('[part="content"]')).not.toBeNull()
    expect(
      element.shadowRoot?.querySelector('[part="margin-line"]'),
    ).not.toBeNull()
  })

  it('reflects visual choices and preserves application-owned semantics', async () => {
    const element = document.createElement('cad-paper')
    const article = document.createElement('article')
    article.innerHTML = '<h2>Review notes</h2><p>Keep native structure.</p>'
    element.append(article)
    element.elevation = 'raised'
    element.margin = true
    element.pattern = 'grid'
    element.spacing = 'spacious'
    element.tone = 'mint'
    document.body.append(element)
    await element.updateComplete

    expect(element.getAttribute('elevation')).toBe('raised')
    expect(element.hasAttribute('margin')).toBe(true)
    expect(element.getAttribute('pattern')).toBe('grid')
    expect(element.getAttribute('spacing')).toBe('spacious')
    expect(element.getAttribute('tone')).toBe('mint')
    expect(element.querySelector('article > h2')?.textContent).toBe(
      'Review notes',
    )
    expect(element.shadowRoot?.querySelector('slot')).not.toBeNull()
  })
})
