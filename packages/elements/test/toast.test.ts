import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/toast/cad-toast.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
  vi.useRealTimers()
})

describe('cad-toast', () => {
  it('dismisses manually with a composed reason event', async () => {
    expectRegistered('cad-toast')
    expectRegistered('cad-toast-host')
    const toast = document.createElement('cad-toast')
    toast.heading = 'Saved'
    toast.variant = 'success'
    toast.textContent = 'The review is available.'
    document.body.append(toast)
    await toast.updateComplete

    const onDismiss = vi.fn()
    document.body.addEventListener('cad-toast-dismiss', onDismiss)
    toast.shadowRoot?.querySelector('button')?.click()
    await toast.updateComplete

    expect(toast.open).toBe(false)
    expect(onDismiss.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { reason: 'manual', variant: 'success' },
    })
  })

  it('lets a host create a text-safe timed notification', async () => {
    const host = document.createElement('cad-toast-host')
    document.body.append(host)
    const toast = host.show({
      duration: 0,
      heading: 'Published',
      message: '<strong>Plain text</strong>',
      variant: 'info',
    })
    await toast.updateComplete

    expect(host.querySelector('cad-toast')).toBe(toast)
    expect(toast.textContent).toBe('<strong>Plain text</strong>')
    expect(toast.querySelector('strong')).toBeNull()
  })
})
