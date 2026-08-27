import { afterEach, describe, expect, it } from 'vitest'

import '../src/divider/cad-divider.js'
import '../src/icon/cad-icon.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-divider', () => {
  it('is decorative by default', async () => {
    expectRegistered('cad-divider')
    const element = document.createElement('cad-divider')
    document.body.append(element)
    await element.updateComplete

    const divider = element.shadowRoot?.querySelector('[part="base"]')
    expect(divider?.getAttribute('role')).toBe('none')
    expect(divider?.getAttribute('aria-hidden')).toBe('true')
  })

  it('exposes separator semantics when requested', async () => {
    const element = document.createElement('cad-divider')
    element.decorative = false
    element.orientation = 'vertical'
    document.body.append(element)
    await element.updateComplete

    const divider = element.shadowRoot?.querySelector('[part="base"]')
    expect(divider?.getAttribute('role')).toBe('separator')
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical')
  })

  it('offers declarative semantic separator markup', async () => {
    const element = document.createElement('cad-divider')
    element.semantic = true
    element.label = 'Decision point'
    document.body.append(element)
    await element.updateComplete

    const divider = element.shadowRoot?.querySelector('[part="base"]')
    expect(divider?.getAttribute('role')).toBe('separator')
    expect(divider?.getAttribute('aria-label')).toBe('Decision point')
  })

  it('keeps a slotted icon centered inside its leading mark', async () => {
    const element = document.createElement('cad-divider')
    element.label = 'Decision point'

    const icon = document.createElement('cad-icon')
    icon.name = 'star'
    icon.slot = 'start'
    element.append(icon)
    document.body.append(element)
    await element.updateComplete
    await icon.updateComplete

    const iconBox = icon.getBoundingClientRect()
    const svgBox = icon.shadowRoot
      ?.querySelector('svg')
      ?.getBoundingClientRect()

    expect(svgBox).toBeDefined()
    expect(svgBox!.left).toBeGreaterThan(iconBox.left)
    expect(svgBox!.right).toBeLessThan(iconBox.right)
    expect(svgBox!.top).toBeGreaterThan(iconBox.top)
    expect(svgBox!.bottom).toBeLessThan(iconBox.bottom)
  })
})
