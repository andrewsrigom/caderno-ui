import { afterEach, describe, expect, it } from 'vitest'

import '../src/textarea/cad-textarea.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-textarea', () => {
  it('participates in native form data and preserves its ruled control', async () => {
    expectRegistered('cad-textarea')
    const form = document.createElement('form')
    const element = document.createElement('cad-textarea')
    element.label = 'Notes'
    element.name = 'notes'
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    const control = element.shadowRoot?.querySelector('textarea')
    if (!control) throw new Error('Expected the native textarea')
    control.value = 'Explain the trade-off.'
    control.dispatchEvent(new Event('input', { bubbles: true }))

    expect(new FormData(form).get('notes')).toBe('Explain the trade-off.')
    expect(control.getAttribute('part')).toBe('control')
  })

  it('validates required content and exposes a custom error', async () => {
    const element = document.createElement('cad-textarea')
    element.required = true
    document.body.append(element)
    await element.updateComplete

    expect(element.checkValidity()).toBe(false)
    element.value = 'Ready'
    await element.updateComplete
    expect(element.checkValidity()).toBe(true)

    element.setCustomValidity('Review this answer.')
    expect(element.validationMessage).toBe('Review this answer.')
  })

  it('supports an inline label and exposes its composed field frame', async () => {
    const element = document.createElement('cad-textarea')
    element.label = 'Notes'
    element.layout = 'inline'
    document.body.append(element)
    await element.updateComplete

    expect(element.getAttribute('layout')).toBe('inline')
    expect(element.shadowRoot?.querySelector('[part="field"]')).not.toBeNull()
  })
})
