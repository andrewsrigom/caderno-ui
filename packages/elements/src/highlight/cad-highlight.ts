import { css, html, LitElement } from 'lit'

export type CadHighlightTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadHighlightVariant = 'double' | 'marker' | 'underline'

/**
 * An inline semantic mark with hand-drawn highlight treatments.
 *
 * @slot - Highlighted text.
 * @csspart base - Native mark element.
 * @cssprop --cad-highlight-color - Per-instance marker color.
 */
export class CadHighlight extends LitElement {
  static override properties = {
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }
  static override styles = css`
    :host {
      --_highlight: var(
        --cad-highlight-color,
        var(--cad-post-it-lemon-bg, #fff1a8)
      );
      display: inline;
    }
    :host([tone='blue']) {
      --_highlight: var(
        --cad-highlight-color,
        var(--cad-post-it-blue-bg, #b8d5ff)
      );
    }
    :host([tone='coral']) {
      --_highlight: var(
        --cad-highlight-color,
        var(--cad-post-it-coral-bg, #ffb19f)
      );
    }
    :host([tone='mint']) {
      --_highlight: var(
        --cad-highlight-color,
        var(--cad-post-it-mint-bg, #a9eacb)
      );
    }
    :host([tone='pink']) {
      --_highlight: var(
        --cad-highlight-color,
        var(--cad-post-it-pink-bg, #ffb7d5)
      );
    }
    :host([tone='violet']) {
      --_highlight: var(
        --cad-highlight-color,
        var(--cad-sticker-violet-bg, #bba0ff)
      );
    }
    mark {
      padding-inline: 0.08em;
      color: inherit;
      background-color: transparent;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    :host([variant='marker']) mark,
    :host(:not([variant])) mark {
      background-image: linear-gradient(
        177deg,
        transparent 15%,
        var(--_highlight) 16%,
        var(--_highlight) 88%,
        transparent 89%
      );
    }
    :host([variant='underline']) mark {
      background-image: linear-gradient(
        180deg,
        transparent 67%,
        var(--_highlight) 68%,
        var(--_highlight) 93%,
        transparent 94%
      );
    }
    :host([variant='double']) mark {
      background-image:
        linear-gradient(
          178deg,
          transparent 46%,
          var(--_highlight) 47%,
          var(--_highlight) 64%,
          transparent 65%
        ),
        linear-gradient(
          181deg,
          transparent 73%,
          var(--_highlight) 74%,
          var(--_highlight) 91%,
          transparent 92%
        );
    }
    @media (forced-colors: active) {
      mark {
        forced-color-adjust: none;
        color: CanvasText;
        background: Canvas;
        text-decoration: underline 0.18em Highlight;
        text-decoration-skip-ink: none;
      }
    }
  `

  declare tone: CadHighlightTone
  declare variant: CadHighlightVariant
  constructor() {
    super()
    this.tone = 'lemon'
    this.variant = 'marker'
  }
  override render() {
    return html`<mark part="base"><slot></slot></mark>`
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-highlight')
)
  customElements.define('cad-highlight', CadHighlight)
declare global {
  interface HTMLElementTagNameMap {
    'cad-highlight': CadHighlight
  }
}
