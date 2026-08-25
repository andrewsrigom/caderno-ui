import { afterEach, describe, expect, it } from 'vitest'

import '../src/breadcrumb/cad-breadcrumb.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-breadcrumb', () => {
  it('composes linked items and marks the final item as current', async () => {
    expectRegistered('cad-breadcrumb')
    expectRegistered('cad-breadcrumb-item')
    const breadcrumb = document.createElement('cad-breadcrumb')
    breadcrumb.label = 'Documentation path'
    const parent = document.createElement('cad-breadcrumb-item')
    parent.href = '/components'
    parent.textContent = 'Components'
    const current = document.createElement('cad-breadcrumb-item')
    current.textContent = 'Breadcrumb'
    breadcrumb.append(parent, current)
    document.body.append(breadcrumb)
    await breadcrumb.updateComplete
    await current.updateComplete

    expect(
      breadcrumb.shadowRoot?.querySelector('nav')?.getAttribute('aria-label'),
    ).toBe('Documentation path')
    expect(parent.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/components',
    )
    expect(
      current.shadowRoot?.querySelector('[aria-current="page"]'),
    ).not.toBeNull()
  })

  it('propagates the compact presentation to every item', async () => {
    const breadcrumb = document.createElement('cad-breadcrumb')
    breadcrumb.variant = 'compact'
    const parent = document.createElement('cad-breadcrumb-item')
    const current = document.createElement('cad-breadcrumb-item')
    breadcrumb.append(parent, current)
    document.body.append(breadcrumb)

    await breadcrumb.updateComplete
    await parent.updateComplete
    await current.updateComplete

    expect(parent.variant).toBe('compact')
    expect(current.variant).toBe('compact')
    expect(current.current).toBe(true)

    breadcrumb.variant = 'default'
    await breadcrumb.updateComplete
    expect(parent.variant).toBe('default')
    expect(current.variant).toBe('default')
  })
})
