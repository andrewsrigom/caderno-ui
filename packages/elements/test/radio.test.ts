import { afterEach, describe, expect, it } from 'vitest'

import '../src/radio/cad-radio.js'
import { expectRegistered } from './contract.js'

afterEach(() => {
  document.body.replaceChildren()
})

describe('cad-radio', () => {
  it('coordinates a named group across shadow roots and submits one value', async () => {
    expectRegistered('cad-radio')
    const form = document.createElement('form')
    const first = document.createElement('cad-radio')
    const second = document.createElement('cad-radio')
    first.checked = true
    first.label = 'Architecture'
    first.name = 'track'
    first.value = 'architecture'
    second.label = 'Algorithms'
    second.name = 'track'
    second.value = 'algorithms'
    form.append(first, second)
    document.body.append(form)
    await Promise.all([first.updateComplete, second.updateComplete])

    second.click()
    await Promise.all([first.updateComplete, second.updateComplete])

    expect(first.checked).toBe(false)
    expect(second.checked).toBe(true)
    expect(new FormData(form).get('track')).toBe('algorithms')
  })

  it('moves and selects with native radio arrow-key behavior', async () => {
    const first = document.createElement('cad-radio')
    const second = document.createElement('cad-radio')
    first.checked = true
    first.name = 'level'
    second.name = 'level'
    document.body.append(first, second)
    await Promise.all([first.updateComplete, second.updateComplete])

    first.shadowRoot
      ?.querySelector('input')
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
      )
    await Promise.all([first.updateComplete, second.updateComplete])

    expect(second.checked).toBe(true)
  })
})
