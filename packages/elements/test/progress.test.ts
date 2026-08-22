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
    progress.label = 'Reading plan'
    progress.max = 8
    progress.value = 12
    document.body.append(progress)
    await progress.updateComplete

    const native = progress.shadowRoot?.querySelector('progress')
    expect(native?.getAttribute('aria-label')).toBe('Reading plan')
    expect(native?.max).toBe(8)
    expect(native?.value).toBe(8)
    expect(
      progress.shadowRoot?.querySelector('[part="value"]')?.textContent,
    ).toBe('100%')
  })

  it('renders an indeterminate state when value is omitted', async () => {
    const progress = document.createElement('cad-progress')
    document.body.append(progress)
    await progress.updateComplete

    const native = progress.shadowRoot?.querySelector('progress')
    expect(native?.hasAttribute('value')).toBe(false)
    expect(
      progress.shadowRoot?.querySelector('[part="value"]')?.textContent,
    ).toBe('In progress')
  })
})
