import { afterEach, describe, expect, it } from 'vitest'

import '../src/tooltip/cad-tooltip.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-tooltip', () => {
  it('describes its trigger and supports focus and Escape', async () => {
    expectRegistered('cad-tooltip')
    const tooltip = document.createElement('cad-tooltip')
    tooltip.text = 'Review the evidence'
    const trigger = document.createElement('button')
    trigger.textContent = 'Help'
    tooltip.append(trigger)
    document.body.append(tooltip)
    await tooltip.updateComplete

    const bubble = tooltip.shadowRoot?.querySelector('[role="tooltip"]')
    expect(trigger.getAttribute('aria-describedby')).toBe(bubble?.id)

    trigger.focus()
    await tooltip.updateComplete
    expect(tooltip.open).toBe(true)

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        key: 'Escape',
      }),
    )
    await tooltip.updateComplete
    expect(tooltip.open).toBe(false)
  })
})
