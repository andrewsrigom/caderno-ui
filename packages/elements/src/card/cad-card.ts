import { css, html, LitElement } from 'lit'

export type CadCardTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'neutral' | 'pink' | 'violet'
export type CadCardVariant = 'outlined' | 'paper' | 'plain'

/**
 * A notebook paper surface that delegates content hierarchy to composable children.
 *
 * @slot - Card composition, usually header, content, and footer elements.
 * @csspart base - Card article or anchor.
 * @csspart band - Optional hatched band when folded is enabled.
 * @csspart fold - Optional folded paper corner.
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
      --_card-accent: var(--cad-card-accent, var(--cad-link, #005bac));
      --_card-tint: color-mix(
        in srgb,
        var(--_card-accent) 10%,
        var(--_card-bg)
      );
      --_card-edge: clamp(1.2rem, 4vw, 1.75rem);
      display: block;
    }

    :host([tone='blue']) {
      --_card-accent: var(--cad-link, #005bac);
    }

    :host([tone='coral']) {
      --_card-accent: var(--cad-danger-ink, #d94a3d);
    }

    :host([tone='lemon']) {
      --_card-accent: var(--cad-warning-ink, #b67800);
    }

    :host([tone='mint']) {
      --_card-accent: var(--cad-success-ink, #07875f);
    }

    :host([tone='pink']) {
      --_card-accent: var(--cad-pink-ink, #bd2f71);
    }

    :host([tone='violet']) {
      --_card-accent: var(--cad-violet-ink, #7131b5);
    }

    .base {
      position: relative;
      display: grid;
      gap: 0;
      min-height: 100%;
      overflow: hidden;
      color: var(--_card-ink);
      background: var(--_card-bg);
      border: var(--cad-border-width, 1.5px) solid var(--_card-accent);
      border-radius: 0;
      box-shadow:
        2px 2.5px 0 color-mix(in srgb, var(--_card-accent) 16%, transparent),
        0 0.6rem 1.2rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.06);
      text-decoration: none;
      transition:
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        box-shadow
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    .band {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 4.5rem;
      background:
        repeating-linear-gradient(
          -18deg,
          transparent 0 0.42rem,
          color-mix(in srgb, var(--_card-accent) 18%, transparent) 0.42rem
            0.5rem
        ),
        var(--_card-tint);
      border-bottom: 1.5px solid var(--_card-accent);
      pointer-events: none;
    }

    .fold {
      position: absolute;
      top: -1.5px;
      right: -1.5px;
      z-index: 2;
      width: 4.8rem;
      height: 4.8rem;
      overflow: hidden;
      background: var(--_card-bg);
      pointer-events: none;
    }

    .fold::before {
      position: absolute;
      top: 1px;
      left: 0;
      width: 6.8rem;
      height: 1.5px;
      background: var(--_card-accent);
      content: '';
      transform: rotate(45deg);
      transform-origin: top left;
    }

    .fold::after {
      position: absolute;
      inset: 0 0.25rem 0.25rem 0;
      border-bottom: 1.5px solid var(--_card-accent);
      border-left: 1.5px solid var(--_card-accent);
      content: '';
    }

    slot {
      display: contents;
    }

    ::slotted(*) {
      min-width: 0;
    }

    :host([variant='outlined']) .base {
      background: transparent;
      box-shadow: none;
    }

    :host([folded]) .base {
      padding-top: 4.5rem;
      clip-path: polygon(
        0 0,
        calc(100% - 4.8rem) 0,
        100% 4.8rem,
        100% 100%,
        0 100%
      );
    }

    :host([variant='plain']) .base {
      background: transparent;
      border: 0;
      box-shadow: none;
    }

    :host([variant='outlined']) .base,
    :host([variant='plain']) .base {
      padding-top: 0;
      clip-path: none;
    }

    :host([variant='outlined']) .band,
    :host([variant='outlined']) .fold,
    :host([variant='plain']) .band,
    :host([variant='plain']) .fold,
    :host(:not([folded])) .band,
    :host(:not([folded])) .fold {
      display: none;
    }

    a.base:hover {
      box-shadow:
        3px 4px 0 color-mix(in srgb, var(--_card-accent) 18%, transparent),
        0 0.8rem 1.5rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.09);
      transform: translateY(-1px);
    }

    a.base:active {
      box-shadow: 0 0.2rem 0.5rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.1);
      transform: translateY(1px) scale(0.99);
    }

    :host([variant='plain']) a.base:is(:hover, :active) {
      box-shadow: none;
    }

    a.base:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, var(--_card-accent));
      outline-offset: 3px;
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
    this.folded = false
    this.href = ''
    this.tone = 'neutral'
    this.variant = 'paper'
  }

  override render() {
    const content = html`
      <span aria-hidden="true" class="band" part="band"></span>
      <span aria-hidden="true" class="fold" part="fold"></span>
      <slot></slot>
    `

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
    :host {
      display: block;
    }

    header {
      display: grid;
      gap: 0.55rem;
      min-width: 0;
      padding: 1.25rem var(--_card-edge, 1.5rem);
      border-bottom: 1.25px solid
        var(--_card-accent, var(--cad-card-accent, var(--cad-link, #005bac)));
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
      overflow-wrap: anywhere;
      color: var(
        --_card-accent,
        var(--cad-card-accent, var(--cad-link, #005bac))
      );
      font-family: var(--cad-type-title-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-title-size, var(--cad-hand-lg, 1.55rem));
      font-weight: var(--cad-hand-weight-strong, 600);
      line-height: var(--cad-type-title-line-height, 1.15);
    }

    ::slotted(*) {
      margin: 0;
      color: inherit;
      font: inherit !important;
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
        var(--cad-card-accent, var(--cad-link, #005bac))
      );
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 600);
      line-height: 1.2;
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
    :host {
      display: block;
      padding: 1.1rem var(--_card-edge, 1.5rem) 1.65rem;
    }

    div {
      min-width: 0;
      color: var(
        --_card-accent,
        var(--cad-card-accent, var(--cad-link, #005bac))
      );
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.12rem);
      line-height: 1.5;
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
    :host {
      display: block;
    }

    footer {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem 1.25rem;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem var(--_card-edge, 1.5rem) 0.9rem;
      color: var(
        --_card-accent,
        var(--cad-card-accent, var(--cad-link, #005bac))
      );
      border-top: 1.25px solid currentColor;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      line-height: 1.25;
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
