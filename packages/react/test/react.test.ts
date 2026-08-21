import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CadAlert as CadAlertElement,
  type CadDismissEvent,
} from '@caderno-ui/elements/alert'
import { CadAlert } from '../src/alert.js'

describe('@caderno-ui/react', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('maps React props and typed custom events to the canonical element', async () => {
    const onDismiss = vi.fn<(event: CadDismissEvent) => void>()
    expect('heading' in CadAlertElement.prototype).toBe(true)

    act(() => {
      root.render(
        createElement(
          CadAlert,
          {
            dismissible: true,
            heading: 'Review needed',
            onDismiss,
            variant: 'warning',
          },
          'The implementation and contract have diverged.',
        ),
      )
    })

    const alert = container.querySelector('cad-alert')
    expect(alert).toBeInstanceOf(customElements.get('cad-alert'))
    await alert?.updateComplete
    expect(alert?.heading).toBe('Review needed')
    expect(alert?.variant).toBe('warning')

    act(() => {
      alert?.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click()
    })

    expect(onDismiss).toHaveBeenCalledOnce()
    expect(onDismiss.mock.calls[0]?.[0].detail).toEqual({
      variant: 'warning',
    })
  })
})
