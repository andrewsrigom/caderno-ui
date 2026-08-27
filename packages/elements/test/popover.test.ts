import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/popover/cad-popover.js'
import { expectRegistered } from './contract.js'

function rect(x: number, y: number, width: number, height: number): DOMRect {
  return {
    bottom: y + height,
    height,
    left: x,
    right: x + width,
    toJSON: () => ({}),
    top: y,
    width,
    x,
    y,
  }
}

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-popover', () => {
  it('connects an external anchor to an accessible top-layer surface', async () => {
    expectRegistered('cad-popover')
    const anchor = document.createElement('button')
    anchor.id = 'context-trigger'
    anchor.textContent = 'What changed?'
    const popover = document.createElement('cad-popover')
    popover.anchor = anchor.id
    popover.heading = 'Release review'
    document.body.append(anchor, popover)
    await popover.updateComplete

    expect(popover.getAttribute('popover')).toBe('auto')
    expect(popover.getAttribute('role')).toBe('dialog')
    expect(popover.getAttribute('aria-modal')).toBe('false')
    expect(popover.getAttribute('aria-label')).toBe('Release review')
    expect(anchor).toHaveAttribute('aria-controls', popover.id)
    expect(anchor).toHaveAttribute('aria-haspopup', 'dialog')
    expect(anchor).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens from the anchor, emits composed events, and restores focus', async () => {
    const anchor = document.createElement('button')
    anchor.id = 'review-trigger'
    anchor.textContent = 'Review'
    const popover = document.createElement('cad-popover')
    popover.anchor = anchor.id
    popover.heading = 'Review contract'
    const action = document.createElement('button')
    action.textContent = 'Read contract'
    action.slot = 'actions'
    popover.append(action)
    document.body.append(anchor, popover)
    await popover.updateComplete

    const onOpen = vi.fn()
    const onClose = vi.fn()
    document.body.addEventListener('cad-popover-open', onOpen)
    document.body.addEventListener('cad-popover-close', onClose)
    anchor.focus()
    anchor.click()
    await popover.updateComplete
    await vi.waitFor(() => expect(document.activeElement).toBe(action))

    expect(popover.open).toBe(true)
    expect(
      popover.matches(':popover-open') ||
        popover.hasAttribute('data-fallback-open'),
    ).toBe(true)
    expect(anchor).toHaveAttribute('aria-expanded', 'true')
    expect(onOpen).toHaveBeenCalledOnce()
    expect(onOpen.mock.calls[0]?.[0]).toMatchObject({
      bubbles: true,
      composed: true,
      detail: {
        anchor: 'review-trigger',
        placement: 'bottom',
        resolvedPlacement: 'bottom',
      },
    })

    popover.hide('api')
    await popover.updateComplete
    expect(popover.open).toBe(false)
    expect(anchor).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(anchor)
    expect(onClose.mock.calls[0]?.[0]).toMatchObject({
      detail: { reason: 'api' },
    })
  })

  it('supports Escape, explicit dismissal, and a non-dismissible surface', async () => {
    const anchor = document.createElement('button')
    anchor.id = 'menu-trigger'
    const popover = document.createElement('cad-popover')
    popover.anchor = anchor.id
    popover.setAttribute('role', 'menu')
    document.body.append(anchor, popover)
    await popover.updateComplete

    anchor.click()
    await popover.updateComplete
    expect(anchor).toHaveAttribute('aria-haspopup', 'menu')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await popover.updateComplete
    expect(popover.open).toBe(false)

    popover.dismissible = false
    popover.show()
    await popover.updateComplete
    expect(
      popover.shadowRoot?.querySelector('[part="close-button"]'),
    ).toBeNull()
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await popover.updateComplete
    expect(popover.open).toBe(false)
  })

  it('flips and shifts a requested placement inside the viewport', async () => {
    const anchor = document.createElement('button')
    anchor.id = 'edge-trigger'
    anchor.getBoundingClientRect = () => rect(8, 6, 80, 32)
    const popover = document.createElement('cad-popover')
    popover.anchor = anchor.id
    popover.placement = 'top-start'
    popover.getBoundingClientRect = () => rect(0, 0, 240, 120)
    document.body.append(anchor, popover)
    await popover.updateComplete

    popover.show()
    await vi.waitFor(() =>
      expect(popover.dataset.resolvedPlacement).toBe('bottom-start'),
    )
    expect(Number.parseFloat(popover.style.left)).toBeGreaterThanOrEqual(12)
    expect(Number.parseFloat(popover.style.top)).toBeGreaterThanOrEqual(12)
    expect(popover).toHaveAttribute('data-positioned')
  })
})
