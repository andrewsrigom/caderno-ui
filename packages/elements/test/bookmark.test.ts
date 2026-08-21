import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CadBookmarkChangeEvent } from '../src/bookmark/cad-bookmark.js'
import '../src/bookmark/cad-bookmark.js'

afterEach(() => {
  document.body.replaceChildren()
  localStorage.clear()
})

describe('cad-bookmark', () => {
  it('persists state and emits a composed change event', async () => {
    const bookmark = document.createElement('cad-bookmark')
    bookmark.bookmarkId = 'web-components'
    bookmark.label = 'Save'
    bookmark.persist = true
    const listener = vi.fn<(event: CadBookmarkChangeEvent) => void>()
    bookmark.addEventListener('cad-bookmark-change', listener)
    document.body.append(bookmark)

    await bookmark.updateComplete
    bookmark.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click()
    await bookmark.updateComplete

    expect(bookmark.bookmarked).toBe(true)
    expect(bookmark.hasAttribute('bookmarked')).toBe(true)
    expect(localStorage.getItem('caderno-ui:bookmark:web-components')).toBe(
      'true',
    )
    expect(listener).toHaveBeenCalledOnce()
    expect(listener.mock.calls[0]?.[0].composed).toBe(true)
    expect(listener.mock.calls[0]?.[0].detail).toEqual({
      active: true,
      id: 'web-components',
    })
  })
})
