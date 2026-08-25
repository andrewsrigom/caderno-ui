import { afterEach, describe, expect, it } from 'vitest'

import '../src/steps/cad-steps.js'
import { expectRegistered, nextFrame } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-steps', () => {
  it('numbers composed steps and exposes list semantics', async () => {
    expectRegistered('cad-steps')
    expectRegistered('cad-step')
    const steps = document.createElement('cad-steps')
    steps.label = 'Release sequence'
    const first = document.createElement('cad-step')
    const second = document.createElement('cad-step')
    steps.append(first, second)
    document.body.append(steps)
    await nextFrame()

    expect(first.index).toBe(1)
    expect(second.index).toBe(2)
    expect(first.dataset.orientation).toBe('vertical')
    expect(first.hasAttribute('data-last-step')).toBe(false)
    expect(second.hasAttribute('data-last-step')).toBe(true)
    expect(first.shadowRoot?.querySelector('[part="connector"]')).not.toBeNull()
    expect(
      steps.shadowRoot
        ?.querySelector('[role="list"]')
        ?.getAttribute('aria-label'),
    ).toBe('Release sequence')
  })

  it('keeps connector layout synchronized with orientation', async () => {
    const steps = document.createElement('cad-steps')
    const step = document.createElement('cad-step')
    steps.append(step)
    document.body.append(steps)
    await nextFrame()

    steps.orientation = 'horizontal'
    await steps.updateComplete

    expect(step.dataset.orientation).toBe('horizontal')
  })

  it('preserves an explicit marker value', async () => {
    const step = document.createElement('cad-step')
    step.value = 'QA'
    document.body.append(step)
    await step.updateComplete
    expect(
      step.shadowRoot?.querySelector('[part="marker"]')?.textContent?.trim(),
    ).toBe('QA')
  })
})
