import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/drawer/cad-drawer.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
  document.documentElement.style.overflow = ''
})

describe('cad-drawer', () => {
  it('opens a native modal drawer from its trigger and restores focus', async () => {
    expectRegistered('cad-drawer')
    const drawer = document.createElement('cad-drawer')
    drawer.heading = 'Task details'
    const trigger = document.createElement('button')
    trigger.slot = 'trigger'
    trigger.textContent = 'Open task details'
    drawer.append(trigger, document.createTextNode('Review the Q3 roadmap.'))
    document.body.append(drawer)
    await drawer.updateComplete

    const onOpen = vi.fn()
    const onClose = vi.fn()
    document.body.addEventListener('cad-drawer-open', onOpen)
    document.body.addEventListener('cad-drawer-close', onClose)

    trigger.focus()
    trigger.click()
    await drawer.updateComplete

    expect(drawer.open).toBe(true)
    expect(drawer.dialog?.open).toBe(true)
    expect(drawer.dialog?.tagName).toBe('DIALOG')
    expect(drawer.dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(drawer.shadowRoot?.activeElement).toHaveClass('title')
    expect(onOpen).toHaveBeenCalledOnce()
    expect(onOpen.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: { placement: 'right', size: 'md' },
    })

    const closed = new Promise((resolve) =>
      drawer.addEventListener('cad-drawer-close', resolve, { once: true }),
    )
    drawer.close('close-button')
    await closed
    await drawer.updateComplete

    expect(drawer.open).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
    expect(onClose.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: {
        placement: 'right',
        reason: 'close-button',
        size: 'md',
      },
    })
    expect(document.activeElement).toBe(trigger)
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('keeps title semantics and content composition owned by the consumer', async () => {
    const drawer = document.createElement('cad-drawer')
    drawer.placement = 'bottom'
    drawer.size = 'lg'
    const title = document.createElement('h2')
    title.slot = 'title'
    title.textContent = 'Edit project'
    const footer = document.createElement('button')
    footer.slot = 'footer'
    footer.textContent = 'Save project'
    drawer.append(title, document.createTextNode('Project fields'), footer)
    document.body.append(drawer)
    await drawer.updateComplete

    expect(drawer.querySelector('h2[slot="title"]')).toBe(title)
    expect(drawer).toHaveAttribute('placement', 'bottom')
    expect(drawer).toHaveAttribute('size', 'lg')
    expect(drawer.dialog?.getAttribute('aria-labelledby')).toBe('drawer-title')
    expect(drawer.shadowRoot?.querySelector('[part="handle"]')).not.toBeNull()
    await vi.waitFor(() =>
      expect(
        drawer.shadowRoot?.querySelector('[part="footer"]'),
      ).not.toHaveAttribute('hidden'),
    )
  })

  it('treats backdrop dismissal as an explicit policy', async () => {
    const drawer = document.createElement('cad-drawer')
    drawer.heading = 'Filters'
    drawer.closeOnBackdrop = false
    document.body.append(drawer)
    await drawer.updateComplete
    drawer.show()
    await drawer.updateComplete

    drawer.dialog?.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, composed: true }),
    )
    await drawer.updateComplete
    expect(drawer.open).toBe(true)

    drawer.closeOnBackdrop = true
    drawer.dialog?.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, composed: true }),
    )
    await drawer.updateComplete
    expect(drawer.open).toBe(false)
  })

  it('closes on Escape and reports the close reason', async () => {
    const drawer = document.createElement('cad-drawer')
    drawer.heading = 'Activity'
    document.body.append(drawer)
    await drawer.updateComplete
    drawer.show()
    await drawer.updateComplete

    const onClose = vi.fn()
    drawer.addEventListener('cad-drawer-close', onClose)
    const closed = new Promise((resolve) =>
      drawer.addEventListener('cad-drawer-close', resolve, { once: true }),
    )
    drawer.dialog?.dispatchEvent(new Event('cancel', { cancelable: true }))
    await closed
    await drawer.updateComplete

    expect(drawer.open).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
    expect(onClose.mock.calls[0]?.[0]).toMatchObject({
      detail: { reason: 'escape' },
    })
  })
})
