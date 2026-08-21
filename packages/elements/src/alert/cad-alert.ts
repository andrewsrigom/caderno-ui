import { css, html, LitElement } from 'lit'

import '../icon/cad-icon.js'

export type CadAlertVariant = 'danger' | 'info' | 'success' | 'warning'

export type CadDismissDetail = {
  variant: CadAlertVariant
}

export type CadDismissEvent = CustomEvent<CadDismissDetail>

const icons = {
  danger: 'bug',
  info: 'spark',
  success: 'check',
  warning: 'exclamation',
} as const

/**
 * A notebook-styled status message with an optional dismiss action.
 *
 * @slot - Alert body content.
 * @slot title - Visible alert heading. Falls back to the `heading` attribute.
 * @fires cad-dismiss - Fired after the dismiss button hides the alert.
 * @csspart base - Alert container.
 * @csspart close-button - Dismiss button.
 * @csspart content - Alert body.
 * @csspart icon - Status icon.
 * @csspart title - Alert heading.
 * @cssprop --cad-alert-bg - Per-instance alert background.
 * @cssprop --cad-alert-ink - Per-instance alert foreground.
 */
export class CadAlert extends LitElement {
  static override properties = {
    dismissible: { reflect: true, type: Boolean },
    dismissLabel: { attribute: 'dismiss-label', type: String },
    heading: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_alert-bg: var(--cad-alert-bg, var(--cad-post-it-blue-bg, #293f64));
      --_alert-ink: var(--cad-alert-ink, var(--cad-post-it-blue-ink, #deebff));
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    :host([variant='success']) {
      --_alert-bg: var(--cad-alert-bg, var(--cad-post-it-mint-bg, #274f41));
      --_alert-ink: var(--cad-alert-ink, var(--cad-post-it-mint-ink, #d8ffec));
    }

    :host([variant='warning']) {
      --_alert-bg: var(--cad-alert-bg, var(--cad-post-it-lemon-bg, #51491f));
      --_alert-ink: var(--cad-alert-ink, var(--cad-post-it-lemon-ink, #fff1ac));
    }

    :host([variant='danger']) {
      --_alert-bg: var(--cad-alert-bg, var(--cad-post-it-coral-bg, #633b32));
      --_alert-ink: var(--cad-alert-ink, var(--cad-post-it-coral-ink, #ffe1da));
    }

    .base {
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.8rem;
      align-items: start;
      padding: 1.15rem 1.2rem 1.05rem;
      color: var(--_alert-ink);
      background: color-mix(
        in srgb,
        var(--_alert-bg) 78%,
        var(--cad-surface, #1f2335)
      );
      border: 1.5px solid color-mix(in srgb, var(--_alert-ink) 38%, transparent);
      border-radius: 0.8rem 1rem 0.75rem 0.95rem;
      box-shadow: 0 0.55rem 1.2rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
    }

    .tape {
      position: absolute;
      top: -0.45rem;
      inset-inline-start: 1.4rem;
      width: 3.8rem;
      height: 0.85rem;
      background: color-mix(
        in srgb,
        var(--cad-tape-paper-bg, #65614f) 72%,
        transparent
      );
      transform: rotate(-0.3deg);
    }

    .icon {
      display: inline-grid;
      place-items: center;
      margin-top: 0.05rem;
      transform: rotate(-2deg);
    }

    .body {
      display: grid;
      gap: 0.3rem;
      min-width: 0;
    }

    .title {
      margin: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
    }

    .content {
      color: color-mix(
        in srgb,
        var(--_alert-ink) 88%,
        var(--cad-ink, currentColor)
      );
      font-family: var(--cad-font-book, serif);
      line-height: 1.55;
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
      color: var(--_alert-ink);
      background: transparent;
      border: 0;
      border-radius: 50%;
    }

    .close:hover {
      background: color-mix(in srgb, var(--_alert-ink) 10%, transparent);
    }

    .close:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
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
  declare heading: string
  declare variant: CadAlertVariant

  constructor() {
    super()
    this.dismissible = false
    this.dismissLabel = 'Dismiss alert'
    this.heading = ''
    this.variant = 'info'
  }

  private dismiss(): void {
    this.hidden = true
    this.dispatchEvent(
      new CustomEvent<CadDismissDetail>('cad-dismiss', {
        bubbles: true,
        composed: true,
        detail: { variant: this.variant },
      }),
    )
  }

  override render() {
    const role =
      this.variant === 'danger' || this.variant === 'warning'
        ? 'alert'
        : 'status'

    return html`
      <div class="base" part="base" role=${role}>
        <span aria-hidden="true" class="tape"></span>
        <span aria-hidden="true" class="icon" part="icon">
          <cad-icon name=${icons[this.variant]} size="24"></cad-icon>
        </span>
        <div class="body">
          <h3 class="title" part="title">
            <slot name="title">${this.heading}</slot>
          </h3>
          <div class="content" part="content"><slot></slot></div>
        </div>
        ${
          this.dismissible
            ? html`
                <button
                  aria-label=${this.dismissLabel}
                  class="close"
                  part="close-button"
                  type="button"
                  @click=${this.dismiss}
                >
                  <cad-icon name="cross" size="18"></cad-icon>
                </button>
              `
            : null
        }
      </div>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-alert')) {
  customElements.define('cad-alert', CadAlert)
}

declare global {
  interface HTMLElementEventMap {
    'cad-dismiss': CadDismissEvent
  }

  interface HTMLElementTagNameMap {
    'cad-alert': CadAlert
  }
}
