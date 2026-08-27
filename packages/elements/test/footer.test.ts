import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/footer/cad-footer.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-footer', () => {
  it('omits empty regions in a utility-only footer', async () => {
    const footer = document.createElement('cad-footer')
    footer.variant = 'minimal'
    footer.innerHTML = '<span slot="bottom">MIT licensed</span>'
    document.body.append(footer)
    await footer.updateComplete
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await footer.updateComplete
    expect(footer.shadowRoot?.querySelector('[part="top"]')).toHaveAttribute(
      'hidden',
    )
    expect(footer.shadowRoot?.querySelector('[part="groups"]')).toHaveAttribute(
      'hidden',
    )
    expect(
      footer.shadowRoot?.querySelector('[part="bottom"]'),
    ).not.toHaveAttribute('hidden')
  })
  it('renders a named contentinfo landmark with composable regions', async () => {
    expectRegistered('cad-footer')
    expectRegistered('cad-footer-group')
    const footer = document.createElement('cad-footer')
    footer.label = 'Caderno UI footer'
    footer.linksLabel = 'Product links'
    footer.socialLabel = 'Community links'
    footer.variant = 'dark'

    const brand = document.createElement('div')
    brand.slot = 'brand'
    brand.textContent = 'Caderno UI'
    const group = document.createElement('cad-footer-group')
    group.heading = 'Product'
    const link = document.createElement('a')
    link.href = '/components'
    link.textContent = 'Components'
    group.append(link)
    const social = document.createElement('a')
    social.href = '/community'
    social.slot = 'social'
    social.textContent = 'Community'
    const bottom = document.createElement('small')
    bottom.slot = 'bottom'
    bottom.textContent = 'MIT licensed'
    footer.append(brand, group, social, bottom)
    document.body.append(footer)

    await footer.updateComplete
    await group.updateComplete
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await footer.updateComplete

    expect(footer).toHaveAttribute('variant', 'dark')
    expect(footer.shadowRoot?.querySelector('footer')).toHaveAttribute(
      'aria-label',
      'Caderno UI footer',
    )
    expect(footer.shadowRoot?.querySelector('[part="groups"]')).toHaveAttribute(
      'aria-label',
      'Product links',
    )
    expect(footer.shadowRoot?.querySelector('[part="social"]')).toHaveAttribute(
      'aria-label',
      'Community links',
    )
    expect(
      footer.shadowRoot?.querySelector('[part="bottom"]'),
    ).not.toHaveAttribute('hidden')
  })

  it('keeps each group independently composable and reports disclosure state', async () => {
    const group = document.createElement('cad-footer-group')
    group.heading = 'Resources'
    const link = document.createElement('a')
    link.href = '/guide'
    link.textContent = 'Guide'
    group.append(link)
    document.body.append(group)
    await group.updateComplete

    expect(
      group.shadowRoot?.querySelector('[part="heading"]'),
    ).toHaveTextContent('Resources')
    const content = group.shadowRoot?.querySelector('[part="content"]')
    const mobileToggle = group.shadowRoot?.querySelector('[part="toggle"]')
    if (mobileToggle) expect(content).toHaveAttribute('hidden', '')
    else expect(content).not.toHaveAttribute('hidden')

    const onToggle = vi.fn()
    group.addEventListener('cad-footer-group-toggle', onToggle)
    group.toggle(true)
    await group.updateComplete

    expect(group).toHaveAttribute('open', '')
    expect(content).not.toHaveAttribute('hidden')
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { expanded: true, heading: 'Resources' },
    })
  })

  it('supports the documented visual variants without changing content', async () => {
    const footer = document.createElement('cad-footer')
    footer.innerHTML =
      '<cad-footer-group heading="Legal">Terms</cad-footer-group>'
    document.body.append(footer)
    await footer.updateComplete

    for (const variant of ['light', 'dark', 'elevated', 'minimal'] as const) {
      footer.variant = variant
      await footer.updateComplete
      expect(footer).toHaveAttribute('variant', variant)
      expect(footer.textContent).toContain('Terms')
    }
  })
})
