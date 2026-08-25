import { css, html, LitElement } from 'lit'

export type CadTooltipPosition = 'bottom' | 'left' | 'right' | 'top'

let tooltipSequence = 0

/**
 * A short, non-interactive description revealed on hover or keyboard focus.
 *
 * @slot - Tooltip trigger. Use one naturally focusable element.
 * @slot content - Rich tooltip text. Falls back to the `text` attribute.
 * @csspart base - Tooltip positioning container.
 * @csspart bubble - Tooltip surface.
 * @csspart trigger - Trigger slot container.
 * @cssprop --cad-tooltip-bg - Per-instance tooltip background.
 * @cssprop --cad-tooltip-ink - Per-instance tooltip foreground.
 * @cssprop --cad-tooltip-z-index - Per-instance tooltip stacking level.
 */
export class CadTooltip extends LitElement {
  static override properties = {
    open: { reflect: true, type: Boolean },
    position: { reflect: true, type: String },
    text: { type: String },
  }

  static override styles = css`
    :host {
      --_tooltip-bg: var(
        --cad-tooltip-bg,
        var(--cad-post-it-lemon-bg, #fff1ac)
      );
      --_tooltip-ink: var(
        --cad-tooltip-ink,
        var(--cad-post-it-lemon-ink, #51491f)
      );
      display: inline-flex;
    }

    .base,
    .trigger {
      position: relative;
      display: inline-flex;
    }

    .bubble {
      position: absolute;
      z-index: var(--cad-tooltip-z-index, 40);
      display: none;
      width: max-content;
      max-width: min(16rem, 76vw);
      padding: 0.45rem 0.7rem 0.5rem;
      color: var(--_tooltip-ink);
      visibility: hidden;
      background: var(--_tooltip-bg);
      border: 1px solid color-mix(in srgb, var(--_tooltip-ink) 34%, transparent);
      border-radius: 0.45rem 0.6rem 0.4rem 0.55rem;
      box-shadow: 0 0.45rem 0.9rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.14);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1.2;
      opacity: 0;
      pointer-events: none;
      transition:
        opacity
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 120ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 120ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        visibility 0s linear
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 120ms));
    }

    :host([open]) .bubble {
      display: block;
      visibility: visible;
      opacity: 1;
      transition-delay: 0s;
    }

    :host([position='top']) .bubble,
    :host(:not([position])) .bubble {
      bottom: calc(100% + 0.55rem);
      left: 50%;
      transform: translate(-50%, 0.25rem) rotate(-0.3deg);
    }

    :host([position='bottom']) .bubble {
      top: calc(100% + 0.55rem);
      left: 50%;
      transform: translate(-50%, -0.25rem) rotate(0.3deg);
    }

    :host([position='left']) .bubble {
      top: 50%;
      right: calc(100% + 0.55rem);
      transform: translate(0.25rem, -50%) rotate(-0.3deg);
    }

    :host([position='right']) .bubble {
      top: 50%;
      left: calc(100% + 0.55rem);
      transform: translate(-0.25rem, -50%) rotate(0.3deg);
    }

    :host([open][position='top']) .bubble,
    :host([open]:not([position])) .bubble,
    :host([open][position='bottom']) .bubble {
      transform: translate(-50%, 0) rotate(0deg);
    }

    :host([open][position='left']) .bubble,
    :host([open][position='right']) .bubble {
      transform: translate(0, -50%) rotate(0deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .bubble {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .bubble {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }
    }
  `

  declare open: boolean
  declare position: CadTooltipPosition
  declare text: string

  private readonly tooltipId: string
  private describedElement: HTMLElement | undefined

  constructor() {
    super()
    this.open = false
    this.position = 'top'
    this.text = ''
    tooltipSequence += 1
    this.tooltipId = `cad-tooltip-${tooltipSequence}`
  }

  override disconnectedCallback(): void {
    this.removeDescription()
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <span
        class="base"
        part="base"
        @focusin=${this.show}
        @focusout=${this.handleFocusOut}
        @keydown=${this.handleKeyDown}
        @pointerenter=${this.show}
        @pointerleave=${this.handlePointerLeave}
      >
        <span class="trigger" part="trigger">
          <slot @slotchange=${this.syncDescription}></slot>
        </span>
        <span
          aria-labelledby="${this.tooltipId}-content"
          class="bubble"
          id=${this.tooltipId}
          part="bubble"
          role="tooltip"
        >
          <span id="${this.tooltipId}-content">
            <slot name="content">${this.text}</slot>
          </span>
        </span>
      </span>
    `
  }

  private show(): void {
    this.open = true
  }

  private handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget
    if (
      next instanceof Node &&
      (this.contains(next) || this.shadowRoot?.contains(next))
    ) {
      return
    }
    this.open = false
  }

  private handlePointerLeave(): void {
    if (!this.matches(':focus-within')) this.open = false
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.open) return
    event.stopPropagation()
    this.open = false
  }

  private syncDescription(event: Event): void {
    this.removeDescription()
    const slot = event.currentTarget
    if (!(slot instanceof HTMLSlotElement)) return
    const trigger = slot.assignedElements({ flatten: true })[0]
    if (!(trigger instanceof HTMLElement)) return

    const ids = new Set(
      (trigger.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter(Boolean),
    )
    ids.add(this.tooltipId)
    trigger.setAttribute('aria-describedby', [...ids].join(' '))
    this.describedElement = trigger
  }

  private removeDescription(): void {
    if (!this.describedElement) return
    const ids = (this.describedElement.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((id) => id && id !== this.tooltipId)
    if (ids.length > 0) {
      this.describedElement.setAttribute('aria-describedby', ids.join(' '))
    } else {
      this.describedElement.removeAttribute('aria-describedby')
    }
    this.describedElement = undefined
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-tooltip')
) {
  customElements.define('cad-tooltip', CadTooltip)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-tooltip': CadTooltip
  }
}
