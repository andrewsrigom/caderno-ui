import { css, html, LitElement, type PropertyValues } from 'lit'

import {
  renderSystemIcon,
  type CadSystemIconName,
} from '../internal/system-icon.js'

export { CadToastHost } from './cad-toast-host.js'
export type { CadToastOptions, CadToastPlacement } from './cad-toast-host.js'

export type CadToastVariant = 'danger' | 'info' | 'success' | 'warning'
export type CadToastDismissReason = 'manual' | 'timeout'

export type CadToastDismissDetail = {
  reason: CadToastDismissReason
  variant: CadToastVariant
}

export type CadToastDismissEvent = CustomEvent<CadToastDismissDetail>

const icons: Record<CadToastVariant, CadSystemIconName> = {
  danger: 'danger',
  info: 'info',
  success: 'check',
  warning: 'warning',
}

/**
 * A dismissible notebook notification with optional automatic timeout.
 *
 * @slot - Notification body.
 * @slot title - Notification heading. Falls back to the `heading` attribute.
 * @fires cad-toast-dismiss - Fired after manual or timed dismissal.
 * @csspart base - Notification article.
 * @csspart body - Notification text container.
 * @csspart close-button - Dismiss button.
 * @csspart content - Notification body.
 * @csspart icon - Status icon.
 * @csspart tape - Decorative tape strip.
 * @csspart title - Notification heading.
 * @cssprop --cad-toast-bg - Per-instance toast background.
 * @cssprop --cad-toast-ink - Per-instance toast foreground.
 */
export class CadToast extends LitElement {
  static override properties = {
    dismissible: { reflect: true, type: Boolean },
    dismissLabel: { attribute: 'dismiss-label', type: String },
    duration: { reflect: true, type: Number },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_toast-bg: var(--cad-toast-bg, var(--cad-post-it-blue-bg, #cfe2ff));
      --_toast-ink: var(--cad-toast-ink, var(--cad-post-it-blue-ink, #20375d));
      display: block;
      width: min(22rem, calc(100vw - 2rem));
    }

    :host(:not([open])) {
      display: none;
    }

    :host([variant='success']) {
      --_toast-bg: var(--cad-toast-bg, var(--cad-post-it-mint-bg, #d8ffec));
      --_toast-ink: var(--cad-toast-ink, var(--cad-post-it-mint-ink, #274f41));
    }

    :host([variant='warning']) {
      --_toast-bg: var(--cad-toast-bg, var(--cad-post-it-lemon-bg, #fff1ac));
      --_toast-ink: var(--cad-toast-ink, var(--cad-post-it-lemon-ink, #51491f));
    }

    :host([variant='danger']) {
      --_toast-bg: var(--cad-toast-bg, var(--cad-post-it-coral-bg, #ffd8ce));
      --_toast-ink: var(--cad-toast-ink, var(--cad-post-it-coral-ink, #633b32));
    }

    .base {
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.65rem;
      align-items: start;
      padding: 1rem 0.95rem 0.9rem;
      color: var(--_toast-ink);
      background: var(--_toast-bg);
      border: 1px solid color-mix(in srgb, var(--_toast-ink) 34%, transparent);
      border-radius: 0.45rem 0.65rem 0.45rem 0.6rem;
      box-shadow: 0 0.8rem 1.8rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.18);
      animation: enter var(--cad-duration-normal, 220ms)
        var(--cad-transition-smooth, ease) both;
    }

    .tape {
      position: absolute;
      top: -0.45rem;
      left: 50%;
      width: 3.6rem;
      height: 0.75rem;
      background: color-mix(
        in srgb,
        var(--cad-tape-paper-bg, #f2e6bd) 74%,
        transparent
      );
      transform: translateX(-50%) rotate(-0.25deg);
    }

    .icon {
      display: inline-grid;
      margin-top: 0.05rem;
      transform: rotate(-2deg);
    }

    .icon svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .body {
      display: grid;
      gap: 0.15rem;
      min-width: 0;
    }

    .title {
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
    }

    .content {
      overflow-wrap: anywhere;
      font-family: var(--cad-font-book, serif);
      font-size: 0.9rem;
      line-height: 1.45;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    .close {
      display: inline-grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      padding: 0;
      color: inherit;
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 50%;
    }

    .close:hover {
      background: color-mix(in srgb, var(--_toast-ink) 10%, transparent);
    }

    .close:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, var(--_toast-ink));
      outline-offset: 3px;
    }

    .close svg {
      width: 1rem;
      height: 1rem;
    }

    @keyframes enter {
      from {
        opacity: 0;
        transform: translateY(-0.75rem) rotate(-0.4deg);
      }

      to {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .base {
        animation: none;
      }
    }

    @media (forced-colors: active) {
      .base,
      .close {
        border-color: CanvasText;
      }
    }
  `

  declare dismissible: boolean
  declare dismissLabel: string
  declare duration: number
  declare heading: string
  declare open: boolean
  declare variant: CadToastVariant

  private timeout: number | undefined

  constructor() {
    super()
    this.dismissible = true
    this.dismissLabel = 'Dismiss notification'
    this.duration = 0
    this.heading = ''
    this.open = true
    this.variant = 'info'
  }

  override disconnectedCallback(): void {
    this.clearTimer()
    super.disconnectedCallback()
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has('duration') || changed.has('open')) this.scheduleDismissal()
  }

  dismiss(reason: CadToastDismissReason = 'manual'): void {
    if (!this.open) return
    this.clearTimer()
    this.open = false
    this.dispatchEvent(
      new CustomEvent<CadToastDismissDetail>('cad-toast-dismiss', {
        bubbles: true,
        composed: true,
        detail: { reason, variant: this.variant },
      }),
    )
  }

  override render() {
    return html`
      <div
        aria-live=${this.variant === 'danger' ? 'assertive' : 'polite'}
        class="base"
        part="base"
        role=${this.variant === 'danger' ? 'alert' : 'status'}
        @focusin=${this.clearTimer}
        @focusout=${this.scheduleDismissal}
        @pointerenter=${this.clearTimer}
        @pointerleave=${this.scheduleDismissal}
      >
        <span aria-hidden="true" class="tape" part="tape"></span>
        <span aria-hidden="true" class="icon" part="icon">
          ${renderSystemIcon(icons[this.variant])}
        </span>
        <span class="body" part="body">
          <strong class="title" part="title">
            <slot name="title">${this.heading}</slot>
          </strong>
          <span class="content" part="content"><slot></slot></span>
        </span>
        ${
          this.dismissible
            ? html`
                <button
                  aria-label=${this.dismissLabel}
                  class="close"
                  part="close-button"
                  type="button"
                  @click=${this.handleDismiss}
                >
                  ${renderSystemIcon('close')}
                </button>
              `
            : null
        }
      </div>
    `
  }

  private handleDismiss(): void {
    this.dismiss('manual')
  }

  private clearTimer(): void {
    if (this.timeout === undefined) return
    window.clearTimeout(this.timeout)
    this.timeout = undefined
  }

  private scheduleDismissal(): void {
    this.clearTimer()
    if (!this.open || !Number.isFinite(this.duration) || this.duration <= 0) {
      return
    }
    this.timeout = window.setTimeout(
      () => this.dismiss('timeout'),
      this.duration,
    )
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-toast')) {
  customElements.define('cad-toast', CadToast)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-toast': CadToast
  }
}
