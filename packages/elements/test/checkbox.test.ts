import { afterEach, describe, expect, it } from 'vitest'

import '../src/checkbox/cad-checkbox.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-checkbox', () => {
  it('submits only while checked and restores its default state', async () => {
    expectRegistered('cad-checkbox')
    const form = document.createElement('form')
    const element = document.createElement('cad-checkbox')
    element.setAttribute('checked', '')
    element.label = 'Reviewed'
    element.name = 'reviewed'
    element.value = 'yes'
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    expect(new FormData(form).get('reviewed')).toBe('yes')
    element.click()
    await element.updateComplete
    expect(element.checked).toBe(false)
    expect(new FormData(form).has('reviewed')).toBe(false)

    form.reset()
    await element.updateComplete
    expect(element.checked).toBe(true)
  })

  it('uses native required validity and exposes its label', async () => {
    const element = document.createElement('cad-checkbox')
    element.label = 'Accept contract'
    element.required = true
    document.body.append(element)
    await element.updateComplete

    expect(element.checkValidity()).toBe(false)
    expect(element.shadowRoot?.querySelector('label')?.textContent).toContain(
      'Accept contract',
    )
  })
})
