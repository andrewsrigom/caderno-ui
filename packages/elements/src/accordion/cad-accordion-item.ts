import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

import {
  prefersReducedMotion,
  readMotionEasing,
  readMotionTime,
} from '../internal/motion.js'

export type CadAccordionAnimation = 'collapse' | 'none'

export type CadAccordionTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'paper' | 'violet'

export type CadAccordionToggleDetail = {
  open: boolean
}

export type CadAccordionToggleEvent = CustomEvent<CadAccordionToggleDetail>

/**
 * A native details/summary disclosure rendered as a notebook section.
 *
 * @slot - Disclosure content.
 * @slot title - Summary label. Falls back to the `heading` attribute.
 * @csspart base - Native details element.
 * @csspart content - Disclosure content.
 * @csspart marker - Hand-drawn disclosure marker.
 * @csspart summary - Native summary element.
 * @csspart title - Summary label.
 * @fires cad-accordion-toggle - Fires after the native disclosure state changes.
 */
export class CadAccordionItem extends LitElement {
  static override properties = {
    animation: { reflect: true, type: String },
    disabled: { reflect: true, type: Boolean },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_accordion-bg: var(--cad-post-it-blue-bg, #cfe2ff);
      --_accordion-ink: var(--cad-link, #005bac);
      display: block;
    }

    :host([tone='blue']) {
      --_accordion-bg: var(--cad-post-it-blue-bg, #cfe2ff);
      --_accordion-ink: var(--cad-link, #005bac);
    }

    :host([tone='coral']) {
      --_accordion-bg: var(--cad-post-it-coral-bg, #ffd8ce);
      --_accordion-ink: var(--cad-post-it-coral-ink, #633b32);
    }

    :host([tone='lemon']) {
      --_accordion-bg: var(--cad-post-it-lemon-bg, #fff1ac);
      --_accordion-ink: var(--cad-post-it-lemon-ink, #51491f);
    }

    :host([tone='mint']) {
      --_accordion-bg: var(--cad-post-it-mint-bg, #d8ffec);
      --_accordion-ink: var(--cad-post-it-mint-ink, #274f41);
    }

    :host([tone='violet']) {
      --_accordion-bg: var(--cad-sticker-violet-bg, #bba0ff);
      --_accordion-ink: var(--cad-sticker-violet-ink, #30205e);
    }

    .base {
      position: relative;
      overflow: hidden;
      color: var(--_accordion-ink);
      background: color-mix(
        in srgb,
        var(--_accordion-bg) 20%,
        var(--cad-surface, white)
      );
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        color-mix(in srgb, var(--_accordion-ink) 78%, transparent);
      border-radius: 0;
    }

    .base::before {
      content: none;
    }

    .summary {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.75rem;
      align-items: center;
      min-height: 2.75rem;
      padding: 0.75rem 0.95rem;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      cursor: pointer;
      list-style: none;
      -webkit-tap-highlight-color: transparent;
    }

    .summary::-webkit-details-marker {
      display: none;
    }

    .summary:hover {
      background: color-mix(in srgb, var(--_accordion-bg) 26%, transparent);
    }

    .summary:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, var(--_accordion-ink));
      outline-offset: -4px;
    }

    :host([disabled]) .summary {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .marker {
      width: 0.72rem;
      height: 0.72rem;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg) translate(-0.1rem, 0.1rem);
    }

    .base[open] .marker {
      transform: rotate(225deg) translate(-0.1rem, 0.1rem);
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      padding: 0.65rem 0.95rem 0.8rem;
      overflow: clip;
      border-top: 1px dashed
        color-mix(in srgb, var(--_accordion-ink) 42%, transparent);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      line-height: 1.4;
      transform-origin: top center;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .content,
      .marker {
        animation: none;
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .base {
        border-color: CanvasText;
      }
    }
  `

  declare animation: CadAccordionAnimation
  declare disabled: boolean
  declare heading: string
  declare open: boolean
  declare tone: CadAccordionTone

  private contentAnimation: Animation | undefined
  private isClosing = false

  constructor() {
    super()
    this.animation = 'collapse'
    this.disabled = false
    this.heading = ''
    this.open = false
    this.tone = 'blue'
  }

  override disconnectedCallback(): void {
    this.contentAnimation?.cancel()
    super.disconnectedCallback()
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (!this.hasUpdated || !changed.has('open')) return
    this.isClosing = !this.open && changed.get('open') === true
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (!changed.has('open') || changed.get('open') === undefined) return

    this.dispatchEvent(
      new CustomEvent<CadAccordionToggleDetail>('cad-accordion-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      }),
    )
    this.animateContent(this.open)
  }

  override render() {
    return html`
      <details class="base" .open=${this.open || this.isClosing} part="base">
        <summary
          aria-disabled=${this.disabled ? 'true' : nothing}
          class="summary"
          part="summary"
          tabindex=${this.disabled ? '-1' : nothing}
          @click=${this.handleSummaryClick}
          @keydown=${this.preventWhenDisabled}
        >
          <span part="title"><slot name="title">${this.heading}</slot></span>
          <span aria-hidden="true" class="marker" part="marker"></span>
        </summary>
        <div class="content" part="content"><slot></slot></div>
      </details>
    `
  }

  private preventWhenDisabled(event: Event): void {
    if (this.disabled) event.preventDefault()
  }

  private handleSummaryClick(event: MouseEvent): void {
    event.preventDefault()
    if (this.disabled) return
    this.open = !this.open
  }

  private animateContent(opening: boolean): void {
    const content = this.renderRoot.querySelector<HTMLElement>('.content')
    if (!content) return

    const wasAnimating = Boolean(this.contentAnimation)
    const animatedHeight = content.getBoundingClientRect().height
    this.contentAnimation?.cancel()
    this.contentAnimation = undefined

    if (this.animation === 'none' || prefersReducedMotion()) {
      this.finishClosing(opening)
      return
    }
    if (typeof content.animate !== 'function') {
      this.finishClosing(opening)
      return
    }

    const styles = getComputedStyle(content)
    const borderHeight =
      Number.parseFloat(styles.borderTopWidth) +
      Number.parseFloat(styles.borderBottomWidth)
    const fullHeight = content.scrollHeight + borderHeight
    const currentHeight = wasAnimating
      ? animatedHeight
      : content.getBoundingClientRect().height
    const duration = readMotionTime(
      this,
      opening ? '--cad-motion-duration-enter' : '--cad-motion-duration-exit',
      opening ? 420 : 220,
    )
    const easing = readMotionEasing(
      this,
      opening ? '--cad-motion-ease-enter' : '--cad-motion-ease-exit',
      opening ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 1, 1)',
    )
    const startHeight = opening && !wasAnimating ? 0 : currentHeight
    const animation = content.animate(
      opening
        ? [
            {
              height: `${startHeight}px`,
              opacity: startHeight === 0 ? 0 : 1,
              transform: 'translateY(-0.35rem)',
            },
            {
              height: `${fullHeight}px`,
              opacity: 1,
              transform: 'translateY(0)',
            },
          ]
        : [
            {
              height: `${currentHeight}px`,
              opacity: 1,
              transform: 'translateY(0)',
            },
            {
              height: '0px',
              opacity: 0,
              transform: 'translateY(-0.35rem)',
            },
          ],
      { duration, easing },
    )
    this.contentAnimation = animation
    void animation.finished
      .then(() => {
        if (this.contentAnimation !== animation) return
        this.contentAnimation = undefined
        animation.cancel()
        this.finishClosing(opening)
      })
      .catch(() => undefined)
  }

  private finishClosing(opening: boolean): void {
    if (opening || this.open || !this.isClosing) return
    this.isClosing = false
    this.requestUpdate()
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-accordion-item')
) {
  customElements.define('cad-accordion-item', CadAccordionItem)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-accordion-item': CadAccordionItem
  }
}
