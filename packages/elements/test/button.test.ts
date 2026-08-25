import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/button/cad-button.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-button', () => {
  it('renders a native button with composable start and end slots', async () => {
    expectRegistered('cad-button')
    const element = document.createElement('cad-button')
    const start = document.createElement('span')
    start.slot = 'start'
    start.textContent = '✓'
    element.append(start, 'Save')
    document.body.append(element)
    await element.updateComplete

    const button = element.shadowRoot?.querySelector('button')
    expect(button?.getAttribute('part')).toBe('base')
    expect(
      element.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot:not([name])')
        ?.assignedNodes()
        .map((node) => node.textContent)
        .join(''),
    ).toContain('Save')
    expect(
      element.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="start"]')
        ?.assignedElements(),
    ).toEqual([start])
    expect(customElements.get('cad-icon')).toBeUndefined()
  })

  it('renders a disabled link without an href or keyboard stop', async () => {
    const element = document.createElement('cad-button')
    element.href = '/guide'
    element.disabled = true
    document.body.append(element)
    await element.updateComplete

    const link = element.shadowRoot?.querySelector('a')
    expect(link?.hasAttribute('href')).toBe(false)
    expect(link?.getAttribute('aria-disabled')).toBe('true')
    expect(link?.getAttribute('tabindex')).toBe('-1')
  })

  it('submits its nearest light-DOM form', async () => {
    const form = document.createElement('form')
    const element = document.createElement('cad-button')
    const submit = vi.fn((event: SubmitEvent) => event.preventDefault())
    element.type = 'submit'
    form.addEventListener('submit', submit)
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    element.shadowRoot?.querySelector('button')?.click()

    expect(submit).toHaveBeenCalledOnce()
  })
})
