import { afterEach, describe, expect, it } from 'vitest'

import '../src/link/cad-link.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-link', () => {
  it('forwards current-page semantics to the actual link', async () => {
    const element = document.createElement('cad-link')
    element.href = '/current'
    element.setAttribute('aria-current', 'page')
    document.body.append(element)
    await element.updateComplete
    expect(element.shadowRoot?.querySelector('a')).toHaveAttribute(
      'aria-current',
      'page',
    )
    element.current = ''
    await element.updateComplete
    expect(element.shadowRoot?.querySelector('a')).not.toHaveAttribute(
      'aria-current',
    )
  })
  it('renders a native anchor and preserves its label slot', async () => {
    expectRegistered('cad-link')
    const element = document.createElement('cad-link')
    element.href = '/architecture'
    element.textContent = 'Architecture'
    document.body.append(element)
    await element.updateComplete

    const link = element.shadowRoot?.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/architecture')
    expect(link?.getAttribute('part')).toBe('base')
    expect(element.shadowRoot?.querySelector('slot')).not.toBeNull()
  })

  it('adds safe defaults and an indicator for external links', async () => {
    const element = document.createElement('cad-link')
    element.external = true
    element.href = 'https://example.com'
    document.body.append(element)
    await element.updateComplete

    const link = element.shadowRoot?.querySelector('a')
    expect(link?.getAttribute('target')).toBe('_blank')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(
      element.shadowRoot?.querySelector('[part="external"]'),
    ).not.toBeNull()
  })

  it('removes disabled links from navigation and preserves composed visuals', async () => {
    const element = document.createElement('cad-link')
    const end = document.createElement('span')
    end.slot = 'end'
    end.textContent = '→'
    element.disabled = true
    element.href = '/unavailable'
    element.append('Unavailable', end)
    document.body.append(element)
    await element.updateComplete

    const link = element.shadowRoot?.querySelector('a')
    expect(link?.hasAttribute('href')).toBe(false)
    expect(link?.getAttribute('aria-disabled')).toBe('true')
    expect(link?.getAttribute('tabindex')).toBe('-1')
    expect(
      element.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="end"]')
        ?.assignedElements(),
    ).toEqual([end])
  })

  it('forwards the native download attribute', async () => {
    const element = document.createElement('cad-link')
    element.href = '/report.pdf'
    element.setAttribute('download', 'report.pdf')
    document.body.append(element)
    await element.updateComplete

    expect(
      element.shadowRoot?.querySelector('a')?.getAttribute('download'),
    ).toBe('report.pdf')
  })
})
