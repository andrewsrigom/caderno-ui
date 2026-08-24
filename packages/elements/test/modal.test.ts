import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/modal/cad-modal.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-modal', () => {
  it('uses native dialog behavior and emits a composed close event', async () => {
    expectRegistered('cad-modal')
    const modal = document.createElement('cad-modal')
    modal.heading = 'Review contract'
    const trigger = document.createElement('button')
    trigger.slot = 'trigger'
    trigger.textContent = 'Open review'
    modal.append(trigger, document.createTextNode('Dialog content'))
    document.body.append(modal)
    await modal.updateComplete

    const onClose = vi.fn()
    document.body.addEventListener('cad-modal-close', onClose)
    trigger.focus()
    trigger.click()
    await modal.updateComplete

    expect(modal.open).toBe(true)
    expect(modal.dialog?.open).toBe(true)

    const closed = new Promise((resolve) =>
      modal.addEventListener('cad-modal-close', resolve, { once: true }),
    )
    modal.close('accepted')
    await closed
    await modal.updateComplete
    expect(modal.open).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
    expect(onClose.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { returnValue: 'accepted' },
    })
    expect(document.activeElement).toBe(trigger)
  })
})
