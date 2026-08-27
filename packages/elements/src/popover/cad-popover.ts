import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

import { renderSystemIcon } from '../internal/system-icon.js'

export type CadPopoverPlacement =
  | 'auto'
  | 'bottom'
  | 'bottom-end'
  | 'bottom-start'
  | 'left'
  | 'right'
  | 'top'
  | 'top-end'
  | 'top-start'

export type CadPopoverSize = 'lg' | 'md' | 'sm'
export type CadPopoverCloseReason =
  'api' | 'close-button' | 'escape' | 'light-dismiss' | 'trigger'

export type CadPopoverOpenDetail = {
  anchor: string
  placement: CadPopoverPlacement
  resolvedPlacement: Exclude<CadPopoverPlacement, 'auto'>
}

export type CadPopoverCloseDetail = CadPopoverOpenDetail & {
  reason: CadPopoverCloseReason
}

export type CadPopoverOpenEvent = CustomEvent<CadPopoverOpenDetail>
export type CadPopoverCloseEvent = CustomEvent<CadPopoverCloseDetail>

type PopoverToggleEvent = Event & { newState?: 'closed' | 'open' }
type ResolvedPlacement = Exclude<CadPopoverPlacement, 'auto'>
type Side = 'bottom' | 'left' | 'right' | 'top'

const viewportPadding = 12
let popoverSequence = 0

function deepActiveElement(): HTMLElement | undefined {
  if (typeof document === 'undefined') return
  let active: Element | null = document.activeElement
  while (active instanceof HTMLElement && active.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement
  }
  return active instanceof HTMLElement ? active : undefined
}

function focusElement(element: HTMLElement): void {
  let target = element
  let nested = target.shadowRoot?.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  while (nested) {
    target = nested
    nested = target.shadowRoot?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
  }
  target.focus({ preventScroll: true })
}

function sideOf(placement: ResolvedPlacement): Side {
  return placement.split('-')[0] as Side
}

function alignedPlacement(
  side: Side,
  placement: ResolvedPlacement,
): ResolvedPlacement {
  if (!placement.includes('-')) return side
  return `${side}-${placement.endsWith('-start') ? 'start' : 'end'}` as ResolvedPlacement
}

/**
 * Interactive content anchored to an external control and rendered in the top layer.
 *
 * @slot - Popover content.
 * @slot heading - Optional visible heading. Falls back to the `heading` attribute.
 * @slot actions - Optional action row.
 * @fires cad-popover-open - Fired after the popover enters the top layer.
 * @fires cad-popover-close - Fired after the popover closes and reports why.
 * @csspart actions - Optional action row.
 * @csspart arrow - Decorative pointer toward the anchor.
 * @csspart base - Popover surface.
 * @csspart body - Main content.
 * @csspart close-button - Explicit dismiss button.
 * @csspart header - Heading and dismiss control.
 * @csspart title - Visible heading.
 * @cssprop --cad-popover-border - Per-instance border color.
 * @cssprop --cad-popover-surface - Per-instance surface color.
 */
