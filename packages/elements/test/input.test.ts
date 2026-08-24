import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/input/cad-input.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-input', () => {
  it('participates in native form data and emits a composed input event', async () => {
    expectRegistered('cad-input')
    const form = document.createElement('form')
    const element = document.createElement('cad-input')
    const input = vi.fn()
    element.label = 'Name'
    element.name = 'name'
    form.addEventListener('input', input)
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    const control = element.shadowRoot?.querySelector('input')
    if (!control) throw new Error('Expected the native input')
    control.value = 'Ada'
    control.dispatchEvent(new Event('input', { bubbles: true }))

    expect(element.value).toBe('Ada')
    expect(new FormData(form).get('name')).toBe('Ada')
    expect(input).toHaveBeenCalledOnce()
  })

  it('uses native required validation and restores its initial value', async () => {
    const form = document.createElement('form')
    const element = document.createElement('cad-input')
    element.setAttribute('value', 'draft')
    element.name = 'title'
    element.required = true
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    expect(element.checkValidity()).toBe(true)
    element.value = ''
    await element.updateComplete
    expect(element.checkValidity()).toBe(false)

    form.reset()
    await element.updateComplete
    expect(element.value).toBe('draft')
  })
})
