import { css, html, LitElement, type PropertyValues } from 'lit'

import {
  deepActiveElement,
  focusElement,
  focusTargetFromEvent,
  lockDocumentScroll,
  trapDialogFocus,
  unlockDocumentScroll,
} from '../internal/dialog-layer.js'
import { renderSystemIcon } from '../internal/system-icon.js'

export type CadDrawerPlacement = 'bottom' | 'left' | 'right' | 'top'
export type CadDrawerSize = 'lg' | 'md' | 'sm'
export type CadDrawerCloseReason =
  'api' | 'backdrop' | 'close-button' | 'escape'

export type CadDrawerOpenDetail = {
  placement: CadDrawerPlacement
  size: CadDrawerSize
}

export type CadDrawerCloseDetail = CadDrawerOpenDetail & {
  reason: CadDrawerCloseReason
}

export type CadDrawerOpenEvent = CustomEvent<CadDrawerOpenDetail>
export type CadDrawerCloseEvent = CustomEvent<CadDrawerCloseDetail>

/**
 * A modal panel that enters from a viewport edge for a focused supporting task.
 *
 * @slot - Scrollable drawer content.
 * @slot trigger - Optional element that opens the drawer when activated.
 * @slot title - Drawer heading. Falls back to the `heading` attribute.
 * @slot footer - Supporting actions anchored to the drawer edge.
 * @fires cad-drawer-close - Fired after the drawer closes and reports why.
 * @fires cad-drawer-open - Fired after the drawer opens.
 * @csspart base - Native dialog covering the viewport.
 * @csspart body - Scrollable content area.
 * @csspart close-button - Explicit dismiss button.
 * @csspart footer - Optional action area.
 * @csspart handle - Decorative bottom-drawer drag affordance.
 * @csspart header - Heading and dismiss control.
 * @csspart panel - Drawer surface.
 * @csspart title - Visible heading.
 * @csspart trigger - Trigger slot container.
 * @cssprop --cad-drawer-border - Per-instance panel border color.
 * @cssprop --cad-drawer-size - Per-instance width or height override.
 * @cssprop --cad-drawer-surface - Per-instance panel surface color.
 */
