import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

import {
  deepActiveElement,
  focusElement,
  focusTargetFromEvent,
  lockDocumentScroll,
  trapDialogFocus,
  unlockDocumentScroll,
} from '../internal/dialog-layer.js'
import { renderSystemIcon } from '../internal/system-icon.js'

export type CadModalSize = 'lg' | 'md' | 'sm'
export type CadModalTone = 'danger' | 'default'

export type CadModalCloseDetail = {
  returnValue: string
}

export type CadModalCloseEvent = CustomEvent<CadModalCloseDetail>
export type CadModalOpenEvent = CustomEvent<void>

/**
 * A native modal dialog with focus management, Escape handling, and restoration.
 *
 * @slot - Dialog body.
 * @slot trigger - Element that opens the modal when activated.
 * @slot title - Dialog heading. Falls back to the `heading` attribute.
 * @slot footer - Supporting actions.
 * @fires cad-modal-close - Fired after the native dialog closes.
 * @fires cad-modal-open - Fired after the native modal opens.
 * @csspart base - Native dialog element.
 * @csspart body - Scrollable dialog body.
 * @csspart close-button - Native close button.
 * @csspart footer - Dialog action area.
 * @csspart header - Dialog heading area.
 * @csspart icon - Destructive dialog status icon.
 * @csspart paper - Notebook paper surface.
 * @csspart title - Dialog heading.
 * @csspart trigger - Trigger slot container.
 */
export class CadModal extends LitElement {
  static override properties = {
    closeLabel: { attribute: 'close-label', type: String },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    size: { reflect: true, type: String },
    tone: { reflect: true, type: String },
    closeOnBackdrop: {
      attribute: 'close-on-backdrop',
      reflect: true,
      type: Boolean,
    },
  }

