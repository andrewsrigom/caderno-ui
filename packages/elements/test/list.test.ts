import { afterEach, describe, expect, it } from 'vitest'

import '../src/list/cad-list.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-list', () => {
  it('compacts items without changing their bullets or circled numbers', async () => {
    const list = document.createElement('cad-list')
    list.compact = true
    for (const text of [
      'Define the input.',
      'Compare the options.',
      'Record the decision.',
    ]) {
      const item = document.createElement('cad-list-item')
      item.textContent = text
      list.append(item)
    }
    document.body.append(list)
    await list.updateComplete
    const items = [...list.querySelectorAll('cad-list-item')]
    await Promise.all(items.map((item) => item.updateComplete))

    expect(
      getComputedStyle(list.shadowRoot!.querySelector('.list')!).rowGap,
    ).toBe('0px')
    for (const item of items) {
      expect(
        item.shadowRoot?.querySelector('a, button, [tabindex], .arrow'),
      ).toBeNull()
      expect(item.tabIndex).toBe(-1)
      expect(item.shadowRoot?.querySelector('.marker')).not.toBeNull()
      expect(item.shadowRoot?.querySelector('[role="listitem"]')).not.toBeNull()
      const row = item.shadowRoot!.querySelector('.row')!
      expect(getComputedStyle(row).borderTopWidth).toBe('0px')
      expect(getComputedStyle(row).paddingTop).toBe('0px')
      expect(getComputedStyle(row).cursor).not.toBe('pointer')
    }
    expect(list.getBoundingClientRect().height).toBeLessThan(85)
    list.variant = 'numbered'
    await list.updateComplete
    await Promise.all(items.map((item) => item.updateComplete))
    expect(
      items.map((item) =>
        item.shadowRoot!.querySelector('.marker')!.textContent.trim(),
      ),
    ).toEqual(['1', '2', '3'])
    for (const item of items) {
      expect(
        getComputedStyle(item.shadowRoot!.querySelector('.marker')!)
          .borderRadius,
      ).toBe('50%')
      expect(
        getComputedStyle(item.shadowRoot!.querySelector('.row')!)
          .borderTopWidth,
      ).toBe('0px')
    }
  })

  it('preserves the handwritten blue rows, separate borders, and original markers', async () => {
    const list = document.createElement('cad-list')
    list.style.setProperty('--cad-type-control-font', '"List Hand", cursive')
    list.style.setProperty('--cad-link', '#005bac')
    const item = document.createElement('cad-list-item')
    item.textContent = 'Key point'
    list.append(item)
    document.body.append(list)
    await list.updateComplete
    await item.updateComplete
    expect(
      getComputedStyle(item.shadowRoot!.querySelector('.row')!).borderTopStyle,
    ).toBe('dashed')
    const row = item.shadowRoot!.querySelector('.row')!
    expect(getComputedStyle(row).fontFamily).toContain('List Hand')
    expect(getComputedStyle(row).color).toBe('rgb(0, 91, 172)')
    expect(getComputedStyle(row).minHeight).toBe('52px')
    expect(
      parseFloat(
        getComputedStyle(list.shadowRoot!.querySelector('.list')!).rowGap,
      ),
    ).toBeCloseTo(10.4)
    const marker = item.shadowRoot!.querySelector('.marker')!
    expect(marker.textContent?.trim()).toBe('')
    expect(getComputedStyle(marker).borderRadius).toBe('50%')
    expect(getComputedStyle(marker).backgroundColor).toBe('rgb(0, 91, 172)')
    expect(parseFloat(getComputedStyle(marker).width)).toBeCloseTo(8.8)

    list.variant = 'numbered'
    await list.updateComplete
    await item.updateComplete
    expect(marker.textContent?.trim()).toBe('1')
    expect(getComputedStyle(marker).borderTopStyle).toBe('solid')
    expect(getComputedStyle(marker).borderRadius).toBe('50%')
    expect(parseFloat(getComputedStyle(marker).width)).toBeCloseTo(34.4, 1)
    expect(item.shadowRoot?.querySelector('a, .arrow')).toBeNull()
  })

  it('leaves composed links and buttons in control of their own behavior', async () => {
    const item = document.createElement('cad-list-item')
    const link = document.createElement('a')
    link.href = '#notes'
    link.textContent = 'Open notes'
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Save note'
    item.append(link, button)
    document.body.append(item)
    await item.updateComplete
    expect(item.shadowRoot?.querySelector('a, button, .arrow')).toBeNull()
    expect(
      item.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot:not([name])')
        ?.assignedElements(),
    ).toEqual([link, button])
    let calls = 0
    button.addEventListener('click', () => calls++)
    button.click()
    expect(calls).toBe(1)
    link.focus()
    expect(document.activeElement).toBe(link)
    expect(link.getAttribute('href')).toBe('#notes')
  })

  it('accepts the native row control through action without nesting, cloning, or proxy clicks', async () => {
    const item = document.createElement('cad-list-item')
    item.href = '/legacy'
    const link = document.createElement('a')
    link.slot = 'action'
    link.href = '/notes'
    link.textContent = 'Open notes'
    item.append(link)
    document.body.append(item)
    await item.updateComplete
    expect(item.shadowRoot?.querySelector('a, button')).toBeNull()
    expect(
      item.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="action"]')
        ?.assignedElements(),
    ).toEqual([link])
    expect(
      item.shadowRoot?.querySelector('.arrow')?.getAttribute('aria-hidden'),
    ).toBe('true')
    expect(item.shadowRoot?.querySelector('.row.has-action')).not.toBeNull()
    link.focus()
    expect(document.activeElement).toBe(link)

    const button = document.createElement('button')
    button.type = 'button'
    button.slot = 'action'
    button.textContent = 'Save note'
    let calls = 0
    button.addEventListener('click', () => calls++)
    link.replaceWith(button)
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await item.updateComplete
    button.click()
    expect(calls).toBe(1)
    button.disabled = true
    button.click()
    expect(calls).toBe(1)
    item.href = ''
    button.remove()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await item.updateComplete
    expect(item.shadowRoot?.querySelector('.arrow, a, button')).toBeNull()
  })

  it('renumbers inserted and reordered items without affecting nested lists', async () => {
    const list = document.createElement('cad-list')
    list.variant = 'numbered'
    const first = document.createElement('cad-list-item')
    const second = document.createElement('cad-list-item')
    const nested = document.createElement('cad-list')
    const nestedItem = document.createElement('cad-list-item')
    nested.append(nestedItem)
    first.append(nested)
    list.append(first, second)
    document.body.append(list)
    await list.updateComplete
    await Promise.all([
      first.updateComplete,
      second.updateComplete,
      nested.updateComplete,
    ])
    expect(first.index).toBe(1)
    expect(second.index).toBe(2)
    expect(nestedItem.variant).toBe('bullet')
    list.prepend(second)
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await Promise.all([first.updateComplete, second.updateComplete])
    expect(second.index).toBe(1)
    expect(first.index).toBe(2)
    expect(
      first.shadowRoot?.querySelector('.marker')?.textContent?.trim(),
    ).toBe('2')
  })

  it('delegates programmatic focus to an enabled native link', async () => {
    const item = document.createElement('cad-list-item')
    item.href = '#result'
    item.textContent = 'Search result'
    document.body.append(item)
    await item.updateComplete
    item.focus()
    expect(item.shadowRoot?.activeElement).toBe(
      item.shadowRoot?.querySelector('a'),
    )
  })

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
    expect(item.shadowRoot?.querySelector('.arrow')).not.toBeNull()
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
