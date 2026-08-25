import { afterEach, describe, expect, it } from 'vitest'

import '../src/sticker/cad-sticker.js'
import { expectRegistered } from './contract.js'

afterEach(() => document.body.replaceChildren())

describe('cad-sticker', () => {
  it('renders a label and composable leading visual', async () => {
    expectRegistered('cad-sticker')
    const element = document.createElement('cad-sticker')
    const start = document.createElement('span')
    start.slot = 'start'
    start.textContent = '★'
    element.label = 'New'
    element.append(start)
    document.body.append(element)
    await element.updateComplete
    expect(
      element.shadowRoot
        ?.querySelector<HTMLSlotElement>('slot[name="start"]')
        ?.assignedElements(),
    ).toEqual([start])
    expect(
      element.shadowRoot?.querySelector('[part="text"]')?.textContent,
    ).toContain('New')
  })
})