  static override styles = css`
    :host {
      display: contents;
    }

    .trigger {
      display: inline-flex;
    }

    .base {
      width: min(calc(100% - 2rem), 30rem);
      max-width: none;
      max-height: min(82vh, 46rem);
      padding: 0;
      overflow: visible;
      color: var(--cad-link, #005bac);
      background: transparent;
      border: 0;
      border-radius: 0;
      font-family: var(--cad-font-hand, cursive);
    }

    :host([size='sm']) .base {
      width: min(calc(100% - 2rem), 24rem);
    }

    :host([size='lg']) .base {
      width: min(calc(100% - 2rem), 42rem);
    }

    .base::backdrop {
      background-color: color-mix(
        in srgb,
        var(--cad-link, #005bac) 9%,
        rgb(255 255 255 / 0.84)
      );
      background-image: repeating-linear-gradient(
        -14deg,
        transparent 0 5px,
        color-mix(in srgb, var(--cad-link, #005bac) 5%, transparent) 5px 6px
      );
      backdrop-filter: blur(1.5px);
    }

    .base[open]::backdrop {
      animation: cad-modal-backdrop-enter
        var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
        var(--cad-motion-ease-enter, var(--cad-transition-smooth, ease-out));
    }

    .paper {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      max-height: min(82vh, 46rem);
      overflow: hidden;
      background: var(--cad-surface, #fff);
      border: var(--cad-frame-border, 1.5px dashed var(--cad-link, #005bac));
      border-radius: 0;
      box-shadow:
        0.28rem 0.35rem 0
          color-mix(in srgb, var(--cad-link, #005bac) 9%, transparent),
        0 1rem 2.4rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
      transform: rotate(-0.04deg);
    }

    .paper::before {
      content: none;
    }

    .base[open] .paper {
      animation: cad-modal-paper-enter
        var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
        var(--cad-motion-ease-enter, var(--cad-transition-smooth, ease-out));
      transform-origin: center 42%;
    }

    .header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.85rem;
      align-items: center;
      min-width: 0;
      padding: 1.35rem 1.35rem 0.55rem;
    }

    .header.has-icon {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    .status-icon {
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      color: var(--cad-danger, #d52f3f);
      transform: rotate(-1.5deg);
    }

    .status-icon svg {
      width: 1.8rem;
      height: 1.8rem;
    }

    .title {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
      font-family: var(--cad-type-title-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-title-size, 1.55rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1.2;
    }

    :host([tone='danger']) .title {
      color: var(--cad-danger, #d52f3f);
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .title:focus {
      outline: 0;
    }

    .close {
      display: inline-grid;
      flex: 0 0 auto;
      place-items: center;
      width: 2.25rem;
      height: 2.25rem;
      padding: 0;
      color: inherit;
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 0;
      transition:
        background-color
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    .close:hover {
      background: color-mix(in srgb, currentColor 10%, transparent);
      transform: rotate(5deg) scale(1.05);
    }

    .close:active {
      transform: rotate(-3deg) scale(0.94);
    }

    .close:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, currentColor)
      );
      outline-offset: 3px;
    }

    .close svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .body {
      min-width: 0;
      padding: 0.75rem 1.35rem 1.25rem;
      overflow: auto;
      color: var(--cad-ink, #162033);
      font-family: var(--cad-type-body-font, var(--cad-font-book, serif));
      font-size: var(--cad-type-body-size, 1rem);
      line-height: var(--cad-type-body-line-height, 1.6);
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    .footer {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
      justify-content: space-between;
      margin-inline: 0.85rem;
      padding: 0.85rem 0.5rem 1rem;
      border-top: 1px dashed
        color-mix(in srgb, var(--cad-link, #005bac) 52%, transparent);
    }

    .footer[hidden] {
      display: none;
    }

    ::slotted([slot='footer']:only-child) {
      margin-inline-start: auto;
    }

    @keyframes cad-modal-paper-enter {
      from {
        opacity: 0;
        transform: translateY(var(--cad-motion-distance-md, 0.85rem))
          rotate(-0.45deg) scale(0.975);
      }

      to {
        opacity: 1;
        transform: translateY(0) rotate(-0.04deg) scale(1);
      }
    }

    @keyframes cad-modal-backdrop-enter {
      from {
        background: transparent;
        backdrop-filter: blur(0);
      }

      to {
        background-color: color-mix(
          in srgb,
          var(--cad-link, #005bac) 9%,
          rgb(255 255 255 / 0.84)
        );
        backdrop-filter: blur(1.5px);
      }
    }

    @media (width <= 36rem) {
      .header,
      .body,
      .footer {
        padding-inline: 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .base[open] .paper,
      .base[open]::backdrop {
        animation: none;
      }

      .close {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .paper,
      .close {
        border-color: CanvasText;
      }
    }
  `

  declare closeLabel: string
  declare closeOnBackdrop: boolean
  declare heading: string
  declare open: boolean
  declare size: CadModalSize
  declare tone: CadModalTone

  private hasFooter = false
  private returnFocus: HTMLElement | undefined
  private scrollLocked = false
  private triggerBound = false

  constructor() {
    super()
    this.closeLabel = 'Close dialog'
    this.closeOnBackdrop = true
    this.heading = ''
    this.open = false
    this.size = 'md'
    this.tone = 'default'
  }

  override disconnectedCallback(): void {
    this.releaseScrollLock()
    super.disconnectedCallback()
  }

