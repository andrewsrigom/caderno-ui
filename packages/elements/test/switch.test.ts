import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/switch/cad-switch.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-switch', () => {
  it('exposes native switch semantics with separate label and hint', async () => {
    expectRegistered('cad-switch')
    const element = document.createElement('cad-switch')
    element.label = 'Auto-save'
    element.hint = 'Save changes while you work.'
    document.body.append(element)
    await element.updateComplete

    const control = element.shadowRoot?.querySelector('input')
    const label = element.shadowRoot?.querySelector('[part="label"]')
    const hint = element.shadowRoot?.querySelector('[part="hint"]')
    expect(control?.getAttribute('role')).toBe('switch')
    expect(control?.getAttribute('aria-labelledby')).toBe(label?.id)
    expect(control?.getAttribute('aria-describedby')).toBe(hint?.id)
    expect(label?.textContent).toContain('Auto-save')
    expect(hint?.textContent).toContain('Save changes while you work.')
  })

  it('submits only while checked, emits native events, and resets', async () => {
    const form = document.createElement('form')
    const element = document.createElement('cad-switch')
    const onChange = vi.fn()
    const onInput = vi.fn()
    element.setAttribute('checked', '')
    element.label = 'Email notifications'
    element.name = 'notifications'
    element.value = 'enabled'
    element.addEventListener('change', onChange)
    element.addEventListener('input', onInput)
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    expect(new FormData(form).get('notifications')).toBe('enabled')
    element.click()
    await element.updateComplete
    expect(element.checked).toBe(false)
    expect(new FormData(form).has('notifications')).toBe(false)
    expect(onInput).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledOnce()

    form.reset()
    await element.updateComplete
    expect(element.checked).toBe(true)
  })

  it('uses native required validity and respects disabled state', async () => {
    const element = document.createElement('cad-switch')
    element.label = 'Publish automatically'
    element.required = true
    document.body.append(element)
    await element.updateComplete

    expect(element.checkValidity()).toBe(false)
    element.disabled = true
    await element.updateComplete
    element.click()
    expect(element.checked).toBe(false)
    expect(element.willValidate).toBe(false)
  })
})
