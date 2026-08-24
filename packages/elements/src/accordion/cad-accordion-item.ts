import { css, html, LitElement, nothing } from 'lit'

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
    disabled: { reflect: true, type: Boolean },
    heading: { type: String },
    open: { reflect: true, type: Boolean },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_accordion-bg: var(--cad-surface-raised, #f7f0dc);
      --_accordion-ink: var(--cad-ink, #25202a);
      display: block;
    }

    :host([tone='blue']) {
      --_accordion-bg: var(--cad-post-it-blue-bg, #cfe2ff);
      --_accordion-ink: var(--cad-post-it-blue-ink, #20375d);
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
      overflow: hidden;
      color: var(--_accordion-ink);
      background: color-mix(
        in srgb,
        var(--_accordion-bg) 58%,
        var(--cad-surface, white)
      );
      border: 1.5px solid
        color-mix(in srgb, var(--_accordion-ink) 28%, transparent);
      border-radius: 0.55rem 0.8rem 0.6rem 0.75rem;
    }

    .summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.75rem;
      align-items: center;
      min-height: 2.75rem;
      padding: 0.75rem 0.95rem;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      cursor: pointer;
      list-style: none;
      -webkit-tap-highlight-color: transparent;
    }

    .summary::-webkit-details-marker {
      display: none;
    }

    .summary:hover {
      background: color-mix(in srgb, var(--_accordion-bg) 34%, transparent);
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
      transition: transform var(--cad-duration-fast, 140ms)
        var(--cad-transition-smooth, ease);
      transform: rotate(45deg) translate(-0.1rem, 0.1rem);
    }

    .base[open] .marker {
      transform: rotate(225deg) translate(-0.1rem, 0.1rem);
    }

    .content {
      padding: 0.95rem;
      border-top: 1px dashed
        color-mix(in srgb, var(--_accordion-ink) 26%, transparent);
      font-family: var(--cad-font-book, serif);
      line-height: 1.6;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .marker {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .base {
        border-color: CanvasText;
      }
    }
  `

  declare disabled: boolean
  declare heading: string
  declare open: boolean
  declare tone: CadAccordionTone

  constructor() {
    super()
    this.disabled = false
    this.heading = ''
    this.open = false
    this.tone = 'paper'
  }

  override render() {
    return html`
      <details
        class="base"
        .open=${this.open}
        part="base"
        @toggle=${this.handleNativeToggle}
      >
        <summary
          aria-disabled=${this.disabled ? 'true' : nothing}
          class="summary"
          part="summary"
          tabindex=${this.disabled ? '-1' : nothing}
          @click=${this.preventWhenDisabled}
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

  private handleNativeToggle(event: Event): void {
    const details = event.currentTarget
    if (
      !(details instanceof HTMLDetailsElement) ||
      details.open === this.open
    ) {
      return
    }
    this.open = details.open
    this.dispatchEvent(
      new CustomEvent<CadAccordionToggleDetail>('cad-accordion-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      }),
    )
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