  get dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog')
  }

  showModal(): void {
    this.openModal(deepActiveElement())
  }

  close(returnValue = ''): void {
    const dialog = this.dialog
    this.open = false
    this.releaseScrollLock()
    if (dialog?.open) dialog.close(returnValue)
  }

  override updated(changed: PropertyValues<this>): void {
    if (!this.triggerBound) {
      const triggerSlot = this.renderRoot.querySelector('slot[name="trigger"]')
      triggerSlot?.addEventListener('click', this.handleTriggerClick)
      this.triggerBound = Boolean(triggerSlot)
    }
    if (!changed.has('open')) return
    const dialog = this.dialog
    if (!dialog) return
    if (this.open && !dialog.open) {
      if (!this.returnFocus && document.activeElement instanceof HTMLElement) {
        this.returnFocus = document.activeElement
      }
      dialog.showModal()
      this.renderRoot
        .querySelector<HTMLElement>('.title')
        ?.focus({ preventScroll: true })
      this.acquireScrollLock()
      this.dispatchEvent(
        new CustomEvent<void>('cad-modal-open', {
          bubbles: true,
          composed: true,
        }),
      )
    } else if (!this.open && dialog.open) {
      dialog.close()
    }
  }

  override render() {
    const destructive = this.tone === 'danger'
    return html`
      <span class="trigger" part="trigger">
        <slot name="trigger"></slot>
      </span>
      <dialog
        aria-labelledby="modal-title"
        class="base"
        part="base"
        @keydown=${this.handleKeyDown}
        @pointerdown=${this.handleBackdropClick}
        @close=${this.handleNativeClose}
      >
        <div class="paper" part="paper">
          <header
            class=${`header${destructive ? ' has-icon' : ''}`}
            part="header"
          >
            ${
              destructive
                ? html`<span aria-hidden="true" class="status-icon" part="icon"
                    >${renderSystemIcon('warning')}</span
                  >`
                : nothing
            }
            <div class="title" id="modal-title" part="title" tabindex="-1">
              <slot name="title"><strong>${this.heading}</strong></slot>
            </div>
            <button
              aria-label=${this.closeLabel}
              class="close"
              part="close-button"
              type="button"
              @click=${this.handleCloseClick}
            >
              ${renderSystemIcon('close')}
            </button>
          </header>
          <div class="body" part="body"><slot></slot></div>
          <footer class="footer" ?hidden=${!this.hasFooter} part="footer">
            <slot name="footer" @slotchange=${this.handleFooterChange}></slot>
          </footer>
        </div>
      </dialog>
    `
  }

  private handleCloseClick(): void {
    this.close()
  }

  private handleTriggerClick = (event: Event): void => {
    this.openModal(focusTargetFromEvent(event) ?? deepActiveElement())
  }

  private handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === this.dialog) this.close()
  }

  private handleKeyDown(event: KeyboardEvent): void {
    trapDialogFocus(event)
    if (event.key !== 'Escape' || event.defaultPrevented) return
    event.preventDefault()
    this.close()
  }

  private handleFooterChange(event: Event): void {
    const slot = event.currentTarget
    this.hasFooter =
      slot instanceof HTMLSlotElement &&
      slot
        .assignedNodes({ flatten: true })
        .some((node) =>
          node.nodeType === Node.TEXT_NODE
            ? Boolean(node.textContent?.trim())
            : node.nodeType === Node.ELEMENT_NODE,
        )
    this.requestUpdate()
  }

  private handleNativeClose(event: Event): void {
    const dialog = event.currentTarget
    if (!(dialog instanceof HTMLDialogElement)) return
    this.open = false
    this.releaseScrollLock()
    this.dispatchEvent(
      new CustomEvent<CadModalCloseDetail>('cad-modal-close', {
        bubbles: true,
        composed: true,
        detail: { returnValue: dialog.returnValue },
      }),
    )
    const returnFocus = this.returnFocus
    this.returnFocus = undefined
    if (returnFocus) focusElement(returnFocus)
  }

  private openModal(returnFocus: HTMLElement | undefined): void {
    if (this.open) return
    this.returnFocus = returnFocus
    this.open = true
  }

  private acquireScrollLock(): void {
    if (this.scrollLocked) return
    lockDocumentScroll()
    this.scrollLocked = true
  }

  private releaseScrollLock(): void {
    if (!this.scrollLocked) return
    unlockDocumentScroll()
    this.scrollLocked = false
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-modal')) {
  customElements.define('cad-modal', CadModal)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-modal': CadModal
  }
}
