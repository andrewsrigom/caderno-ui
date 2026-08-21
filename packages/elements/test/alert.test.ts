import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CadDismissEvent } from '../src/alert/cad-alert.js'
import '../src/alert/cad-alert.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-alert', () => {
  it('hides and emits a composed dismiss event', async () => {
    const alert = document.createElement('cad-alert')
    alert.dismissible = true
    alert.variant = 'warning'
    const listener = vi.fn<(event: CadDismissEvent) => void>()
    alert.addEventListener('cad-dismiss', listener)
    document.body.append(alert)

    await alert.updateComplete
    alert.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click()

    expect(alert.hidden).toBe(true)
    expect(listener).toHaveBeenCalledOnce()
    expect(listener.mock.calls[0]?.[0].composed).toBe(true)
    expect(listener.mock.calls[0]?.[0].detail).toEqual({ variant: 'warning' })
  })
})
