import { afterEach, describe, expect, it, vi } from 'vitest'

import { createMotionScope } from '../src/index.js'

const matchMedia = (matches: boolean) =>
  vi
    .spyOn(window, 'matchMedia')
    .mockImplementation((media): MediaQueryList => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
      matches,
      media,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }))

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('createMotionScope', () => {
  it('limits selectors to its root and restores animation styles', () => {
    matchMedia(false)
    const root = document.createElement('section')
    const inside = document.createElement('article')
    const outside = document.createElement('article')
    inside.dataset.motionItem = ''
    outside.dataset.motionItem = ''
    root.append(inside)
    document.body.append(root, outside)

    const motion = createMotionScope(root)
    motion.enter('[data-motion-item]', { duration: 1 })

    expect(inside.style.transform).not.toBe('')
    expect(outside.style.transform).toBe('')

    motion.revert()

    expect(inside.style.transform).toBe('')
    expect(inside.style.opacity).toBe('')
  })

  it('applies reduced-motion state changes without spatial movement', () => {
    matchMedia(true)
    const item = document.createElement('article')
    document.body.append(item)
    const motion = createMotionScope(document)

    expect(motion.reducedMotion).toBe(true)
    motion.enter(item)
    expect(item.style.transform).toBe('')

    motion.exit(item)
    expect(item.style.opacity).toBe('0')
    expect(item.style.visibility).toBe('hidden')

    motion.revert()
    expect(item.style.opacity).toBe('')
    expect(item.style.visibility).toBe('')
  })

  it('lets an individual animation be cancelled without leaving inline state', () => {
    matchMedia(false)
    const item = document.createElement('article')
    document.body.append(item)
    const motion = createMotionScope(document)
    const animation = motion.enter(item, { duration: 1 })

    animation.cancel()

    expect(item.style.transform).toBe('')
    expect(item.style.opacity).toBe('')
    motion.revert()
  })
})
