import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

import {
  renderSystemIcon,
  type CadSystemIconName,
} from '../internal/system-icon.js'

export { CadToastHost, toast } from './cad-toast-host.js'
export type {
  CadToastFunction,
  CadToastCallOptions,
  CadToastOptions,
  CadToastPlacement,
  CadToastPromiseMessage,
  CadToastPromiseOptions,
} from './cad-toast-host.js'

export type CadToastId = number | string
export type CadToastVariant =
  | 'accent'
  | 'danger'
  | 'error'
  | 'info'
  | 'loading'
  | 'neutral'
  | 'success'
  | 'warning'
export type CadToastDismissReason =
  'action' | 'manual' | 'overflow' | 'programmatic' | 'timeout'

export type CadToastAction = {
  label: string
  onClick: (event: MouseEvent, toast: CadToast) => void
}

export type CadToastDismissDetail = {
  id?: CadToastId
  reason: CadToastDismissReason
  variant: CadToastVariant
}

export type CadToastDismissEvent = CustomEvent<CadToastDismissDetail>

const icons: Record<CadToastVariant, CadSystemIconName> = {
  accent: 'star',
  danger: 'error',
  error: 'error',
  info: 'info',
  loading: 'loading',
  neutral: 'neutral',
  success: 'success',
  warning: 'warning',
}

/**
 * A dismissible handwritten notification with action and automatic timeout.
 *
 * @slot - Notification description. Falls back to the `description` attribute.
 * @slot action - Optional declarative action.
 * @slot title - Notification heading. Falls back to the `heading` attribute.
 * @fires cad-toast-dismiss - Fired after manual, automatic, or programmatic dismissal.
 * @csspart action - Notification action container.
 * @csspart base - Notification article.
 * @csspart body - Notification text container.
 * @csspart close-button - Dismiss button.
 * @csspart content - Notification description.
 * @csspart icon - Status icon.
 * @csspart title - Notification heading.
 * @cssprop --cad-toast-bg - Per-instance toast background.
 * @cssprop --cad-toast-ink - Per-instance toast foreground.
 * @cssprop --cad-toast-width - Per-instance toast width.
 */
