import { css, html, LitElement, nothing } from 'lit'

import { feedbackToneStyles } from '../internal/feedback-tone-styles.js'
import {
  renderSystemIcon,
  type CadSystemIconName,
} from '../internal/system-icon.js'

export type CadAlertSize = 'compact' | 'default'
export type CadAlertVariant =
  'accent' | 'danger' | 'error' | 'info' | 'neutral' | 'success' | 'warning'

export type CadDismissDetail = {
  variant: CadAlertVariant
}

export type CadDismissEvent = CustomEvent<CadDismissDetail>

const icons: Record<CadAlertVariant, CadSystemIconName> = {
  accent: 'star',
  danger: 'error',
  error: 'error',
  info: 'info',
  neutral: 'neutral',
  success: 'success',
  warning: 'warning',
}

/**
 * A notebook-styled status message with optional action and dismissal.
 *
 * @slot - Alert body content.
 * @slot action - Optional next-step action.
 * @slot title - Visible alert heading. Falls back to the `heading` attribute.
 * @fires cad-dismiss - Fired after the dismiss button hides the alert.
 * @csspart action - Alert action container.
 * @csspart base - Alert container.
 * @csspart close-button - Dismiss button.
 * @csspart content - Alert body.
 * @csspart icon - Status icon.
 * @csspart title - Alert heading.
 * @cssprop --cad-alert-bg - Per-instance alert background.
 * @cssprop --cad-alert-ink - Per-instance alert accent.
 */
export class CadAlert extends LitElement {
  static override properties = {
    dismissible: { reflect: true, type: Boolean },
    dismissLabel: { attribute: 'dismiss-label', type: String },
    heading: { type: String },
    size: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = [
    feedbackToneStyles,
    css`
      :host {
        --_alert-accent: var(--cad-alert-ink, var(--_feedback-accent));
        --_alert-bg: var(
          --cad-alert-bg,
          color-mix(
            in srgb,
            var(--cad-surface-raised, #fff) 92%,
            var(--_feedback-tint)
          )
        );
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      .base {
        position: relative;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto auto;
        gap: 0.8rem;
        align-items: center;
        padding: 0.95rem 1rem;
        color: var(--cad-ink, #162033);
        background:
          linear-gradient(
            100deg,
            color-mix(in srgb, var(--_feedback-tint) 22%, transparent),
            transparent 58%
          ),
          var(--_alert-bg);
        border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
          var(--_alert-accent);
        border-radius: 0;
        box-shadow: 0.5px 0.75px 0
          color-mix(in srgb, var(--_alert-accent) 30%, transparent);
        font-family: var(--cad-type-body-font, var(--cad-font-book, serif));
      }

      .base::after {
        content: none;
      }

      .icon {
        display: inline-grid;
        place-items: center;
        align-self: start;
        margin-top: 0.04rem;
        color: var(--_alert-accent);
      }

      .icon svg {
        width: 1.9rem;
        height: 1.9rem;
      }

      .body {
        display: grid;
        gap: 0.18rem;
        min-width: 0;
      }

      .title {
        margin: 0;
        color: var(--_alert-accent);
        font-family: var(--cad-type-title-font, var(--cad-font-hand, cursive));
        font-size: var(--cad-type-label-size, 1.05rem);
        font-weight: var(--cad-hand-weight-strong, 700);
        line-height: 1.15;
      }

      .title ::slotted(*) {
        margin: 0;
        font: inherit;
      }

      .content {
        color: var(--cad-ink, #162033);
        font-size: var(--cad-type-body-size, 1rem);
        line-height: var(--cad-type-body-line-height, 1.6);
      }

      ::slotted(:first-child) {
        margin-top: 0;
      }

      ::slotted(:last-child) {
        margin-bottom: 0;
      }

      .action {
        position: relative;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        justify-self: end;
      }

      ::slotted([slot='action']) {
        padding: 0.18rem 0.08rem 0.22rem;
        color: var(--cad-link, #005bac);
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: inset 0 -2px var(--cad-link-mark, #ef4d4f);
        font-family: var(
          --cad-type-control-font,
          var(--cad-font-hand, cursive)
        );
        font-size: var(--cad-type-label-size, 1.05rem);
        text-decoration: none;
        cursor: pointer;
      }

      ::slotted([slot='action']:focus-visible) {
        outline: var(
          --cad-focus-outline,
          2px dashed var(--cad-focus-ring, #005bac)
        );
        outline-offset: 3px;
      }

      .close {
        position: relative;
        z-index: 2;
        display: inline-grid;
        place-items: center;
        width: 2.75rem;
        height: 2.75rem;
        padding: 0;
        color: var(--_alert-accent);
        background: transparent;
        border: 0;
        border-radius: 0;
        cursor: pointer;
      }

      .close:hover {
        background: color-mix(in srgb, var(--_feedback-tint) 42%, transparent);
      }

      .close:focus-visible {
        outline: var(
          --cad-focus-outline,
          2px dashed var(--cad-focus-ring, #005bac)
        );
        outline-offset: 2px;
      }

      .close svg {
        width: 1.2rem;
        height: 1.2rem;
      }

      :host([size='compact']) .base {
        gap: 0.6rem;
        padding: 0.65rem 0.8rem;
      }

      :host([size='compact']) .icon svg {
        width: 1.5rem;
        height: 1.5rem;
      }

      :host([size='compact']) .title,
      :host([size='compact']) .content {
        font-size: 0.94rem;
      }

      @media (max-width: 38rem) {
        .base {
          grid-template-columns: auto minmax(0, 1fr) auto;
        }

        .action {
          grid-column: 2;
          justify-self: start;
        }

        .close {
          grid-column: 3;
          grid-row: 1;
        }
      }

      @media (forced-colors: active) {
        .base,
        .close {
          border-color: CanvasText;
        }

        .base::after {
          display: none;
        }
      }
    `,
  ]

  declare dismissible: boolean
  declare dismissLabel: string
  declare heading: string
  declare size: CadAlertSize
  declare variant: CadAlertVariant

  constructor() {
    super()
    this.dismissible = false
    this.dismissLabel = 'Dismiss alert'
    this.heading = ''
    this.size = 'default'
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
    const role = ['danger', 'error', 'warning'].includes(this.variant)
      ? 'alert'
      : 'status'
    const hasTitle =
      this.heading || this.querySelector('[slot="title"]') !== null
    const hasAction = this.querySelector('[slot="action"]') !== null

    return html`
      <div class="base" part="base" role=${role}>
        <span aria-hidden="true" class="icon" part="icon">
          ${renderSystemIcon(icons[this.variant] ?? icons.info)}
        </span>
        <div class="body">
          ${
            hasTitle
              ? html`<div class="title" part="title">
                  <slot name="title"><strong>${this.heading}</strong></slot>
                </div>`
              : nothing
          }
          <div class="content" part="content"><slot></slot></div>
        </div>
        ${
          hasAction
            ? html`<div class="action" part="action">
                <slot name="action"></slot>
              </div>`
            : nothing
        }
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
                  ${renderSystemIcon('close')}
                </button>
              `
            : nothing
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
