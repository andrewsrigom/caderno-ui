import { css, html, LitElement, nothing } from 'lit'

export type CadBlockquoteTone = 'accent' | 'coral' | 'lemon' | 'mint' | 'violet'

/**
 * A semantic quotation with optional attribution and source link.
 *
 * @slot - Quoted content.
 * @slot caption - Custom attribution content.
 * @csspart base - Native figure.
 * @csspart caption - Native figcaption.
 * @csspart quote - Native blockquote.
 */
export class CadBlockquote extends LitElement {
  static override properties = {
    author: { type: String },
    cite: { type: String },
    source: { type: String },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_quote-accent: var(--cad-link, var(--cad-post-it-blue-ink, #20375d));
      display: block;
    }

    :host([tone='coral']) {
      --_quote-accent: var(--cad-post-it-coral-ink, #633b32);
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

    figure {
      display: grid;
      gap: 0.75rem;
      margin: 0;
      padding: 1.1rem 1.25rem 1rem 1.6rem;
      color: var(--cad-ink, currentColor);
      background: color-mix(
        in srgb,
        var(--cad-surface-raised, white) 92%,
        var(--_quote-accent)
      );
      border-inline-start: 0.35rem solid var(--_quote-accent);
      border-radius: 0.35rem 0.8rem 0.65rem 0.45rem;
    }

    blockquote {
      position: relative;
      margin: 0;
      font-family: var(--cad-font-book, serif);
      font-size: 1.08rem;
      font-style: italic;
      line-height: 1.65;
    }

    blockquote::before {
      position: absolute;
      top: -0.7rem;
      left: -1.05rem;
      color: color-mix(in srgb, var(--_quote-accent) 62%, transparent);
      content: '“';
      font-family: var(--cad-font-hand, cursive);
      font-size: 2.8rem;
      font-style: normal;
      line-height: 1;
    }

    figcaption {
      color: var(--cad-ink, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
    }

    a {
      color: var(--cad-link, currentColor);
      text-underline-offset: 0.18em;
    }

    @media (forced-colors: active) {
      figure {
        border-color: CanvasText;
      }
    }
  `

  declare author: string
  declare cite: string
  declare source: string
  declare tone: CadBlockquoteTone

  constructor() {
    super()
    this.author = ''
    this.cite = ''
    this.source = ''
    this.tone = 'accent'
  }

  override render() {
    const hasCaption =
      this.author || this.source || this.querySelector('[slot="caption"]')
    return html`
      <figure part="base">
        <blockquote cite=${this.cite || nothing} part="quote">
          <slot></slot>
        </blockquote>
        ${
          hasCaption
            ? html`<figcaption part="caption">
                <slot name="caption">
                  ${this.author ? html`<strong>${this.author}</strong>` : nothing}
                  ${this.author && this.source ? html` · ` : nothing}
                  ${
                    this.source && this.cite
                      ? html`<a href=${this.cite}>${this.source}</a>`
                      : this.source
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
