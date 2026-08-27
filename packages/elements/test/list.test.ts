import { afterEach, describe, expect, it } from 'vitest'

import '../src/list/cad-list.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-list', () => {
  it('coordinates bullet items and preserves native links', async () => {
    expectRegistered('cad-list')
    expectRegistered('cad-list-item')
    const list = document.createElement('cad-list')
    list.label = 'Study topics'
    const item = document.createElement('cad-list-item')
    item.href = '/topics/system-design'
    item.textContent = 'System design fundamentals'
    list.append(item)
    document.body.append(list)

    await list.updateComplete
    await item.updateComplete

    expect(
      list.shadowRoot
        ?.querySelector('[role="list"]')
        ?.getAttribute('aria-label'),
    ).toBe('Study topics')
    expect(item.variant).toBe('bullet')
    expect(item.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/topics/system-design',
    )
  })

  it('numbers items and exposes current and disabled states', async () => {
    const list = document.createElement('cad-list')
    list.variant = 'numbered'
    const current = document.createElement('cad-list-item')
    current.current = true
    current.href = '/direction'
    const disabled = document.createElement('cad-list-item')
    disabled.disabled = true
    disabled.href = '/outcome'
    list.append(current, disabled)
    document.body.append(list)

    await list.updateComplete
    await Promise.all([current.updateComplete, disabled.updateComplete])

    expect(current.index).toBe(1)
    expect(disabled.index).toBe(2)
    expect(current.variant).toBe('numbered')
    expect(
      current.shadowRoot?.querySelector('a')?.getAttribute('aria-current'),
    ).toBe('page')
    expect(disabled.shadowRoot?.querySelector('a')).toBeNull()
    expect(
      disabled.shadowRoot
        ?.querySelector('[part="row"]')
        ?.getAttribute('aria-disabled'),
    ).toBe('true')
  })
})
