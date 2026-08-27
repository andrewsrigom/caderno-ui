import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import type { CadBookmarkChangeEvent } from '../src/bookmark/cad-bookmark.js'
import '../src/bookmark/cad-bookmark.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
  localStorage.clear()
})

describe('cad-bookmark', () => {
  it('registers individually and exposes stable defaults and fallback content', async () => {
    expectRegistered('cad-bookmark')
    const bookmark = document.createElement('cad-bookmark')
    const fallback = document.createElement('span')
    fallback.slot = 'fallback'
    fallback.textContent = 'Save before upgrade'
    bookmark.append(fallback)
    document.body.append(bookmark)
    await bookmark.updateComplete

    expect(bookmark.bookmarked).toBe(false)
    expect(bookmark.persist).toBe(false)
    expect(bookmark.label).toBe('Save bookmark')
    expect(bookmark.hasAttribute('bookmarked')).toBe(false)
    expect(
      bookmark.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="fallback"]')
        ?.assignedElements(),
    ).toEqual([fallback])
  })

  it('persists state and emits a bubbling composed change event', async () => {
    const bookmark = document.createElement('cad-bookmark')
    bookmark.bookmarkId = 'web-components'
    bookmark.label = 'Save'
    bookmark.persist = true
    const listener = vi.fn<(event: CadBookmarkChangeEvent) => void>()
    document.body.addEventListener('cad-bookmark-change', listener, {
      once: true,
    })
    document.body.append(bookmark)

    await bookmark.updateComplete
    const button =
      bookmark.shadowRoot?.querySelector<HTMLButtonElement>('button')
    const icon = bookmark.shadowRoot?.querySelector<SVGElement>('.icon svg')
    expect(button).toBeDefined()
    expect(icon).toBeDefined()
    expect(getComputedStyle(icon!).fill).toBe('rgba(0, 0, 0, 0)')
    await userEvent.click(button!)
    await bookmark.updateComplete

    expect(bookmark.bookmarked).toBe(true)
    expect(bookmark.hasAttribute('bookmarked')).toBe(true)
    expect(getComputedStyle(icon!).fill).toBe(getComputedStyle(button!).color)
    expect(localStorage.getItem('caderno-ui:bookmark:web-components')).toBe(
      'true',
    )
    expect(listener).toHaveBeenCalledOnce()
    expect(listener.mock.calls[0]?.[0].bubbles).toBe(true)
    expect(listener.mock.calls[0]?.[0].composed).toBe(true)
    expect(listener.mock.calls[0]?.[0].detail).toEqual({
      active: true,
      id: 'web-components',
    })
  })

  it('restores persisted state and stays functional when storage throws', async () => {
    localStorage.setItem('caderno-ui:bookmark:restored', 'true')
    const restored = document.createElement('cad-bookmark')
    restored.bookmarkId = 'restored'
    restored.persist = true
    document.body.append(restored)
    await restored.updateComplete
    expect(restored.bookmarked).toBe(true)

    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('Storage denied')
      })
    const sessionOnly = document.createElement('cad-bookmark')
    sessionOnly.bookmarkId = 'session-only'
    sessionOnly.persist = true
    document.body.append(sessionOnly)
    await sessionOnly.updateComplete

    await userEvent.click(
      sessionOnly.shadowRoot!.querySelector<HTMLButtonElement>('button')!,
    )
    expect(sessionOnly.bookmarked).toBe(true)
    setItem.mockRestore()
  })
})