export class CadPopover extends LitElement {
  static override properties = {
    anchor: { reflect: true, type: String },
    closeLabel: { attribute: 'close-label', type: String },
    dismissible: { reflect: true, type: Boolean },
    heading: { type: String },
    offset: { type: Number },
    open: { reflect: true, type: Boolean },
    placement: { reflect: true, type: String },
    size: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_popover-border: var(--cad-popover-border, var(--cad-link, #005bac));
      --_popover-surface: var(
        --cad-popover-surface,
        var(--cad-surface-raised, #fff)
      );
      --_popover-width: 22rem;
      position: fixed;
      inset: auto;
      display: none;
      box-sizing: border-box;
      width: min(var(--_popover-width), calc(100vw - 1.5rem));
      max-width: none;
      max-height: calc(100vh - 1.5rem);
      padding: 0;
      margin: 0;
      overflow: visible;
      color: var(--cad-ink, #162033);
      visibility: hidden;
      background: transparent;
      border: 0;
      border-radius: 0;
    }

    :host([size='sm']) {
      --_popover-width: 16rem;
    }

    :host([size='lg']) {
      --_popover-width: 32rem;
    }

    :host(:popover-open),
    :host([data-fallback-open]) {
      display: block;
    }

    :host([data-positioned]) {
      visibility: visible;
    }

    .base {
      position: relative;
      display: grid;
      box-sizing: border-box;
      max-height: calc(100vh - 1.5rem);
      overflow: visible;
      background: var(--_popover-surface);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_popover-border);
      border-radius: 0;
      box-shadow:
        0.2rem 0.24rem 0
          color-mix(in srgb, var(--_popover-border) 8%, transparent),
        0 0.65rem 1.8rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
      transform: rotate(-0.04deg);
    }

    .base::after {
      content: none;
    }

    .header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.65rem;
      align-items: start;
      padding: 0.95rem 1rem 0.35rem;
    }

    .header[hidden] {
      display: none;
    }

    .title {
      min-width: 0;
      margin: 0;
      color: var(--cad-link, #005bac);
      font-family: var(--cad-type-title-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.2;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .close {
      position: relative;
      z-index: 3;
      display: inline-grid;
      place-items: center;
      width: 1.9rem;
      height: 1.9rem;
      padding: 0;
      color: var(--_popover-border);
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

    .close:focus-visible,
    .base:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--cad-link, #005bac))
      );
      outline-offset: 3px;
    }

    .close svg {
      width: 1.15rem;
      height: 1.15rem;
    }

    .body {
      position: relative;
      z-index: 1;
      min-width: 0;
      padding: 0.6rem 1rem 1rem;
      overflow: auto;
      color: var(--cad-ink, #162033);
      font-family: var(--cad-type-body-font, var(--cad-font-book, serif));
      font-size: var(--cad-type-body-size, 1rem);
      line-height: var(--cad-type-body-line-height, 1.6);
    }

    .header[hidden] + .body {
      padding-top: 1rem;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    .actions {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
      justify-content: flex-end;
      margin-inline: 0.75rem;
      padding: 0.7rem 0.25rem 0.8rem;
      border-top: 1px dashed
        color-mix(in srgb, var(--_popover-border) 43%, transparent);
    }

    .actions[hidden] {
      display: none;
    }

    .arrow {
      position: absolute;
      z-index: 4;
      box-sizing: border-box;
      width: 0.8rem;
      height: 0.8rem;
      background: var(--_popover-surface);
      border: solid var(--_popover-border);
      pointer-events: none;
    }

    :host([data-resolved-placement^='bottom']) .arrow {
      top: -0.42rem;
      left: var(--_popover-arrow-offset, 50%);
      border-width: 1.5px 0 0 1.5px;
      transform: translateX(-50%) rotate(45deg);
    }

    :host([data-resolved-placement^='top']) .arrow {
      bottom: -0.42rem;
      left: var(--_popover-arrow-offset, 50%);
      border-width: 0 1.5px 1.5px 0;
      transform: translateX(-50%) rotate(45deg);
    }

    :host([data-resolved-placement='right']) .arrow {
      top: var(--_popover-arrow-offset, 50%);
      left: -0.42rem;
      border-width: 0 0 1.5px 1.5px;
      transform: translateY(-50%) rotate(45deg);
    }

    :host([data-resolved-placement='left']) .arrow {
      top: var(--_popover-arrow-offset, 50%);
      right: -0.42rem;
      border-width: 1.5px 1.5px 0 0;
      transform: translateY(-50%) rotate(45deg);
    }

    @media (prefers-reduced-motion: no-preference) {
      :host(:popover-open) .base,
      :host([data-fallback-open]) .base {
        animation: cad-popover-enter
          var(--cad-motion-duration-enter, var(--cad-duration-fast, 180ms))
          var(--cad-motion-ease-enter, ease-out);
      }
    }

    @keyframes cad-popover-enter {
      from {
        opacity: 0;
        transform: translateY(0.2rem) rotate(-0.25deg) scale(0.985);
      }

      to {
        opacity: 1;
        transform: translateY(0) rotate(-0.04deg) scale(1);
      }
    }

    @media (forced-colors: active) {
      .base,
      .arrow {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }
    }
  `

  declare anchor: string
  declare closeLabel: string
  declare dismissible: boolean
  declare heading: string
  declare offset: number
  declare open: boolean
  declare placement: CadPopoverPlacement
  declare size: CadPopoverSize

  private anchorElement: HTMLElement | undefined
  private closeReason: CadPopoverCloseReason = 'api'
  private hasActions = false
  private hasHeading = false
  private focusFrame = 0
  private notifiedOpen = false
  private positionFrame = 0
  private returnFocus: HTMLElement | undefined
  private resolvedPlacement: ResolvedPlacement = 'bottom'
  private previousAnchorAttributes:
    | Record<'aria-controls' | 'aria-expanded' | 'aria-haspopup', string | null>
    | undefined

  constructor() {
    super()
    this.anchor = ''
    this.closeLabel = 'Close popover'
    this.dismissible = true
    this.heading = ''
    this.offset = 10
    this.open = false
    this.placement = 'bottom'
    this.size = 'md'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.id) this.id = `cad-popover-${++popoverSequence}`
    if (!this.hasAttribute('popover')) this.setAttribute('popover', 'auto')
    if (!this.hasAttribute('role')) this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', 'false')
    this.addEventListener('toggle', this.handleNativeToggle)
    queueMicrotask(() => this.syncAnchor())
  }

  override disconnectedCallback(): void {
    this.removeEventListener('toggle', this.handleNativeToggle)
    this.unbindAnchor()
    this.stopWatchingViewport()
    super.disconnectedCallback()
  }

  show(): void {
    if (this.isActuallyOpen()) return
    this.returnFocus = deepActiveElement() ?? this.anchorElement
    this.removeAttribute('data-positioned')
    this.closeReason = 'api'

    if (typeof this.showPopover === 'function') {
      this.open = true
      this.syncAnchorState(true)
      try {
        this.showPopover()
      } catch (error) {
        this.open = false
        this.syncAnchorState(false)
        throw error
      }
      this.completeToggle(true)
      return
    }

    this.setAttribute('data-fallback-open', '')
    this.completeToggle(true)
  }

  hide(reason: CadPopoverCloseReason = 'api'): void {
    if (!this.isActuallyOpen() && !this.open) return
    this.closeReason = reason
    if (
      typeof this.hidePopover === 'function' &&
      this.matches(':popover-open')
    ) {
      this.open = false
      this.syncAnchorState(false)
      this.hidePopover()
      this.completeToggle(false)
      return
    }

    this.removeAttribute('data-fallback-open')
    this.completeToggle(false)
  }

  toggle(): void {
    if (this.isActuallyOpen() || this.open) {
      this.hide('trigger')
    } else {
      this.show()
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('anchor')) this.syncAnchor()

    if (
      changed.has('heading') &&
      this.heading &&
      !this.hasAttribute('aria-label') &&
      !this.hasAttribute('aria-labelledby')
    ) {
      this.setAttribute('aria-label', this.heading)
    }

    if (
      changed.has('placement') ||
      changed.has('offset') ||
      changed.has('size')
    ) {
      if (this.isActuallyOpen()) this.schedulePosition()
    }

    if (!changed.has('open')) return
    if (this.open && !this.isActuallyOpen()) this.show()
    if (!this.open && this.isActuallyOpen()) this.hide('api')
  }

  override render() {
    const showHeader = this.dismissible || this.heading || this.hasHeading
    return html`
      <section class="base" part="base" tabindex="-1">
        <span aria-hidden="true" class="arrow" part="arrow"></span>
        <header ?hidden=${!showHeader} class="header" part="header">
          <div class="title" part="title">
            <slot name="heading" @slotchange=${this.handleHeadingChange}
              >${this.heading}</slot
            >
          </div>
          ${
            this.dismissible
              ? html`<button
                  aria-label=${this.closeLabel}
                  class="close"
                  part="close-button"
                  type="button"
                  @click=${this.handleCloseClick}
                >
                  ${renderSystemIcon('close')}
                </button>`
              : nothing
          }
        </header>
        <div class="body" part="body"><slot></slot></div>
        <footer ?hidden=${!this.hasActions} class="actions" part="actions">
          <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
        </footer>
      </section>
    `
  }

  private handleNativeToggle = (event: Event): void => {
    const nextState = (event as PopoverToggleEvent).newState
    this.completeToggle(
      nextState ? nextState === 'open' : this.matches(':popover-open'),
    )
  }

  private completeToggle(isOpen: boolean): void {
    if (!isOpen && !this.notifiedOpen && !this.returnFocus) {
      this.open = false
      this.syncAnchorState(false)
      return
    }
    if (this.open !== isOpen) this.open = isOpen
    this.syncAnchorState(isOpen)

    if (isOpen) {
      this.startWatchingViewport()
      this.schedulePosition()
      this.scheduleInitialFocus()
      if (!this.notifiedOpen) {
        this.notifiedOpen = true
        this.dispatchEvent(
          new CustomEvent<CadPopoverOpenDetail>('cad-popover-open', {
            bubbles: true,
            composed: true,
            detail: this.openDetail(),
          }),
        )
      }
      return
    }

    this.removeAttribute('data-positioned')
    this.stopWatchingViewport()
    if (this.notifiedOpen) {
      this.notifiedOpen = false
      this.dispatchEvent(
        new CustomEvent<CadPopoverCloseDetail>('cad-popover-close', {
          bubbles: true,
          composed: true,
          detail: { ...this.openDetail(), reason: this.closeReason },
        }),
      )
    }
    const returnFocus = this.returnFocus ?? this.anchorElement
    this.returnFocus = undefined
    this.closeReason = 'api'
    if (returnFocus?.isConnected) focusElement(returnFocus)
  }

  private openDetail(): CadPopoverOpenDetail {
    return {
      anchor: this.anchor,
      placement: this.placement,
      resolvedPlacement: this.resolvedPlacement,
    }
  }

  private handleAnchorClick = (): void => {
    this.toggle()
  }

  private handleCloseClick(): void {
    this.hide('close-button')
  }

  private handleHeadingChange(event: Event): void {
    const slot = event.currentTarget
    this.hasHeading =
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

  private handleActionsChange(event: Event): void {
    const slot = event.currentTarget
    this.hasActions =
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

  private syncAnchor(): void {
    const next = this.anchor
      ? (this.ownerDocument.getElementById(this.anchor) ?? undefined)
      : undefined
    if (next === this.anchorElement) {
      this.syncAnchorState()
      return
    }

    this.unbindAnchor()
    if (!next) return
    this.anchorElement = next
    this.previousAnchorAttributes = {
      'aria-controls': next.getAttribute('aria-controls'),
      'aria-expanded': next.getAttribute('aria-expanded'),
      'aria-haspopup': next.getAttribute('aria-haspopup'),
    }
    next.addEventListener('click', this.handleAnchorClick)
    this.syncAnchorState()
  }

  private syncAnchorState(expanded = this.isActuallyOpen() || this.open): void {
    if (!this.anchorElement) return
    this.anchorElement.setAttribute('aria-controls', this.id)
    this.anchorElement.setAttribute(
      'aria-expanded',
      expanded ? 'true' : 'false',
    )
    this.anchorElement.setAttribute(
      'aria-haspopup',
      this.getAttribute('role') === 'menu' ? 'menu' : 'dialog',
    )
  }

  private unbindAnchor(): void {
    const anchor = this.anchorElement
    const previous = this.previousAnchorAttributes
    if (!anchor) return
    anchor.removeEventListener('click', this.handleAnchorClick)
    if (previous) {
      for (const [name, value] of Object.entries(previous)) {
        if (value === null) anchor.removeAttribute(name)
        else anchor.setAttribute(name, value)
      }
    }
    this.anchorElement = undefined
    this.previousAnchorAttributes = undefined
  }

  private isActuallyOpen(): boolean {
    if (this.hasAttribute('data-fallback-open')) return true
    if (typeof this.showPopover !== 'function') return false
    try {
      return this.matches(':popover-open')
    } catch {
      return false
    }
  }

  private startWatchingViewport(): void {
    window.addEventListener('resize', this.handleViewportChange)
    window.addEventListener('scroll', this.handleViewportChange, true)
    document.addEventListener('keydown', this.handleDocumentKeyDown, true)
    document.addEventListener(
      'pointerdown',
      this.handleDocumentPointerDown,
      true,
    )
  }

  private stopWatchingViewport(): void {
    window.removeEventListener('resize', this.handleViewportChange)
    window.removeEventListener('scroll', this.handleViewportChange, true)
    document.removeEventListener('keydown', this.handleDocumentKeyDown, true)
    document.removeEventListener(
      'pointerdown',
      this.handleDocumentPointerDown,
      true,
    )
    if (this.positionFrame && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.positionFrame)
    }
    if (this.focusFrame && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.focusFrame)
    }
    this.focusFrame = 0
    this.positionFrame = 0
  }

  private handleViewportChange = (): void => {
    this.schedulePosition()
  }

  private handleDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || event.defaultPrevented) return
    this.hide('escape')
  }

  private handleDocumentPointerDown = (event: PointerEvent): void => {
    const path = event.composedPath()
    if (
      path.includes(this) ||
      (this.anchorElement && path.includes(this.anchorElement))
    ) {
      return
    }
    this.hide('light-dismiss')
  }

  private schedulePosition(): void {
    if (this.positionFrame) return
    const position = (): void => {
      this.positionFrame = 0
      this.updatePosition()
    }
    if (typeof requestAnimationFrame === 'function') {
      this.positionFrame = requestAnimationFrame(position)
    } else {
      queueMicrotask(position)
    }
  }

  private scheduleInitialFocus(): void {
    if (this.focusFrame) return
    void this.updateComplete.then(() => {
      if (!this.isActuallyOpen() && !this.open) return
      if (typeof requestAnimationFrame === 'function') {
        this.focusFrame = requestAnimationFrame(() => {
          this.focusFrame = 0
          this.focusInitialTarget()
        })
      } else {
        queueMicrotask(() => this.focusInitialTarget())
      }
    })
  }

  private updatePosition(): void {
    const anchor = this.anchorElement
    if (!anchor || (!this.isActuallyOpen() && !this.open)) return
    const anchorRect = anchor.getBoundingClientRect()
    const popoverRect = this.getBoundingClientRect()
    const width = popoverRect.width
    const height = popoverRect.height
    if (!width || !height) return

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const space = {
      bottom: viewportHeight - anchorRect.bottom,
      left: anchorRect.left,
      right: viewportWidth - anchorRect.right,
      top: anchorRect.top,
    }

    const resolved = this.resolvePlacement(space, width, height)
    let side = sideOf(resolved)
    let left: number
    let top: number

    if (side === 'top' || side === 'bottom') {
      top =
        side === 'top'
          ? anchorRect.top - height - this.offset
          : anchorRect.bottom + this.offset
      left = resolved.endsWith('-start')
        ? anchorRect.left
        : resolved.endsWith('-end')
          ? anchorRect.right - width
          : anchorRect.left + (anchorRect.width - width) / 2
    } else {
      left =
        side === 'left'
          ? anchorRect.left - width - this.offset
          : anchorRect.right + this.offset
      top = anchorRect.top + (anchorRect.height - height) / 2
    }

    left = Math.max(
      viewportPadding,
      Math.min(left, viewportWidth - width - viewportPadding),
    )
    top = Math.max(
      viewportPadding,
      Math.min(top, viewportHeight - height - viewportPadding),
    )

    side = sideOf(resolved)
    const arrowOffset =
      side === 'top' || side === 'bottom'
        ? Math.max(
            16,
            Math.min(anchorRect.left + anchorRect.width / 2 - left, width - 16),
          )
        : Math.max(
            16,
            Math.min(anchorRect.top + anchorRect.height / 2 - top, height - 16),
          )

    this.resolvedPlacement = resolved
    this.dataset.resolvedPlacement = resolved
    this.style.left = `${Math.round(left * 10) / 10}px`
    this.style.top = `${Math.round(top * 10) / 10}px`
    this.style.setProperty('--_popover-arrow-offset', `${arrowOffset}px`)
    this.setAttribute('data-positioned', '')
  }

  private resolvePlacement(
    space: Record<Side, number>,
    width: number,
    height: number,
  ): ResolvedPlacement {
    if (this.placement === 'auto') {
      const needed: Record<Side, number> = {
        bottom: height,
        left: width,
        right: width,
        top: height,
      }
      const preferred = (['bottom', 'top', 'right', 'left'] as const).find(
        (side) => space[side] >= needed[side] + this.offset + viewportPadding,
      )
      return (
        preferred ??
        (Object.entries(space).sort((a, b) => b[1] - a[1])[0]?.[0] as Side) ??
        'bottom'
      )
    }

    const requested = this.placement
    const side = sideOf(requested)
    const opposite: Record<Side, Side> = {
      bottom: 'top',
      left: 'right',
      right: 'left',
      top: 'bottom',
    }
    const required = side === 'top' || side === 'bottom' ? height : width
    if (
      space[side] < required + this.offset + viewportPadding &&
      space[opposite[side]] > space[side]
    ) {
      return alignedPlacement(opposite[side], requested)
    }
    return requested
  }

  private focusInitialTarget(): void {
    if (!this.isActuallyOpen() && !this.open) return
    const selector = [
      '[autofocus]',
      '[role="menuitem"]',
      'button',
      'cad-button',
      '[href]',
      'cad-link',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')
    const target = this.querySelector<HTMLElement>(selector)
    if (target) {
      focusElement(target)
      return
    }
    const closeButton = this.renderRoot.querySelector<HTMLElement>('.close')
    if (closeButton) {
      closeButton.focus({ preventScroll: true })
      return
    }
    this.renderRoot
      .querySelector<HTMLElement>('.base')
      ?.focus({ preventScroll: true })
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-popover')
) {
  customElements.define('cad-popover', CadPopover)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-popover': CadPopover
  }
}