export class CadToast extends LitElement {
  static override properties = {
    action: { attribute: false },
    description: { type: String },
    dismissible: { reflect: true, type: Boolean },
    dismissLabel: { attribute: 'dismiss-label', type: String },
    duration: { reflect: true, type: Number },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_toast-bg: var(--cad-toast-bg, var(--cad-surface, #fff));
      --_toast-ink: var(--cad-toast-ink, var(--cad-link, #005bac));
      --_toast-line: var(--cad-link, #005bac);
      display: block;
      width: min(var(--cad-toast-width, 30rem), calc(100vw - 2rem));
      max-width: 100%;
    }

    :host(:not([open])) {
      display: none;
    }

    :host([variant='success']) {
      --_toast-ink: var(--cad-toast-ink, var(--cad-success-ink, #087a4f));
      --_toast-line: var(--cad-success-ink, #159566);
    }

    :host([variant='warning']) {
      --_toast-ink: var(--cad-toast-ink, var(--cad-warning-ink, #9a5500));
      --_toast-line: var(--cad-warning-ink, #ef8500);
    }

    :host([variant='danger']),
    :host([variant='error']) {
      --_toast-ink: var(--cad-toast-ink, var(--cad-danger-ink, #bd1f32));
      --_toast-line: var(--cad-danger-ink, #ff3347);
    }

    :host([variant='neutral']) {
      --_toast-ink: var(--cad-toast-ink, var(--cad-ink-soft, #64748b));
      --_toast-line: var(--cad-ink-muted, #7d8ca5);
    }

    :host([variant='accent']) {
      --_toast-ink: var(--cad-toast-ink, var(--cad-violet-ink, #6f2dbd));
      --_toast-line: var(--cad-violet-ink, #7b35c7);
    }

    .base {
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto auto;
      gap: 0.72rem;
      align-items: center;
      min-height: 3.7rem;
      padding: 0.68rem 0.72rem 0.72rem;
      color: var(--_toast-ink);
      background: var(--_toast-bg);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_toast-line);
      border-radius: 0;
      box-shadow: 0.5px 1px 0
        color-mix(in srgb, var(--_toast-line) 28%, transparent);
      animation: enter
        var(--cad-motion-duration-enter, var(--cad-duration-normal, 220ms))
        var(--cad-motion-ease-enter, var(--cad-transition-smooth, ease)) both;
      transform: rotate(-0.04deg);
    }

    .base::before {
      content: none;
    }

    .icon {
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      transform: rotate(-1.5deg);
    }

    .icon svg {
      width: 1.85rem;
      height: 1.85rem;
    }

    :host([variant='loading']) .icon svg {
      animation: spin 0.9s linear infinite;
    }

    .body {
      display: grid;
      gap: 0.12rem;
      min-width: 0;
    }

    .title {
      overflow-wrap: anywhere;
      font-family: var(--cad-type-title-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, 1.05rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1.2;
    }

    .content {
      overflow-wrap: anywhere;
      color: color-mix(in srgb, currentColor 84%, var(--cad-ink, #25202a));
      font-family: var(--cad-type-body-font, var(--cad-font-book, serif));
      font-size: var(--cad-type-meta-size, 0.82rem);
      line-height: var(--cad-type-meta-line-height, 1.45);
    }

    .content:empty {
      display: none;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    .actions {
      display: none;
      align-items: center;
      min-height: 2rem;
      padding-inline: 0.35rem 0.72rem;
      border-inline-end: 1px solid
        color-mix(in srgb, var(--_toast-line) 52%, transparent);
    }

    .actions.has-action {
      display: inline-flex;
    }

    .action,
    ::slotted([slot='action']) {
      padding: 0.18rem 0.08rem 0.24rem;
      color: var(--cad-link, #005bac);
      background: transparent;
      background-image: linear-gradient(
        180deg,
        transparent 0 calc(100% - 2px),
        var(--cad-link-mark, #ef4d4f) calc(100% - 2px) 100%
      );
      border: 0;
      border-radius: 0;
      font: inherit;
      font-family: var(--cad-type-control-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, 1.05rem);
      white-space: nowrap;
      cursor: pointer;
    }

    .action:hover,
    ::slotted([slot='action']:hover) {
      background-image: linear-gradient(
        180deg,
        transparent 0 calc(100% - 3px),
        #ff5c5c calc(100% - 3px) 100%
      );
    }

    .action:focus-visible,
    ::slotted([slot='action']:focus-visible) {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--cad-link, #005bac))
      );
      outline-offset: 3px;
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
      border-radius: 0;
    }

    .close:hover {
      background: color-mix(in srgb, var(--_toast-line) 8%, transparent);
    }

    .close:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--_toast-line))
      );
      outline-offset: 2px;
    }

    .close svg {
      width: 1.15rem;
      height: 1.15rem;
    }

    @keyframes enter {
      from {
        opacity: 0;
        transform: translateY(-0.6rem) rotate(-0.22deg);
      }

      to {
        opacity: 1;
        transform: translateY(0) rotate(-0.04deg);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 32rem) {
      .base {
        grid-template-columns: auto minmax(0, 1fr) auto;
      }

      .actions.has-action {
        grid-column: 2 / -1;
        grid-row: 2;
        justify-self: start;
        padding: 0.3rem 0 0;
        border: 0;
      }

      .close {
        grid-column: 3;
        grid-row: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .base,
      :host([variant='loading']) .icon svg {
        animation: none;
      }
    }

    @media (forced-colors: active) {
      .base,
      .close,
      .action {
        border-color: CanvasText;
      }

      .base {
        color: CanvasText;
        background: Canvas;
      }
    }
  `

  declare action: CadToastAction | undefined
  declare description: string
  declare dismissible: boolean
  declare dismissLabel: string
  declare duration: number
  declare heading: string
  declare open: boolean
  declare variant: CadToastVariant

  toastId: CadToastId | undefined
  onAutoClose: ((detail: CadToastDismissDetail) => void) | undefined
  onDismiss: ((detail: CadToastDismissDetail) => void) | undefined

  private focusPaused = false
  private hasActionSlot = false
  private pointerPaused = false
  private remainingDuration = 0
  private timerStartedAt = 0
  private timeout: number | undefined

  constructor() {
    super()
    this.action = undefined
    this.description = ''
    this.dismissible = true
    this.dismissLabel = 'Dismiss notification'
    this.duration = 0
    this.heading = ''
    this.onAutoClose = undefined
    this.onDismiss = undefined
    this.open = true
    this.toastId = undefined
    this.variant = 'info'
  }

  override disconnectedCallback(): void {
    this.clearTimer()
    super.disconnectedCallback()
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has('duration')) {
      this.remainingDuration = this.duration
      this.scheduleDismissal()
      return
    }
    if (changed.has('open') && this.open) {
      this.remainingDuration = this.duration
      this.scheduleDismissal()
    }
  }

  dismiss(reason: CadToastDismissReason = 'manual'): void {
    if (!this.open) return
    this.clearTimer()
    this.open = false
    const detail: CadToastDismissDetail = {
      ...(this.toastId === undefined ? {} : { id: this.toastId }),
      reason,
      variant: this.variant,
    }
    if (reason === 'timeout') this.onAutoClose?.(detail)
    else this.onDismiss?.(detail)
    this.dispatchEvent(
      new CustomEvent<CadToastDismissDetail>('cad-toast-dismiss', {
        bubbles: true,
        composed: true,
        detail,
      }),
    )
  }

  override render() {
    const urgent = this.variant === 'danger' || this.variant === 'error'
    const hasAction = Boolean(this.action) || this.hasActionSlot

    return html`
      <div
        aria-atomic="true"
        aria-busy=${this.variant === 'loading' ? 'true' : nothing}
        aria-live=${urgent ? 'assertive' : 'polite'}
        class="base"
        part="base"
        role=${urgent ? 'alert' : 'status'}
        @focusin=${this.handleFocusIn}
        @focusout=${this.handleFocusOut}
        @pointerenter=${this.handlePointerEnter}
        @pointerleave=${this.handlePointerLeave}
      >
        <span aria-hidden="true" class="icon" part="icon">
          ${renderSystemIcon(icons[this.variant])}
        </span>
        <span class="body" part="body">
          <strong class="title" part="title">
            <slot name="title">${this.heading}</slot>
          </strong>
          <span class="content" part="content"
            ><slot>${this.description}</slot></span
          >
        </span>
        <span class=${`actions${hasAction ? ' has-action' : ''}`} part="action">
          <slot name="action" @slotchange=${this.handleActionSlot}></slot>
          ${
            this.action
              ? html`<button
                  class="action"
                  type="button"
                  @click=${this.handleAction}
                >
                  ${this.action.label}
                </button>`
              : nothing
          }
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
            : nothing
        }
      </div>
    `
  }

  private handleAction(event: MouseEvent): void {
    this.action?.onClick(event, this)
    if (!event.defaultPrevented) this.dismiss('action')
  }

  private handleActionSlot(event: Event): void {
    const slot = event.currentTarget
    if (!(slot instanceof HTMLSlotElement)) return
    const hasActionSlot = slot.assignedNodes({ flatten: true }).length > 0
    if (hasActionSlot === this.hasActionSlot) return
    this.hasActionSlot = hasActionSlot
    this.requestUpdate()
  }

  private handleDismiss(): void {
    this.dismiss('manual')
  }

  private handleFocusIn(): void {
    this.focusPaused = true
    this.pauseTimer()
  }

  private handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget
    if (next instanceof Node && this.renderRoot.contains(next)) return
    this.focusPaused = false
    this.resumeTimer()
  }

  private handlePointerEnter(): void {
    this.pointerPaused = true
    this.pauseTimer()
  }

  private handlePointerLeave(): void {
    this.pointerPaused = false
    this.resumeTimer()
  }

  private pauseTimer(): void {
    if (this.timeout === undefined) return
    const elapsed = performance.now() - this.timerStartedAt
    this.remainingDuration = Math.max(0, this.remainingDuration - elapsed)
    this.clearTimer()
  }

  private resumeTimer(): void {
    if (this.focusPaused || this.pointerPaused) return
    this.scheduleDismissal()
  }

  private clearTimer(): void {
    if (this.timeout === undefined) return
    window.clearTimeout(this.timeout)
    this.timeout = undefined
  }

  private scheduleDismissal(): void {
    this.clearTimer()
    if (
      !this.open ||
      this.focusPaused ||
      this.pointerPaused ||
      !Number.isFinite(this.remainingDuration) ||
      this.remainingDuration <= 0
    ) {
      return
    }
    this.timerStartedAt = performance.now()
    this.timeout = window.setTimeout(
      () => this.dismiss('timeout'),
      this.remainingDuration,
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
