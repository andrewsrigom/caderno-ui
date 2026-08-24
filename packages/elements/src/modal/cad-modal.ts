import { css, html, LitElement, type PropertyValues } from 'lit'

import '../icon/cad-icon.js'

export type CadModalSize = 'lg' | 'md' | 'sm'

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
 * @csspart paper - Notebook paper surface.
 * @csspart tape - Decorative tape strip.
 * @csspart title - Dialog heading.
 * @csspart trigger - Trigger slot container.
 */
export class CadModal extends LitElement {
  static override properties = {
    closeLabel: { attribute: 'close-label', type: String },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    size: { reflect: true, type: String },
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
      width: min(calc(100% - 2rem), 36rem);
      max-width: none;
      max-height: min(82vh, 46rem);
      padding: 0;
      overflow: visible;
      color: var(--cad-ink, #25202a);
      background: transparent;
      border: 0;
    }

    :host([size='sm']) .base {
      width: min(calc(100% - 2rem), 26rem);
    }

    :host([size='lg']) .base {
      width: min(calc(100% - 2rem), 52rem);
    }

    .base::backdrop {
      background: rgb(var(--cad-shadow-rgb, 0 0 0) / 0.48);
      backdrop-filter: blur(3px);
    }

    .paper {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      max-height: min(82vh, 46rem);
      overflow: hidden;
      background: var(--cad-surface, #fffdf5);
      border: 1.5px solid var(--cad-line-strong, #665f52);
      border-radius: 0.9rem 1.15rem 0.85rem 1rem;
      box-shadow: 0 1.2rem 3rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.28);
      transform: rotate(-0.25deg);
    }

    .tape {
      position: absolute;
      z-index: 1;
      top: -0.2rem;
      left: 50%;
      width: 5.4rem;
      height: 1rem;
      background: color-mix(
        in srgb,
        var(--cad-tape-paper-bg, #f2e6bd) 72%,
        transparent
      );
      transform: translateX(-50%) rotate(0.25deg);
    }

    .header {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      min-width: 0;
      padding: 1.45rem 1.5rem 0.85rem;
      border-bottom: 1px dashed var(--cad-line-strong, #665f52);
    }

    .title {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-xl, 2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
    }

    .close {
      display: inline-grid;
      flex: 0 0 auto;
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
      background: color-mix(in srgb, currentColor 10%, transparent);
    }

    .close:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }

    .body {
      min-width: 0;
      padding: 1.25rem 1.5rem;
      overflow: auto;
      font-family: var(--cad-font-book, serif);
      line-height: 1.65;
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
      justify-content: flex-end;
      padding: 0.9rem 1.5rem 1.25rem;
      border-top: 1px dashed var(--cad-line-strong, #665f52);
    }

    .footer[hidden] {
      display: none;
    }

    @media (width <= 36rem) {
      .header,
      .body,
      .footer {
        padding-inline: 1rem;
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

  private hasFooter = false
  private returnFocus: HTMLElement | undefined
  private triggerBound = false

  constructor() {
    super()
    this.closeLabel = 'Close dialog'
    this.closeOnBackdrop = true
    this.heading = ''
    this.open = false
    this.size = 'md'
  }

  get dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog')
  }

  showModal(): void {
    if (this.open) return
    this.returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined
    this.open = true
  }

  close(returnValue = ''): void {
    const dialog = this.dialog
    this.open = false
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
    return html`
      <span class="trigger" part="trigger">
        <slot name="trigger"></slot>
      </span>
      <dialog
        aria-labelledby="modal-title"
        class="base"
        part="base"
        @pointerdown=${this.handleBackdropClick}
        @close=${this.handleNativeClose}
      >
        <div class="paper" part="paper">
          <span aria-hidden="true" class="tape" part="tape"></span>
          <header class="header" part="header">
            <h2 class="title" id="modal-title" part="title">
              <slot name="title">${this.heading}</slot>
            </h2>
            <button
              aria-label=${this.closeLabel}
              class="close"
              part="close-button"
              type="button"
              @click=${this.handleCloseClick}
            >
              <cad-icon name="cross" size="20"></cad-icon>
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

  private handleTriggerClick = (): void => {
    this.showModal()
  }

  private handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === this.dialog) this.close()
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
    this.dispatchEvent(
      new CustomEvent<CadModalCloseDetail>('cad-modal-close', {
        bubbles: true,
        composed: true,
        detail: { returnValue: dialog.returnValue },
      }),
    )
    const returnFocus = this.returnFocus
    this.returnFocus = undefined
    returnFocus?.focus()
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
