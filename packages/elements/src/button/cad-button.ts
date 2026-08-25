import { css, html, LitElement, nothing } from 'lit'

export type CadButtonSize = 'lg' | 'md' | 'sm'
export type CadButtonTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadButtonType = 'button' | 'reset' | 'submit'
export type CadButtonVariant = 'ghost' | 'link' | 'primary' | 'secondary'

/**
 * A notebook-styled action that renders a native button or link.
 *
 * @slot - Action label.
 * @slot end - Optional trailing visual or metadata.
 * @slot start - Optional leading visual or metadata.
 * @csspart base - Native button or anchor.
 * @csspart end - Trailing composition slot.
 * @csspart label - Action label.
 * @csspart start - Leading composition slot.
 * @cssprop --cad-button-bg - Per-instance action color.
 * @cssprop --cad-button-ink - Per-instance foreground color.
 */
export class CadButton extends LitElement {
  static override properties = {
    disabled: { reflect: true, type: Boolean },
    form: { type: String },
    href: { type: String },
    label: { type: String },
    rel: { type: String },
    size: { reflect: true, type: String },
    target: { type: String },
    tone: { reflect: true, type: String },
    type: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_button-bg: var(--cad-button-bg, var(--cad-post-it-blue-bg, #b8d5ff));
      --_button-ink: var(
        --cad-button-ink,
        var(--cad-post-it-blue-ink, #18345d)
      );
      display: inline-flex;
      max-width: 100%;
      vertical-align: middle;
    }

    :host([tone='coral']) {
      --_button-bg: var(--cad-button-bg, var(--cad-post-it-coral-bg, #ffb19f));
      --_button-ink: var(
        --cad-button-ink,
        var(--cad-post-it-coral-ink, #55251b)
      );
    }

    :host([tone='lemon']) {
      --_button-bg: var(--cad-button-bg, var(--cad-post-it-lemon-bg, #fff1a8));
      --_button-ink: var(
        --cad-button-ink,
        var(--cad-post-it-lemon-ink, #49370d)
      );
    }

    :host([tone='mint']) {
      --_button-bg: var(--cad-button-bg, var(--cad-post-it-mint-bg, #a9eacb));
      --_button-ink: var(
        --cad-button-ink,
        var(--cad-post-it-mint-ink, #173d2c)
      );
    }

    :host([tone='pink']) {
      --_button-bg: var(--cad-button-bg, var(--cad-post-it-pink-bg, #ffb7d5));
      --_button-ink: var(
        --cad-button-ink,
        var(--cad-post-it-pink-ink, #52233a)
      );
    }

    :host([tone='violet']) {
      --_button-bg: var(--cad-button-bg, var(--cad-sticker-violet-bg, #bba0ff));
      --_button-ink: var(
        --cad-button-ink,
        var(--cad-sticker-violet-ink, #30205e)
      );
    }

    .base {
      display: inline-flex;
      gap: 0.45rem;
      align-items: center;
      justify-content: center;
      min-height: 2.55rem;
      max-width: 100%;
      padding: 0.5rem 1rem 0.58rem;
      color: var(--_button-ink);
      background: var(--_button-bg);
      border: 1.5px solid
        color-mix(in srgb, var(--_button-ink) 42%, transparent);
      border-radius: 0.7rem 0.95rem 0.7rem 0.9rem;
      box-shadow:
        0 0.35rem 0.75rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.14),
        inset 0 -0.16rem 0.28rem
          color-mix(in srgb, var(--_button-ink) 18%, transparent);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.05;
      text-decoration: none;
      cursor: pointer;
      transition:
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        box-shadow
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
      transform: rotate(-0.3deg);
      -webkit-tap-highlight-color: transparent;
    }

    :host([size='sm']) .base {
      min-height: 2rem;
      padding: 0.32rem 0.72rem 0.38rem;
      font-size: var(--cad-hand-sm, 1.05rem);
    }

    :host([size='lg']) .base {
      min-height: 3.2rem;
      padding: 0.7rem 1.3rem 0.78rem;
      border-radius: 0.85rem 1.1rem 0.85rem 1.05rem;
      font-size: var(--cad-hand-lg, 1.55rem);
    }

    :host([variant='secondary']) .base {
      background: transparent;
      border-style: dashed;
      box-shadow: none;
    }

    :host([variant='ghost']) .base {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
      transform: none;
    }

    :host([variant='link']) .base {
      min-height: auto;
      padding: 0.1rem 0.2rem;
      color: var(--cad-ink, currentColor);
      background: linear-gradient(
        180deg,
        transparent 66%,
        color-mix(in srgb, var(--_button-bg) 76%, transparent) 67%,
        color-mix(in srgb, var(--_button-bg) 76%, transparent) 93%,
        transparent 94%
      );
      border: 0;
      border-radius: 0;
      box-shadow: none;
      transform: none;
    }

    .base:not([aria-disabled='true']):hover {
      transform: rotate(-0.4deg) translateY(-1px);
      box-shadow: 0 0.55rem 1.1rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.18);
    }

    :host(:not([variant='link'])) .base:not([aria-disabled='true']):active {
      transform: rotate(-0.15deg) translateY(1px) scale(0.98);
      box-shadow: 0 0.18rem 0.4rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
    }

    :host([variant='ghost']) .base:not([aria-disabled='true']):hover,
    :host([variant='secondary']) .base:not([aria-disabled='true']):hover {
      background: color-mix(in srgb, var(--_button-bg) 30%, transparent);
      box-shadow: none;
    }

    :host([variant='link']) .base:not([aria-disabled='true']):hover {
      background: linear-gradient(
        180deg,
        transparent 56%,
        color-mix(in srgb, var(--_button-bg) 90%, transparent) 57%,
        color-mix(in srgb, var(--_button-bg) 90%, transparent) 93%,
        transparent 94%
      );
      box-shadow: none;
      transform: none;
    }

    .base:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }

    .base[aria-disabled='true'],
    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      box-shadow: none;
      transform: none;
    }

    .label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (prefers-reduced-motion: reduce) {
      .base {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .base {
        color: ButtonText;
        background: ButtonFace;
        border-color: ButtonText;
      }
    }
  `

  declare disabled: boolean
  declare form: string
  declare href: string
  declare label: string
  declare rel: string
  declare size: CadButtonSize
  declare target: string
  declare tone: CadButtonTone
  declare type: CadButtonType
  declare variant: CadButtonVariant

  constructor() {
    super()
    this.disabled = false
    this.form = ''
    this.href = ''
    this.label = ''
    this.rel = ''
    this.size = 'md'
    this.target = ''
    this.tone = 'blue'
    this.type = 'button'
    this.variant = 'primary'
  }

  private get targetForm(): HTMLFormElement | null {
    if (this.form) {
      const candidate = this.ownerDocument.getElementById(this.form)
      return candidate instanceof HTMLFormElement ? candidate : null
    }
    return this.closest('form')
  }

  private handleButtonClick(): void {
    const form = this.targetForm
    if (!form || this.type === 'button') return
    if (this.type === 'reset') form.reset()
    else form.requestSubmit()
  }

  private handleDisabledLink(event: MouseEvent): void {
    if (!this.disabled) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }

  override render() {
    const content = html`
      <slot name="start" part="start"></slot>
      <span class="label" part="label"><slot></slot></span>
      <slot name="end" part="end"></slot>
    `

    if (this.href) {
      return html`
        <a
          aria-disabled=${this.disabled ? 'true' : nothing}
          aria-label=${this.label || nothing}
          class="base"
          href=${this.disabled ? nothing : this.href}
          part="base"
          rel=${this.rel || nothing}
          tabindex=${this.disabled ? '-1' : nothing}
          target=${this.target || nothing}
          @click=${this.handleDisabledLink}
          >${content}</a
        >
      `
    }

    return html`
      <button
        aria-label=${this.label || nothing}
        class="base"
        ?disabled=${this.disabled}
        part="base"
        type="button"
        @click=${this.handleButtonClick}
      >
        ${content}
      </button>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-button')
) {
  customElements.define('cad-button', CadButton)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-button': CadButton
  }
}
