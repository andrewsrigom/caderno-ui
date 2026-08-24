import { css, html, LitElement } from 'lit'

import type { CadToast, CadToastVariant } from './cad-toast.js'

export type CadToastPlacement = 'bottom-right' | 'top-right'

export type CadToastOptions = {
  dismissible?: boolean
  duration?: number
  heading?: string
  message: string
  variant?: CadToastVariant
}

/**
 * A fixed notification region that creates and stacks `cad-toast` messages.
 *
 * @slot - Declarative `cad-toast` notifications.
 * @csspart base - Live notification region.
 * @cssprop --cad-toast-host-z-index - Notification region stacking level.
 */
export class CadToastHost extends LitElement {
  static override properties = {
    label: { type: String },
    placement: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      position: fixed;
      z-index: var(--cad-toast-host-z-index, 60);
      top: 1rem;
      right: 1rem;
      display: block;
      width: min(22rem, calc(100vw - 2rem));
      pointer-events: none;
    }

    :host([placement='bottom-right']) {
      top: auto;
      bottom: 1rem;
    }

    .base {
      display: grid;
      gap: 0.8rem;
    }

    ::slotted(cad-toast) {
      pointer-events: auto;
    }

    @media (width <= 36rem) {
      :host {
        right: 0.75rem;
        width: calc(100vw - 1.5rem);
      }
    }
  `

  declare label: string
  declare placement: CadToastPlacement

  constructor() {
    super()
    this.label = 'Notifications'
    this.placement = 'top-right'
  }

  show(options: CadToastOptions): CadToast {
    const toast = document.createElement('cad-toast')
    toast.dismissible = options.dismissible ?? true
    toast.duration = Math.max(0, options.duration ?? 5000)
    toast.heading = options.heading ?? ''
    toast.variant = options.variant ?? 'info'
    toast.textContent = options.message
    this.append(toast)
    return toast
  }

  override render() {
    return html`
      <div
        aria-label=${this.label}
        aria-live="polite"
        class="base"
        part="base"
        role="region"
      >
        <slot></slot>
      </div>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-toast-host')
) {
  customElements.define('cad-toast-host', CadToastHost)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-toast-host': CadToastHost
  }
}
