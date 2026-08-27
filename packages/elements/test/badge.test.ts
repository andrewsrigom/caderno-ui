import { afterEach, describe, expect, it } from 'vitest'

import '../src/badge/cad-badge.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-badge', () => {
  it('renders a compact annotation without a button frame or interactive semantics', async () => {
    const badge = document.createElement('cad-badge')
    badge.textContent = 'Ready'
    document.body.append(badge)
    await badge.updateComplete
    const base = badge.shadowRoot!.querySelector('[part="base"]')!
    const style = getComputedStyle(base)
    expect(style.borderWidth).toBe('0px')
    expect(style.borderRadius).toBe('0px')
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(style.boxShadow).toBe('none')
    expect(style.transform).toBe('none')
    expect(base.getBoundingClientRect().height).toBeLessThan(28)
    expect(badge.tabIndex).toBe(-1)
    expect(
      badge.shadowRoot!.querySelector('button, a, [tabindex], [role]'),
    ).toBeNull()
    expect(badge.shadowRoot!.querySelector('[part="marker"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(getComputedStyle(base, '::after').display).not.toBe('none')
  })

  it('uses an open marker with no wash for the quiet variant', async () => {
    const badge = document.createElement('cad-badge')
    badge.variant = 'outline'
    badge.textContent = 'Draft'
    document.body.append(badge)
    await badge.updateComplete
    const base = badge.shadowRoot!.querySelector('[part="base"]')!
    const marker = badge.shadowRoot!.querySelector('[part="marker"]')!
    expect(getComputedStyle(base, '::after').display).toBe('none')
    expect(getComputedStyle(marker).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(marker).borderStyle).toBe('solid')
    badge.variant = 'solid'
    await badge.updateComplete
    expect(getComputedStyle(base, '::after').display).not.toBe('none')
    expect(getComputedStyle(marker).backgroundColor).not.toBe(
      'rgba(0, 0, 0, 0)',
    )
  })

  it('replaces the dot with a supplied marker and restores it when removed', async () => {
    const badge = document.createElement('cad-badge')
    const icon = document.createElement('span')
    icon.slot = 'start'
    icon.textContent = '✓'
    icon.setAttribute('aria-hidden', 'true')
    badge.append('Reviewed', icon)
    document.body.append(badge)
    await badge.updateComplete
    const marker = badge.shadowRoot!.querySelector('[part="marker"]')!
    expect(marker.getBoundingClientRect().width).toBe(0)
    expect(icon.getBoundingClientRect().width).toBeGreaterThan(0)
    icon.remove()
    await new Promise(requestAnimationFrame)
    expect(marker.getBoundingClientRect().width).toBeGreaterThan(0)
  })

  it('keeps custom ink and wash tokens, including the marker', async () => {
    const badge = document.createElement('cad-badge')
    badge.tone = 'mint'
    badge.style.setProperty('--cad-badge-ink', '#6d35c5')
    badge.style.setProperty('--cad-badge-bg', '#eadefc')
    badge.textContent = 'Custom'
    document.body.append(badge)
    await badge.updateComplete
    const base = badge.shadowRoot!.querySelector('[part="base"]')!
    expect(getComputedStyle(base).color).toBe('rgb(109, 53, 197)')
    expect(getComputedStyle(base, '::after').backgroundColor).toBe(
      'rgb(234, 222, 252)',
    )
    expect(
      getComputedStyle(badge.shadowRoot!.querySelector('[part="marker"]')!)
        .color,
    ).toBe('rgb(109, 53, 197)')
  })

  it('keeps long labels inside their available width', async () => {
    const badge = document.createElement('cad-badge')
    badge.style.width = '90px'
    badge.textContent = 'Awaiting architecture review'
    document.body.append(badge)
    await badge.updateComplete
    const label =
      badge.shadowRoot!.querySelector<HTMLElement>('[part="label"]')!
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis')
    expect(
      badge.shadowRoot!.querySelector('[part="base"]')!.getBoundingClientRect()
        .width,
    ).toBeLessThanOrEqual(90)
    expect(badge.textContent).toBe('Awaiting architecture review')
  })

  it('registers individually and reflects visual variants without adding a role', async () => {
    expectRegistered('cad-badge')
    const badge = document.createElement('cad-badge')
    const start = document.createElement('span')
    start.slot = 'start'
    start.textContent = '✓'
    badge.tone = 'mint'
    badge.variant = 'outline'
    badge.append(start, 'Reviewed')
    document.body.append(badge)
    await badge.updateComplete

    expect(badge.getAttribute('tone')).toBe('mint')
    expect(badge.getAttribute('variant')).toBe('outline')
    expect(badge.shadowRoot?.querySelector('[role]')).toBeNull()
    expect(
      badge.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="start"]')
        ?.assignedElements(),
    ).toEqual([start])
    expect(badge.shadowRoot?.querySelector('slot')).not.toBeNull()
  })

  it('supports the violet status vocabulary', async () => {
    const badge = document.createElement('cad-badge')
    badge.tone = 'violet'
    badge.textContent = 'Blocked'
    document.body.append(badge)
    await badge.updateComplete

    expect(badge.getAttribute('tone')).toBe('violet')
    expect(badge.textContent).toBe('Blocked')
  })
})
