import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/header/cad-header.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-header', () => {
  it('does not allocate an empty navigation region or menu', async () => {
    const header = document.createElement('cad-header')
    header.innerHTML =
      '<a slot="brand" href="/">Home</a><button slot="actions">Theme</button>'
    document.body.append(header)
    await header.updateComplete
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await header.updateComplete
    expect(
      header.shadowRoot?.querySelector('[part="navigation"]'),
    ).toHaveAttribute('hidden')
    expect(
      header.shadowRoot?.querySelector('[part="menu-toggle"]'),
    ).toHaveAttribute('hidden')
    const link = document.createElement('a')
    link.href = '/guide'
    link.textContent = 'Guide'
    header.append(link)
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await header.updateComplete
    expect(
      header.shadowRoot?.querySelector('[part="navigation"]'),
    ).not.toHaveAttribute('hidden')
  })
  it('renders a named banner with composable product regions', async () => {
    expectRegistered('cad-header')
    const header = document.createElement('cad-header')
    header.label = 'Caderno UI header'
    header.navigationLabel = 'Documentation'
    header.variant = 'bold'

    const brand = document.createElement('a')
    brand.slot = 'brand'
    brand.href = '/'
    brand.textContent = 'Caderno UI'
    const link = document.createElement('a')
    link.href = '/components'
    link.textContent = 'Components'
    const action = document.createElement('button')
    action.slot = 'actions'
    action.textContent = 'Notifications'
    header.append(brand, link, action)
    document.body.append(header)

    await header.updateComplete
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await header.updateComplete

    expect(header).toHaveAttribute('variant', 'bold')
    expect(header.shadowRoot?.querySelector('header')).toHaveAttribute(
      'aria-label',
      'Caderno UI header',
    )
    expect(
      header.shadowRoot?.querySelector('[part="navigation"]'),
    ).toHaveAttribute('aria-label', 'Documentation')
    expect(
      header.shadowRoot?.querySelector('[part="brand"]'),
    ).not.toHaveAttribute('hidden')
    expect(
      header.shadowRoot?.querySelector('[part="actions"]'),
    ).not.toHaveAttribute('hidden')
  })

  it('exposes an explicit menu contract and composed toggle event', async () => {
    const header = document.createElement('cad-header')
    header.innerHTML = '<a href="/guide">Guide</a>'
    document.body.append(header)
    await header.updateComplete

    const onToggle = vi.fn()
    header.addEventListener('cad-header-menu-toggle', onToggle)
    header.toggle(true)
    await header.updateComplete

    expect(header).toHaveAttribute('open', '')
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { expanded: true },
    })

    header.toggle(false)
    await header.updateComplete
    expect(header).not.toHaveAttribute('open')
  })

  it('supports every visual variant without changing navigation content', async () => {
    const header = document.createElement('cad-header')
    header.innerHTML = '<a href="/components">Components</a>'
    document.body.append(header)
    await header.updateComplete

    for (const variant of [
      'bold',
      'elevated',
      'glass',
      'minimal',
      'surface',
    ] as const) {
      header.variant = variant
      await header.updateComplete
      expect(header).toHaveAttribute('variant', variant)
      expect(header.textContent).toContain('Components')
    }
  })
})