export class CadDrawer extends LitElement {
  static override properties = {
    closeLabel: { attribute: 'close-label', type: String },
    closeOnBackdrop: {
      attribute: 'close-on-backdrop',
      converter: {
        fromAttribute: (value: string | null) => value !== 'false',
        toAttribute: (value: boolean) => (value ? '' : 'false'),
      },
      reflect: true,
    },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    placement: { reflect: true, type: String },
    size: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_drawer-border: var(--cad-drawer-border, var(--cad-link, #005bac));
      --_drawer-surface: var(
        --cad-drawer-surface,
        var(--cad-surface-raised, #fff)
      );
      --_drawer-width: var(--cad-drawer-size, 30rem);
      --_drawer-height: var(--cad-drawer-size, 22rem);
      display: contents;
    }

    :host([size='sm']) {
      --_drawer-width: var(--cad-drawer-size, 20rem);
      --_drawer-height: var(--cad-drawer-size, 14rem);
    }

    :host([size='lg']) {
      --_drawer-width: var(--cad-drawer-size, 40rem);
      --_drawer-height: var(--cad-drawer-size, 32rem);
    }

    .trigger {
      display: inline-flex;
    }

    .base {
      position: fixed;
      inset: 0;
      box-sizing: border-box;
      width: 100vw;
      max-width: none;
      height: 100dvh;
      max-height: none;
      padding: 0;
      margin: 0;
      overflow: hidden;
      color: var(--cad-ink, #162033);
      background: transparent;
      border: 0;
      border-radius: 0;
    }

    .base[open] {
      display: flex;
      justify-content: flex-end;
    }

    .base::backdrop {
      background-color: color-mix(
        in srgb,
        var(--cad-link, #005bac) 8%,
        rgb(255 255 255 / 0.78)
      );
      background-image: repeating-linear-gradient(
        -14deg,
        transparent 0 6px,
        color-mix(in srgb, var(--cad-link, #005bac) 5%, transparent) 6px 7px
      );
      backdrop-filter: blur(1.5px);
    }

    .panel {
      position: relative;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      box-sizing: border-box;
      width: min(var(--_drawer-width), 100vw);
      height: 100dvh;
      overflow: hidden;
      background: var(--_drawer-surface);
      border: 1.5px solid var(--_drawer-border);
      border-block: 0;
      border-inline-end: 0;
      border-radius: 0;
      box-shadow: -0.3rem 0 0
        color-mix(in srgb, var(--_drawer-border) 8%, transparent);
    }

    .panel::after {
      position: absolute;
      z-index: 4;
      inset: 0.08rem 0.05rem -0.05rem 0.08rem;
      border: 0.7px solid
        color-mix(in srgb, var(--_drawer-border) 38%, transparent);
      content: '';
      pointer-events: none;
      transform: rotate(-0.035deg);
    }

    :host([placement='left']) .base {
      justify-content: flex-start;
    }

    :host([placement='left']) .panel {
      border-inline-start: 0;
      border-inline-end: 1.5px solid var(--_drawer-border);
      box-shadow: 0.3rem 0 0
        color-mix(in srgb, var(--_drawer-border) 8%, transparent);
    }

    :host([placement='top']) .base,
    :host([placement='bottom']) .base {
      flex-direction: column;
      justify-content: flex-start;
    }

    :host([placement='bottom']) .base {
      justify-content: flex-end;
    }

    :host([placement='top']) .panel,
    :host([placement='bottom']) .panel {
      width: 100vw;
      height: min(var(--_drawer-height), 92dvh);
      border-inline: 0;
      border-block: 0;
      border-block-end: 1.5px solid var(--_drawer-border);
      box-shadow: 0 0.3rem 0
        color-mix(in srgb, var(--_drawer-border) 8%, transparent);
    }

    :host([placement='bottom']) .panel {
      border-block-start: 1.5px solid var(--_drawer-border);
      border-block-end: 0;
      box-shadow: 0 -0.3rem 0
        color-mix(in srgb, var(--_drawer-border) 8%, transparent);
    }

    .header {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.8rem;
      align-items: center;
      min-width: 0;
      padding: max(1rem, env(safe-area-inset-top)) 1.15rem 0.75rem;
      border-bottom: 1px dashed
        color-mix(in srgb, var(--_drawer-border) 42%, transparent);
    }

    :host([placement='bottom']) .header {
      padding-top: max(1.55rem, env(safe-area-inset-top));
    }

    .handle {
      position: absolute;
      top: 0.48rem;
      left: 50%;
      display: none;
      width: 2.8rem;
      height: 0.2rem;
      background: color-mix(in srgb, var(--_drawer-border) 58%, transparent);
      transform: translateX(-50%) rotate(-0.8deg);
    }

    :host([placement='bottom']) .handle {
      display: block;
    }

    .title {
      min-width: 0;
      margin: 0;
      color: var(--cad-link, #005bac);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.4rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .title:focus {
      outline: 0;
    }

    .close {
      position: relative;
      z-index: 5;
      display: inline-grid;
      place-items: center;
      width: 2.15rem;
      height: 2.15rem;
      padding: 0;
      color: var(--_drawer-border);
      cursor: pointer;
      background: transparent;
      border: 0;
      border-radius: 0;
      transition:
        background-color
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease);
    }

    .close:hover {
      background: color-mix(in srgb, currentColor 9%, transparent);
      transform: rotate(5deg);
    }

    .close:active {
      transform: rotate(-4deg) scale(0.92);
    }

    .close:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--cad-link, #005bac))
      );
      outline-offset: 3px;
    }

    .close svg {
      width: 1.2rem;
      height: 1.2rem;
    }

    .body {
      position: relative;
      z-index: 1;
      min-width: 0;
      padding: 1rem 1.15rem 1.25rem;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
      color: var(--cad-ink, #162033);
      font-family: var(--cad-font-book, serif);
      font-size: var(--cad-book-sm, 0.95rem);
      line-height: 1.55;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    .footer {
      position: relative;
      z-index: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      justify-content: space-between;
      padding: 0.8rem 1.15rem max(1rem, env(safe-area-inset-bottom));
      background: var(--_drawer-surface);
      border-top: 1px dashed
        color-mix(in srgb, var(--_drawer-border) 42%, transparent);
    }

    .footer[hidden] {
      display: none;
    }

    ::slotted([slot='footer']:only-child) {
      margin-inline-start: auto;
    }

    @media (prefers-reduced-motion: no-preference) {
      .base[open]::backdrop {
        animation: cad-drawer-backdrop-enter
          var(--cad-motion-duration-enter, var(--cad-duration-fast, 180ms))
          var(--cad-motion-ease-enter, ease-out);
      }

      :host(:not([placement])) .base[open] .panel,
      :host([placement='right']) .base[open] .panel {
        animation: cad-drawer-enter-right
          var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
          var(--cad-motion-ease-enter, ease-out);
      }

      :host([placement='left']) .base[open] .panel {
        animation: cad-drawer-enter-left
          var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
          var(--cad-motion-ease-enter, ease-out);
      }

      :host([placement='top']) .base[open] .panel {
        animation: cad-drawer-enter-top
          var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
          var(--cad-motion-ease-enter, ease-out);
      }

      :host([placement='bottom']) .base[open] .panel {
        animation: cad-drawer-enter-bottom
          var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
          var(--cad-motion-ease-enter, ease-out);
      }
    }

    @keyframes cad-drawer-enter-right {
      from {
        transform: translateX(100%);
      }
    }

    @keyframes cad-drawer-enter-left {
      from {
        transform: translateX(-100%);
      }
    }

    @keyframes cad-drawer-enter-top {
      from {
        transform: translateY(-100%);
      }
    }

    @keyframes cad-drawer-enter-bottom {
      from {
        transform: translateY(100%);
      }
    }

    @keyframes cad-drawer-backdrop-enter {
      from {
        background: transparent;
        backdrop-filter: blur(0);
      }
    }

    @media (width <= 36rem) {
      :host([placement='left']) .panel,
      :host([placement='right']) .panel,
      :host(:not([placement])) .panel {
        width: min(var(--_drawer-width), calc(100vw - 1rem));
      }
    }

    @media (forced-colors: active) {
      .panel,
      .close {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }
    }
  `

  declare closeLabel: string
  declare closeOnBackdrop: boolean
  declare heading: string
  declare open: boolean
  declare placement: CadDrawerPlacement
  declare size: CadDrawerSize

  private closeReason: CadDrawerCloseReason = 'api'
  private hasFooter = false
  private returnFocus: HTMLElement | undefined
  private scrollLocked = false
  private triggerBound = false

  constructor() {
    super()
    this.closeLabel = 'Close drawer'
    this.closeOnBackdrop = true
    this.heading = ''
    this.open = false
    this.placement = 'right'
    this.size = 'md'
  }

  override disconnectedCallback(): void {
    this.releaseScrollLock()
    super.disconnectedCallback()
  }

  get dialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog')
  }

  show(): void {
    this.openDrawer(deepActiveElement())
  }

  close(reason: CadDrawerCloseReason = 'api'): void {
    if (!this.open && !this.dialog?.open) return
    this.closeReason = reason
    this.open = false
    this.releaseScrollLock()
    if (this.dialog?.open) this.dialog.close()
  }

  toggle(): void {
    if (this.open || this.dialog?.open) this.close('api')
    else this.show()
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (!this.triggerBound) {
      const triggerSlot = this.renderRoot.querySelector('slot[name="trigger"]')
      triggerSlot?.addEventListener('click', this.handleTriggerClick)
      this.triggerBound = Boolean(triggerSlot)
    }
    if (!changed.has('open')) return
    const dialog = this.dialog
    if (!dialog) return

    if (this.open && !dialog.open) {
      if (!this.returnFocus) this.returnFocus = deepActiveElement()
      try {
        dialog.showModal()
      } catch (error) {
        this.open = false
        this.returnFocus = undefined
        throw error
      }
      this.acquireScrollLock()
      this.renderRoot
        .querySelector<HTMLElement>('.title')
        ?.focus({ preventScroll: true })
      this.dispatchEvent(
        new CustomEvent<CadDrawerOpenDetail>('cad-drawer-open', {
          bubbles: true,
          composed: true,
          detail: this.eventDetail(),
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
        aria-labelledby="drawer-title"
        aria-modal="true"
        class="base"
        part="base"
        @cancel=${this.handleCancel}
        @close=${this.handleNativeClose}
        @keydown=${trapDialogFocus}
        @pointerdown=${this.handleBackdropPointerDown}
      >
        <section class="panel" part="panel">
          <header class="header" part="header">
            <span aria-hidden="true" class="handle" part="handle"></span>
            <div class="title" id="drawer-title" part="title" tabindex="-1">
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
        </section>
      </dialog>
    `
  }

  private eventDetail(): CadDrawerOpenDetail {
    return { placement: this.placement, size: this.size }
  }

  private handleTriggerClick = (event: Event): void => {
    this.openDrawer(focusTargetFromEvent(event) ?? deepActiveElement())
  }

  private handleCloseClick(): void {
    this.close('close-button')
  }

  private handleCancel(event: Event): void {
    event.preventDefault()
    this.close('escape')
  }

  private handleBackdropPointerDown(event: PointerEvent): void {
    if (this.closeOnBackdrop && event.target === this.dialog) {
      this.close('backdrop')
    }
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
    if (!(event.currentTarget instanceof HTMLDialogElement)) return
    this.open = false
    this.releaseScrollLock()
    this.dispatchEvent(
      new CustomEvent<CadDrawerCloseDetail>('cad-drawer-close', {
        bubbles: true,
        composed: true,
        detail: { ...this.eventDetail(), reason: this.closeReason },
      }),
    )
    const returnFocus = this.returnFocus
    this.returnFocus = undefined
    this.closeReason = 'api'
    if (returnFocus?.isConnected) focusElement(returnFocus)
  }

  private openDrawer(returnFocus: HTMLElement | undefined): void {
    if (this.open || this.dialog?.open) return
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

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-drawer')
) {
  customElements.define('cad-drawer', CadDrawer)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-drawer': CadDrawer
  }
}
