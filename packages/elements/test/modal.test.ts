import { afterEach, describe, expect, it, vi } from 'vitest'

import '../src/modal/cad-modal.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
  document.documentElement.style.overflow = ''
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
    expect(document.documentElement.style.overflow).toBe('hidden')

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
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('preserves application-owned title heading semantics', async () => {
    const modal = document.createElement('cad-modal')
    const title = document.createElement('h3')
    title.slot = 'title'
    title.textContent = 'Review contract'
    modal.append(title)
    document.body.append(modal)
    await modal.updateComplete

    expect(modal.querySelector('h3[slot="title"]')).toBe(title)
    expect(modal.shadowRoot?.querySelector('.title')?.localName).toBe('div')
    expect(modal.dialog?.getAttribute('aria-labelledby')).toBe('modal-title')
  })

  it('adds destructive semantics without coupling the body or actions', async () => {
    const modal = document.createElement('cad-modal')
    modal.heading = 'Delete this item?'
    modal.tone = 'danger'
    modal.textContent = 'This action cannot be undone.'
    document.body.append(modal)
    await modal.updateComplete

    expect(modal.shadowRoot?.querySelector('[part="icon"]')).not.toBeNull()
    expect(modal.shadowRoot?.querySelector('[part="title"]')).toHaveTextContent(
      'Delete this item?',
    )
    expect(modal.textContent).toBe('This action cannot be undone.')
  })

  it('respects backdrop dismissal as an explicit policy', async () => {
    const modal = document.createElement('cad-modal')
    modal.heading = 'Keep editing?'
    modal.closeOnBackdrop = false
    document.body.append(modal)
    await modal.updateComplete
    modal.showModal()
    await modal.updateComplete

    modal.dialog?.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, composed: true }),
    )
    await modal.updateComplete
    expect(modal.open).toBe(true)

    modal.closeOnBackdrop = true
    modal.dialog?.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, composed: true }),
    )
    await modal.updateComplete
    expect(modal.open).toBe(false)
  })

  it('guarantees Escape dismissal from focused modal content', async () => {
    const modal = document.createElement('cad-modal')
    modal.heading = 'Review contract'
    document.body.append(modal)
    await modal.updateComplete
    modal.showModal()
    await modal.updateComplete

    modal.shadowRoot?.querySelector('.title')?.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        key: 'Escape',
      }),
    )
    await modal.updateComplete

    expect(modal.open).toBe(false)
    expect(document.documentElement.style.overflow).toBe('')
  })
})
