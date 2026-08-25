import { afterEach, describe, expect, it, vi } from 'vitest'

import { createScrollReveal } from '../src/scroll.js'

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('createScrollReveal', () => {
  it('keeps content visible and exposes cleanup in reduced-motion mode', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (media): MediaQueryList => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
        matches: true,
        media,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    )
    const item = document.createElement('article')
    document.body.append(item)

    const reveal = createScrollReveal(item, { root: document })

    expect(item.style.opacity).toBe('')
    expect(item.style.transform).toBe('')
    expect(() => reveal.refresh()).not.toThrow()
    expect(() => reveal.revert()).not.toThrow()
  })
})
