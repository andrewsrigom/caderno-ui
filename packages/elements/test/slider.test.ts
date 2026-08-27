import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/slider/cad-slider.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-slider', () => {
  it('exposes a native range control with a separate label and hint', async () => {
    expectRegistered('cad-slider')
    const element = document.createElement('cad-slider')
    element.label = 'Review depth'
    element.hint = 'Choose how detailed the review should be.'
    element.ticks = '0,25,50,75,100'
    element.showValue = true
    element.value = 64
    document.body.append(element)
    await element.updateComplete

    const control = element.shadowRoot?.querySelector('input')
    const label = element.shadowRoot?.querySelector('[part="label"]')
    const hint = element.shadowRoot?.querySelector('[part="hint"]')
    expect(control?.type).toBe('range')
    expect(control?.getAttribute('aria-labelledby')).toBe(label?.id)
    expect(control?.getAttribute('aria-describedby')).toBe(hint?.id)
    expect(control?.getAttribute('aria-valuetext')).toBe('64')
    expect(element.shadowRoot?.querySelectorAll('[part="tick"]')).toHaveLength(
      5,
    )
    expect(
      element.shadowRoot?.querySelector('[part="value"]')?.textContent,
    ).toContain('64')
  })

  it('submits a value, emits composed events, and restores its default', async () => {
    const form = document.createElement('form')
    const element = document.createElement('cad-slider')
    const onChange = vi.fn()
    const onInput = vi.fn()
    element.label = 'Review depth'
    element.name = 'depth'
    element.value = 64
    element.addEventListener('cad-slider-change', onChange)
    element.addEventListener('cad-slider-input', onInput)
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    expect(new FormData(form).get('depth')).toBe('64')
    const control = element.shadowRoot?.querySelector<HTMLInputElement>('input')
    expect(control).toBeTruthy()
    if (!control) return
    control.value = '72'
    control.dispatchEvent(new Event('input', { bubbles: true }))
    control.dispatchEvent(new Event('change', { bubbles: true }))
    await element.updateComplete
    expect(element.value).toBe(72)
    expect(new FormData(form).get('depth')).toBe('72')
    expect(onInput).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledOnce()

    form.reset()
    await element.updateComplete
    expect(element.value).toBe(64)
  })

  it('supports an ordered two-thumb range and submits both values', async () => {
    const form = document.createElement('form')
    const element = document.createElement('cad-slider')
    element.endValue = 80
    element.label = 'Price range'
    element.name = 'price'
    element.range = true
    element.value = 20
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    const controls = element.shadowRoot?.querySelectorAll('input')
    expect(controls).toHaveLength(2)
    expect(controls?.[0]?.getAttribute('aria-label')).toBe(
      'Price range minimum',
    )
    expect(controls?.[1]?.getAttribute('aria-label')).toBe(
      'Price range maximum',
    )
    expect(new FormData(form).getAll('price')).toEqual(['20', '80'])

    const start = controls?.[0]
    if (!start) return
    start.value = '90'
    start.dispatchEvent(new Event('input', { bubbles: true }))
    await element.updateComplete
    expect(element.value).toBe(80)
    expect(element.endValue).toBe(80)
  })

  it('removes disabled values from form data', async () => {
    const form = document.createElement('form')
    const element = document.createElement('cad-slider')
    element.disabled = true
    element.label = 'Volume'
    element.name = 'volume'
    form.append(element)
    document.body.append(form)
    await element.updateComplete

    expect(new FormData(form).has('volume')).toBe(false)
    expect(element.willValidate).toBe(false)
  })
})
