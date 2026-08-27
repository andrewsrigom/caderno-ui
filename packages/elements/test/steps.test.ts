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
    expect(first.setSize).toBe(2)
    expect(second.index).toBe(2)
    expect(first.dataset.orientation).toBe('vertical')
    expect(first.hasAttribute('data-last-step')).toBe(false)
    expect(second.hasAttribute('data-last-step')).toBe(true)
    expect(first.shadowRoot?.querySelector('[part="connector"]')).not.toBeNull()
    expect(
      first.shadowRoot
        ?.querySelector('[role="listitem"]')
        ?.getAttribute('aria-posinset'),
    ).toBe('1')
    expect(
      first.shadowRoot
        ?.querySelector('[role="listitem"]')
        ?.getAttribute('aria-setsize'),
    ).toBe('2')
    expect(
      steps.shadowRoot
        ?.querySelector('[role="list"]')
        ?.getAttribute('aria-label'),
    ).toBe('Release sequence')
  })

  it('keeps connector layout synchronized with orientation', async () => {
    const steps = document.createElement('cad-steps')
    steps.getBoundingClientRect = () => ({ width: 1000 }) as DOMRect
    const step = document.createElement('cad-step')
    steps.append(step)
    document.body.append(steps)
    await nextFrame()

    steps.orientation = 'horizontal'
    await steps.updateComplete

    expect(step.dataset.orientation).toBe('horizontal')
    expect(steps.dataset.layout).toBe('horizontal')
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

  it('maps progress states to marker and list-item semantics', async () => {
    const complete = document.createElement('cad-step')
    complete.status = 'complete'
    const current = document.createElement('cad-step')
    current.status = 'current'
    const disabled = document.createElement('cad-step')
    disabled.status = 'disabled'
    document.body.append(complete, current, disabled)
    await Promise.all([
      complete.updateComplete,
      current.updateComplete,
      disabled.updateComplete,
    ])

    expect(
      complete.shadowRoot
        ?.querySelector('[part="marker"]')
        ?.textContent?.trim(),
    ).toBe('✓')
    expect(
      current.shadowRoot
        ?.querySelector('[role="listitem"]')
        ?.getAttribute('aria-current'),
    ).toBe('step')
    expect(
      disabled.shadowRoot?.querySelector('.state-label')?.textContent?.trim(),
    ).toBe('Disabled')
  })
})
