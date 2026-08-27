import { afterEach, describe, expect, it } from 'vitest'
import '../src/button/cad-button.js'
import '../src/drawer/cad-drawer.js'
import '../src/modal/cad-modal.js'
import { deepActiveElement } from '../src/internal/dialog-layer.js'

afterEach(() => document.body.replaceChildren())

describe('modal focus boundaries', () => {
  for (const tag of ['cad-drawer', 'cad-modal'] as const) {
    it(`${tag} wraps Tab through native and shadow-DOM slotted controls`, async () => {
      const element = document.createElement(tag)
      const content = document.createElement('div')
      const link = document.createElement('a')
      link.href = '#test'
      link.textContent = 'Link'
      const action = document.createElement('cad-button')
      action.textContent = 'Last action'
      content.append(link, action)
      element.append(content)
      document.body.append(element)
      element.open = true
      await element.updateComplete
      await action.updateComplete
      const first =
        element.shadowRoot!.querySelector<HTMLButtonElement>('button')!
      const last =
        action.shadowRoot!.querySelector<HTMLButtonElement>('button')!
      first.focus()
      first.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
      expect(deepActiveElement()).toBe(last)
      last.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
      expect(deepActiveElement()).toBe(first)
    })
  }
})
