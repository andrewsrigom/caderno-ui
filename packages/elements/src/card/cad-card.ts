import { css, html, LitElement } from 'lit'

export type CadCardTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'neutral' | 'pink' | 'violet'
export type CadCardVariant = 'outlined' | 'paper'

/**
 * A notebook paper surface that delegates content hierarchy to composable children.
 *
 * @slot - Card composition, usually header, content, and footer elements.
 * @csspart base - Card article or anchor.
 * @cssprop --cad-card-accent - Per-instance accent color.
 * @cssprop --cad-card-bg - Per-instance paper color.
 * @cssprop --cad-card-ink - Per-instance foreground color.
 */
export class CadCard extends LitElement {
  static override properties = {
    folded: { reflect: true, type: Boolean },
    href: { type: String },
    variant: { reflect: true, type: String },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_card-bg: var(--cad-card-bg, var(--cad-surface-raised, #fff));
      --_card-ink: var(--cad-card-ink, var(--cad-ink, #162033));
      --_card-accent: var(--cad-card-accent, var(--cad-ink-muted, #596273));
      display: block;
    }

    :host([tone='blue']) {
      --_card-bg: color-mix(
        in srgb,
        var(--cad-post-it-blue-bg, #b8d5ff) 22%,
        var(--cad-surface-raised, white)
      );
      --_card-accent: var(--cad-post-it-blue-ink, #18345d);
    }

    :host([tone='coral']) {
      --_card-bg: color-mix(
        in srgb,
        var(--cad-post-it-coral-bg, #ffb19f) 22%,
        var(--cad-surface-raised, white)
      );
      --_card-accent: var(--cad-post-it-coral-ink, #55251b);
    }

    :host([tone='lemon']) {
      --_card-bg: color-mix(
        in srgb,
        var(--cad-post-it-lemon-bg, #fff1a8) 25%,
        var(--cad-surface-raised, white)
      );
      --_card-accent: var(--cad-post-it-lemon-ink, #49370d);
    }

    :host([tone='mint']) {
      --_card-bg: color-mix(
        in srgb,
        var(--cad-post-it-mint-bg, #a9eacb) 22%,
        var(--cad-surface-raised, white)
      );
      --_card-accent: var(--cad-post-it-mint-ink, #173d2c);
    }

    :host([tone='pink']) {
      --_card-bg: color-mix(
        in srgb,
        var(--cad-post-it-pink-bg, #ffb7d5) 22%,
        var(--cad-surface-raised, white)
      );
      --_card-accent: var(--cad-post-it-pink-ink, #52233a);
    }

    :host([tone='violet']) {
      --_card-bg: color-mix(
        in srgb,
        var(--cad-sticker-violet-bg, #bba0ff) 22%,
        var(--cad-surface-raised, white)
      );
      --_card-accent: var(--cad-sticker-violet-ink, #30205e);
    }

    .base {
      position: relative;
      display: grid;
      gap: 1rem;
      min-height: 100%;
      padding: 1.25rem 1.35rem 1.35rem;
      overflow: hidden;
      color: var(--_card-ink);
      background: var(--_card-bg);
      border: 1.5px solid
        color-mix(in srgb, var(--_card-accent) 32%, transparent);
      border-radius: 0.75rem 1rem 0.75rem 0.95rem;
      box-shadow: 0 0.4rem 0.9rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.08);
      text-decoration: none;
      transition:
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        box-shadow
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    :host([variant='outlined']) .base {
      background: transparent;
      border-color: color-mix(in srgb, var(--_card-accent) 48%, transparent);
      border-style: dashed;
      box-shadow: none;
    }

    a.base:hover {
      box-shadow: 0 0.7rem 1.4rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
      transform: translateY(-2px);
    }

    a.base:active {
      box-shadow: 0 0.2rem 0.5rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.1);
      transform: translateY(1px) scale(0.99);
    }

    a.base:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, var(--_card-accent));
      outline-offset: 3px;
    }

    :host([folded]) .base::after {
      position: absolute;
      right: -0.1rem;
      bottom: -0.1rem;
      width: 1.4rem;
      height: 1.4rem;
      background: linear-gradient(
        135deg,
        transparent 48%,
        color-mix(in srgb, var(--_card-accent) 24%, var(--_card-bg)) 50%
      );
      content: '';
    }

    @media (prefers-reduced-motion: reduce) {
      .base {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .base {
        border-color: CanvasText;
      }
    }
  `

  declare folded: boolean
  declare href: string
  declare tone: CadCardTone
  declare variant: CadCardVariant

  constructor() {
    super()
    this.folded = true
    this.href = ''
    this.tone = 'neutral'
    this.variant = 'paper'
  }

  override render() {
    const content = html`<slot></slot>`

    return this.href
      ? html`<a class="base" href=${this.href} part="base">${content}</a>`
      : html`<article class="base" part="base">${content}</article>`
  }
}

abstract class CadCardSection extends LitElement {
  protected abstract readonly element: 'div' | 'footer' | 'header'

  override render() {
    if (this.element === 'header') {
      return html`<header part="base"><slot></slot></header>`
    }
    if (this.element === 'footer') {
      return html`<footer part="base"><slot></slot></footer>`
    }
    return html`<div part="base"><slot></slot></div>`
  }
}

/**
 * Groups the card's leading hierarchy without prescribing its content.
 *
 * @slot - Kicker, title, description, actions, or custom content.
 * @csspart base - Native card header.
 */
export class CadCardHeader extends CadCardSection {
  protected readonly element = 'header'

  static override styles = css`
    header {
      display: grid;
      gap: 0.35rem;
      min-width: 0;
    }
  `
}

/**
 * Applies title typography while leaving heading level to native slotted markup.
 *
 * @slot - A native heading element.
 * @csspart base - Title wrapper.
 */
export class CadCardTitle extends CadCardSection {
  protected readonly element = 'div'

  static override styles = css`
    div {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      min-width: 0;
      color: var(--_card-ink, var(--cad-card-ink, var(--cad-ink, #162033)));
      font-family: var(--cad-font-book, serif);
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.2;
    }

    ::slotted(*) {
      margin: 0;
      color: inherit;
      font: inherit;
    }
  `
}

/**
 * Styles compact eyebrow content above a card title.
 *
 * @slot - Kicker text.
 * @csspart base - Kicker wrapper.
 */
export class CadCardKicker extends CadCardSection {
  protected readonly element = 'div'

  static override styles = css`
    div {
      color: var(
        --_card-accent,
        var(--cad-card-accent, var(--cad-ink-muted, #596273))
      );
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    ::slotted(*) {
      margin: 0;
      font: inherit;
    }
  `
}

/**
 * Groups the primary card content.
 *
 * @slot - Card body.
 * @csspart base - Content wrapper.
 */
export class CadCardContent extends CadCardSection {
  protected readonly element = 'div'

  static override styles = css`
    div {
      min-width: 0;
      font-family: var(--cad-font-book, serif);
      line-height: 1.6;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }
  `
}

/**
 * Groups card actions or supporting metadata.
 *
 * @slot - Footer actions or metadata.
 * @csspart base - Native card footer.
 */
export class CadCardFooter extends CadCardSection {
  protected readonly element = 'footer'

  static override styles = css`
    footer {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      align-items: center;
      padding-top: 0.25rem;
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
    }
  `
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-card')) {
    customElements.define('cad-card', CadCard)
  }
  if (!customElements.get('cad-card-content')) {
    customElements.define('cad-card-content', CadCardContent)
  }
  if (!customElements.get('cad-card-footer')) {
    customElements.define('cad-card-footer', CadCardFooter)
  }
  if (!customElements.get('cad-card-header')) {
    customElements.define('cad-card-header', CadCardHeader)
  }
  if (!customElements.get('cad-card-kicker')) {
    customElements.define('cad-card-kicker', CadCardKicker)
  }
  if (!customElements.get('cad-card-title')) {
    customElements.define('cad-card-title', CadCardTitle)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-card': CadCard
    'cad-card-content': CadCardContent
    'cad-card-footer': CadCardFooter
    'cad-card-header': CadCardHeader
    'cad-card-kicker': CadCardKicker
    'cad-card-title': CadCardTitle
  }
}
