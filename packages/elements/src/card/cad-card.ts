import { css, html, LitElement, nothing } from 'lit'

import '../icon/cad-icon.js'

export type CadCardTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'neutral' | 'pink' | 'violet'
export type CadCardVariant = 'outlined' | 'paper'

/**
 * A composable notebook card that can optionally act as a link.
 *
 * @slot - Card body.
 * @slot title - Card heading. Falls back to the `heading` attribute.
 * @slot footer - Supporting actions or metadata.
 * @csspart base - Card article or anchor.
 * @csspart body - Card body.
 * @csspart footer - Card footer.
 * @csspart header - Card header.
 * @csspart icon - Optional heading icon.
 * @csspart kicker - Optional eyebrow text.
 * @csspart title - Card heading.
 * @cssprop --cad-card-bg - Per-instance paper color.
 * @cssprop --cad-card-ink - Per-instance foreground color.
 */
export class CadCard extends LitElement {
  static override properties = {
    folded: { reflect: true, type: Boolean },
    heading: { type: String },
    href: { type: String },
    icon: { type: String },
    kicker: { type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_card-bg: var(--cad-card-bg, var(--cad-surface-raised, #fff));
      --_card-ink: var(--cad-card-ink, var(--cad-ink, #162033));
      --_card-accent: var(--cad-ink-muted, #596273);
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
      gap: 0.75rem;
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
        transform var(--cad-duration-fast, 140ms)
          var(--cad-transition-smooth, ease),
        box-shadow var(--cad-duration-fast, 140ms)
          var(--cad-transition-smooth, ease);
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

    .header {
      display: grid;
      gap: 0.25rem;
    }

    .kicker {
      margin: 0;
      color: var(--_card-accent);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .title-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      color: var(--_card-accent);
    }

    .title {
      margin: 0;
      color: var(--_card-ink);
      font-family: var(--cad-font-book, serif);
      font-size: 1.25rem;
      line-height: 1.2;
    }

    .body {
      min-width: 0;
      font-family: var(--cad-font-book, serif);
      line-height: 1.6;
    }

    .footer {
      padding-top: 0.35rem;
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
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
  declare heading: string
  declare href: string
  declare icon: string
  declare kicker: string
  declare tone: CadCardTone
  declare variant: CadCardVariant

  constructor() {
    super()
    this.folded = true
    this.heading = ''
    this.href = ''
    this.icon = ''
    this.kicker = ''
    this.tone = 'neutral'
    this.variant = 'paper'
  }

  private renderContent() {
    const hasTitle = Boolean(
      this.heading ||
      this.icon ||
      this.kicker ||
      this.querySelector('[slot="title"]'),
    )
    const hasFooter = Boolean(this.querySelector('[slot="footer"]'))

    return html`
      ${
        hasTitle
          ? html`
              <header class="header" part="header">
                ${this.kicker ? html`<p class="kicker" part="kicker">${this.kicker}</p>` : nothing}
                <div class="title-row">
                  ${
                    this.icon
                      ? html`<span aria-hidden="true" part="icon"
                          ><cad-icon name=${this.icon} size="20"></cad-icon
                        ></span>`
                      : nothing
                  }
                  <h3 class="title" part="title">
                    <slot name="title">${this.heading}</slot>
                  </h3>
                </div>
              </header>
            `
          : nothing
      }
      <div class="body" part="body"><slot></slot></div>
      ${hasFooter ? html`<footer class="footer" part="footer"><slot name="footer"></slot></footer>` : nothing}
    `
  }

  override render() {
    return this.href
      ? html`<a class="base" href=${this.href} part="base"
          >${this.renderContent()}</a
        >`
      : html`<article class="base" part="base">
          ${this.renderContent()}
        </article>`
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-card')) {
  customElements.define('cad-card', CadCard)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-card': CadCard
  }
}
