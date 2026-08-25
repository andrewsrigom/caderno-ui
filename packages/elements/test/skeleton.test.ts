import { afterEach, describe, expect, it } from 'vitest'

import '../src/skeleton/cad-skeleton.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-skeleton', () => {
  it('registers individually with decorative text defaults', async () => {
    expectRegistered('cad-skeleton')
    const skeleton = document.createElement('cad-skeleton')
    document.body.append(skeleton)
    await skeleton.updateComplete

    expect(skeleton.getAttribute('animation')).toBe('pulse')
    expect(skeleton.getAttribute('lines')).toBe('1')
    expect(skeleton.getAttribute('shape')).toBe('text')
    expect(
      skeleton.shadowRoot
        ?.querySelector('[part="base"]')
        ?.getAttribute('aria-hidden'),
    ).toBe('true')
    expect(skeleton.shadowRoot?.querySelectorAll('[part="item"]')).toHaveLength(
      1,
    )
    expect(customElements.get('cad-icon')).toBeUndefined()
  })

  it('renders repeated text lines and marks the final line', async () => {
    const skeleton = document.createElement('cad-skeleton')
    skeleton.lines = 4
    document.body.append(skeleton)
    await skeleton.updateComplete

    const items = skeleton.shadowRoot?.querySelectorAll('[part="item"]') ?? []
    expect(items).toHaveLength(4)
    expect(items[3]?.classList.contains('last')).toBe(true)
  })

  it('renders one item for non-text shapes and updates dynamically', async () => {
    const skeleton = document.createElement('cad-skeleton')
    skeleton.lines = 4
    skeleton.shape = 'circle'
    skeleton.animation = 'wave'
    document.body.append(skeleton)
    await skeleton.updateComplete

    expect(skeleton.getAttribute('animation')).toBe('wave')
    expect(skeleton.getAttribute('shape')).toBe('circle')
    expect(skeleton.shadowRoot?.querySelectorAll('[part="item"]')).toHaveLength(
      1,
    )

    skeleton.shape = 'text'
    await skeleton.updateComplete
    expect(skeleton.shadowRoot?.querySelectorAll('[part="item"]')).toHaveLength(
      4,
    )
  })

  it('normalizes invalid line counts and caps rendered output', async () => {
    const skeleton = document.createElement('cad-skeleton')
    skeleton.lines = Number.NaN
    document.body.append(skeleton)
    await skeleton.updateComplete
    expect(skeleton.shadowRoot?.querySelectorAll('[part="item"]')).toHaveLength(
      1,
    )

    skeleton.lines = 4.8
    await skeleton.updateComplete
    expect(skeleton.shadowRoot?.querySelectorAll('[part="item"]')).toHaveLength(
      4,
    )

    skeleton.lines = 100
    await skeleton.updateComplete
    expect(skeleton.shadowRoot?.querySelectorAll('[part="item"]')).toHaveLength(
      20,
    )
  })
})
