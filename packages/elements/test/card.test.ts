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

    const base = card.shadowRoot?.querySelector<HTMLElement>(
      'article[part="base"]',
    )
    expect(base).not.toBeNull()
    expect(card.folded).toBe(false)
    expect(getComputedStyle(base!).clipPath).toBe('none')
    expect(getComputedStyle(base!).paddingTop).toBe('0px')
    expect(getComputedStyle(base!).borderTopStyle).toBe('solid')
    const band = card.shadowRoot?.querySelector<HTMLElement>('[part="band"]')
    const fold = card.shadowRoot?.querySelector<HTMLElement>('[part="fold"]')
    expect(getComputedStyle(band!).display).toBe('none')
    expect(getComputedStyle(fold!).display).toBe('none')
    expect(header.shadowRoot?.querySelector('header')).not.toBeNull()
    expect(
      getComputedStyle(header.shadowRoot!.querySelector('header')!)
        .borderBottomStyle,
    ).toBe('solid')
    expect(title.textContent).toContain('Architecture')
    expect(content.textContent).toContain('Typed contracts')
    expect(footer.shadowRoot?.querySelector('footer')).not.toBeNull()
    expect(
      getComputedStyle(footer.shadowRoot!.querySelector('footer')!)
        .borderTopStyle,
    ).toBe('solid')
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

  it('keeps section dividers without an outer border in the plain variant', async () => {
    const card = document.createElement('cad-card')
    const header = document.createElement('cad-card-header')
    const content = document.createElement('cad-card-content')
    const footer = document.createElement('cad-card-footer')
    card.variant = 'plain'
    header.textContent = 'Review confidence'
    content.textContent = 'Evidence is ready.'
    footer.textContent = 'Updated today'
    card.append(header, content, footer)
    document.body.append(card)
    await Promise.all([
      card.updateComplete,
      header.updateComplete,
      content.updateComplete,
      footer.updateComplete,
    ])

    const base = card.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!
    expect(getComputedStyle(base).borderTopWidth).toBe('0px')
    expect(getComputedStyle(base).boxShadow).toBe('none')
    expect(getComputedStyle(base).clipPath).toBe('none')
    expect(
      getComputedStyle(header.shadowRoot!.querySelector('header')!)
        .borderBottomStyle,
    ).toBe('solid')
    expect(
      getComputedStyle(footer.shadowRoot!.querySelector('footer')!)
        .borderTopStyle,
    ).toBe('solid')
  })

  it('retains the folded treatment as an explicit option', async () => {
    const card = document.createElement('cad-card')
    card.folded = true
    card.textContent = 'Optional paper fold'
    document.body.append(card)
    await card.updateComplete

    const base = card.shadowRoot!.querySelector<HTMLElement>('[part="base"]')!
    const band = card.shadowRoot!.querySelector<HTMLElement>('[part="band"]')!
    const fold = card.shadowRoot!.querySelector<HTMLElement>('[part="fold"]')!
    expect(getComputedStyle(base).clipPath).toContain('polygon')
    expect(getComputedStyle(band).display).not.toBe('none')
    expect(getComputedStyle(fold).display).not.toBe('none')
    const foldSeam = getComputedStyle(fold, '::after')
    expect(foldSeam.left).toBe('0px')
    expect(foldSeam.top).toBe('0px')
    expect(foldSeam.transform).toBe('none')
    expect(parseFloat(foldSeam.width)).toBeGreaterThan(
      parseFloat(getComputedStyle(fold).width) / 2,
    )
  })
})
