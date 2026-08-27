import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import type { CadDismissEvent } from '../src/alert/cad-alert.js'
import '../src/alert/cad-alert.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-alert', () => {
  it('registers individually and exposes stable defaults, reflection, and slots', async () => {
    expectRegistered('cad-alert')

    const alert = document.createElement('cad-alert')
    const title = document.createElement('span')
    title.slot = 'title'
    title.textContent = 'Slotted title'
    alert.append(title, 'Slotted body')
    document.body.append(alert)
    await alert.updateComplete

    expect(alert.dismissible).toBe(false)
    expect(alert.dismissLabel).toBe('Dismiss alert')
    expect(alert.heading).toBe('')
    expect(alert.size).toBe('default')
    expect(alert.variant).toBe('info')
    expect(alert.getAttribute('variant')).toBe('info')
    expect(
      alert.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="title"]')
        ?.assignedElements(),
    ).toEqual([title])
  })

  it('renders an action slot and assertive error semantics', async () => {
    const alert = document.createElement('cad-alert')
    const action = document.createElement('button')
    action.slot = 'action'
    action.textContent = 'Try again'
    alert.append('The operation failed.', action)
    alert.variant = 'error'
    document.body.append(alert)
    await alert.updateComplete

    expect(
      alert.shadowRoot?.querySelector('[part="base"]')?.getAttribute('role'),
    ).toBe('alert')
    expect(
      alert.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="action"]')
        ?.assignedElements(),
    ).toEqual([action])
  })

  it('hides and emits a bubbling composed dismiss event', async () => {
    const alert = document.createElement('cad-alert')
    alert.dismissible = true
    alert.variant = 'warning'
    const listener = vi.fn<(event: CadDismissEvent) => void>()
    document.body.addEventListener('cad-dismiss', listener, { once: true })
    document.body.append(alert)

    await alert.updateComplete
    const button = alert.shadowRoot?.querySelector<HTMLButtonElement>('button')
    expect(button).toBeDefined()
    await userEvent.click(button!)

    expect(alert.hidden).toBe(true)
    expect(listener).toHaveBeenCalledOnce()
    expect(listener.mock.calls[0]?.[0].bubbles).toBe(true)
    expect(listener.mock.calls[0]?.[0].composed).toBe(true)
    expect(listener.mock.calls[0]?.[0].detail).toEqual({ variant: 'warning' })
  })
})
