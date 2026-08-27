import { afterEach, describe, expect, it, vi } from 'vitest'

import { toast, type CadToastHost } from '../src/toast/cad-toast.js'
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
    expect(toast.description).toBe('<strong>Plain text</strong>')
    expect(
      toast.shadowRoot?.querySelector('[part="content"]'),
    ).toHaveTextContent('<strong>Plain text</strong>')
    expect(toast.querySelector('strong')).toBeNull()
  })

  it('creates a host automatically and updates a loading toast by id', async () => {
    const id = toast.loading('Publishing review...', { hostId: 'test-toaster' })
    const host = document.querySelector<CadToastHost>('#test-toaster')
    const item = toast.getActive({ hostId: 'test-toaster' })[0]
    await item?.updateComplete

    expect(host).not.toBeNull()
    expect(item).toMatchObject({
      duration: Infinity,
      heading: 'Publishing review...',
      variant: 'loading',
    })

    toast.success('Review published.', {
      description: 'The public contract is available.',
      hostId: 'test-toaster',
      id,
    })
    await item?.updateComplete

    expect(toast.getActive({ hostId: 'test-toaster' })).toEqual([item])
    expect(item).toMatchObject({
      description: 'The public contract is available.',
      duration: host?.duration,
      heading: 'Review published.',
      variant: 'success',
    })
  })

  it('transitions promise feedback from loading to a resolved result', async () => {
    const id = toast.promise(Promise.resolve({ version: 'v0.4' }), {
      error: 'Publishing failed.',
      hostId: 'promise-toaster',
      loading: 'Publishing review...',
      success: ({ version }) => `${version} published.`,
      successDescription: 'The public contract is now available.',
    })

    await vi.waitFor(() => {
      expect(toast.getActive({ hostId: 'promise-toaster' })[0]).toMatchObject({
        description: 'The public contract is now available.',
        heading: 'v0.4 published.',
        toastId: id,
        variant: 'success',
      })
    })
  })

  it('runs an action and reports action dismissal', async () => {
    const onAction = vi.fn()
    const onDismiss = vi.fn()
    toast.accent('Draft saved.', {
      action: { label: 'View draft', onClick: onAction },
      duration: 0,
      hostId: 'action-toaster',
      onDismiss,
    })
    const item = toast.getActive({ hostId: 'action-toaster' })[0]
    await item?.updateComplete

    item?.shadowRoot?.querySelector<HTMLButtonElement>('.action')?.click()
    await item?.updateComplete

    expect(onAction).toHaveBeenCalledOnce()
    expect(onDismiss).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'action', variant: 'accent' }),
    )
    expect(toast.getActive({ hostId: 'action-toaster' })).toHaveLength(0)
  })

  it('limits the visible stack and can dismiss the complete host', () => {
    const host = document.createElement('cad-toast-host')
    host.id = 'limited-toaster'
    host.maxVisible = 2
    document.body.append(host)

    toast.info('First', { duration: 0, hostId: host.id })
    toast.info('Second', { duration: 0, hostId: host.id })
    toast.info('Third', { duration: 0, hostId: host.id })

    expect(host.activeToasts.map((item) => item.heading)).toEqual([
      'Third',
      'Second',
    ])
    expect(toast.dismiss(undefined, { hostId: host.id })).toBe(2)
    expect(host.activeToasts).toHaveLength(0)
  })

  it('pauses the remaining timeout while hovered', async () => {
    vi.useFakeTimers()
    toast.info('Still working...', {
      duration: 1000,
      hostId: 'timed-toaster',
    })
    const item = toast.getActive({ hostId: 'timed-toaster' })[0]
    await item?.updateComplete
    const surface = item?.shadowRoot?.querySelector('[part="base"]')

    surface?.dispatchEvent(new PointerEvent('pointerenter'))
    await vi.advanceTimersByTimeAsync(1500)
    expect(item?.open).toBe(true)

    surface?.dispatchEvent(new PointerEvent('pointerleave'))
    await vi.advanceTimersByTimeAsync(1000)
    expect(item?.open).toBe(false)
  })
})
