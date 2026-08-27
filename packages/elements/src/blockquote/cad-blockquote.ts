import { css, html, LitElement, nothing } from 'lit'

export type CadBlockquoteTone = 'accent' | 'coral' | 'lemon' | 'mint' | 'violet'
export type CadBlockquoteVariant = 'default' | 'highlight'

/**
 * A semantic quotation with optional attribution and source link.
 *
 * @slot - Quoted content.
 * @slot caption - Custom attribution content.
 * @csspart base - Native figure.
 * @csspart caption - Native figcaption.
 * @csspart content - Quotation content.
 * @csspart mark - Decorative opening quotation mark.
 * @csspart quote - Native blockquote.
 * @cssprop --cad-blockquote-accent - Per-instance ink color.
 * @cssprop --cad-blockquote-bg - Per-instance paper color.
 */
export class CadBlockquote extends LitElement {
  static override properties = {
    author: { type: String },
    cite: { type: String },
    source: { type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_quote-accent: var(
        --cad-blockquote-accent,
        var(--cad-link, var(--cad-post-it-blue-ink, #005bac))
      );
      --_quote-bg: var(
        --cad-blockquote-bg,
        color-mix(
          in srgb,
          var(--cad-surface-raised, #fff) 96%,
          var(--_quote-accent)
        )
      );
      --_quote-offset-paper: transparent;
      display: block;
    }

    :host([tone='coral']) {
      --_quote-accent: var(--cad-link-ink, #e62436);
    }

    :host([tone='lemon']) {
      --_quote-accent: var(--cad-post-it-lemon-ink, #51491f);
    }

    :host([tone='mint']) {
      --_quote-accent: var(--cad-post-it-mint-ink, #274f41);
    }

    :host([tone='violet']) {
      --_quote-accent: var(--cad-sticker-violet-ink, #30205e);
    }

    :host([variant='highlight']) {
      --_quote-accent: var(--cad-blockquote-accent, #ed8b18);
      --_quote-bg: var(--cad-surface-raised, #fff);
      --_quote-offset-paper: var(--cad-post-it-lemon-bg, #fff1bd);
    }

    figure {
      position: relative;
      isolation: isolate;
      display: grid;
      gap: 0.85rem;
      margin: 0;
      padding: 1.25rem 1.4rem 1.05rem;
      color: var(--_quote-accent);
      background:
        linear-gradient(
          102deg,
          color-mix(in srgb, var(--_quote-accent) 3%, transparent),
          transparent 52%
        ),
        var(--_quote-bg);
      border: 1.5px solid var(--_quote-accent);
      border-radius: 0;
    }

    figure::before {
      position: absolute;
      z-index: -1;
      top: -0.15rem;
      bottom: -0.15rem;
      left: -0.65rem;
      width: 0.65rem;
      background: var(--_quote-offset-paper);
      content: '';
      transform: rotate(-0.35deg);
    }

    figure::after {
      position: absolute;
      z-index: 1;
      inset: -1px 0 0 -1px;
      border: 1px solid
        color-mix(in srgb, var(--_quote-accent) 62%, transparent);
      content: '';
      pointer-events: none;
      transform: rotate(0.08deg);
    }

    blockquote {
      display: grid;
      grid-template-columns: 1.35rem minmax(0, 1fr);
      gap: 0.4rem;
      margin: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: clamp(1.05rem, 0.98rem + 0.25vw, 1.18rem);
      font-style: normal;
      line-height: 1.48;
    }

    .quote-mark {
      align-self: start;
      margin-top: -0.22rem;
      color: var(--_quote-accent);
      font-family: var(--cad-font-hand, cursive);
      font-size: 2.35rem;
      font-weight: 700;
      line-height: 1;
    }

    .quote-content {
      min-width: 0;
    }

    figcaption {
      display: grid;
      gap: 0.08rem;
      justify-items: end;
      margin-left: 1.75rem;
      color: var(--_quote-accent);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 0.98rem);
      line-height: 1.35;
      text-align: right;
    }

    .author {
      font-weight: 700;
    }

    .source {
      font-size: 0.9em;
    }

    a {
      color: inherit;
      text-decoration-color: color-mix(
        in srgb,
        var(--_quote-accent) 65%,
        transparent
      );
      text-underline-offset: 0.18em;
    }

    @media (max-width: 32rem) {
      figure {
        padding: 1.1rem 1rem 0.95rem;
      }

      blockquote {
        grid-template-columns: 1.15rem minmax(0, 1fr);
      }

      figcaption {
        margin-left: 1.55rem;
      }
    }

    @media (forced-colors: active) {
      figure {
        border-color: CanvasText;
      }

      figure::after {
        display: none;
      }
    }
  `

  declare author: string
  declare cite: string
  declare source: string
  declare tone: CadBlockquoteTone
  declare variant: CadBlockquoteVariant

  constructor() {
    super()
    this.author = ''
    this.cite = ''
    this.source = ''
    this.tone = 'accent'
    this.variant = 'default'
  }

  override render() {
    const hasCaption =
      this.author || this.source || this.querySelector('[slot="caption"]')
    return html`
      <figure part="base">
        <blockquote cite=${this.cite || nothing} part="quote">
          <span aria-hidden="true" class="quote-mark" part="mark">“</span>
          <span class="quote-content" part="content"><slot></slot></span>
        </blockquote>
        ${
          hasCaption
            ? html`<figcaption part="caption">
                <slot name="caption">
                  ${
                    this.author
                      ? html`<span class="author">— ${this.author}</span>`
                      : nothing
                  }
                  ${
                    this.source && this.cite
                      ? html`<span class="source"
                          ><a href=${this.cite}>${this.source}</a></span
                        >`
                      : this.source
                        ? html`<span class="source">${this.source}</span>`
                        : nothing
                  }
                </slot>
              </figcaption>`
            : nothing
        }
      </figure>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-blockquote')
) {
  customElements.define('cad-blockquote', CadBlockquote)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-blockquote': CadBlockquote
  }
}
