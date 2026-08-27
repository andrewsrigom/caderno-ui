import { afterEach, describe, expect, it } from 'vitest'

import '../src/progress/cad-progress.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-progress', () => {
  it('normalizes determinate values while preserving native progress semantics', async () => {
    expectRegistered('cad-progress')
    const progress = document.createElement('cad-progress')
    progress.label = 'Uploading file'
    progress.max = 8
    progress.showValue = true
    progress.value = 12
    document.body.append(progress)
    await progress.updateComplete

    const native = progress.shadowRoot?.querySelector('progress')
    expect(native?.getAttribute('aria-label')).toBe('Uploading file')
    expect(native?.max).toBe(8)
    expect(native?.value).toBe(8)
    expect(
      progress.shadowRoot?.querySelector('[part="value"]')?.textContent,
    ).toBe('100%')
  })

  it('keeps indeterminate progress native and does not invent a visible value', async () => {
    const progress = document.createElement('cad-progress')
    progress.label = 'Connecting to server'
    document.body.append(progress)
    await progress.updateComplete

    const native = progress.shadowRoot?.querySelector('progress')
    expect(native?.hasAttribute('value')).toBe(false)
    expect(progress.shadowRoot?.querySelector('[part="value"]')).toBeNull()
  })

  it('reflects size and tone and shares a custom count with assistive technology', async () => {
    const progress = document.createElement('cad-progress')
    progress.label = 'Processing items'
    progress.max = 50
    progress.showValue = true
    progress.size = 'sm'
    progress.tone = 'mint'
    progress.value = 34
    progress.valueLabel = '34 of 50'
    document.body.append(progress)
    await progress.updateComplete

    const native = progress.shadowRoot?.querySelector('progress')
    expect(progress.getAttribute('size')).toBe('sm')
    expect(progress.getAttribute('tone')).toBe('mint')
    expect(native?.getAttribute('aria-valuetext')).toBe('34 of 50')
    expect(
      progress.shadowRoot?.querySelector('[part="value"]')?.textContent,
    ).toBe('34 of 50')
  })
})
