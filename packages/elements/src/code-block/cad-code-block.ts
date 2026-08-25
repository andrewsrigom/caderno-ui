import { css, html, LitElement, nothing } from 'lit'

export type CadCodeBlockTone =
  'accent' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * A readable notebook code sample with optional filename and line numbers.
 *
 * @slot - Progressive code content used when `code` is not set.
 * @csspart base - Native figure.
 * @csspart code - Native code element.
 * @csspart header - Filename and language metadata.
 * @csspart pre - Native preformatted block.
 * @cssprop --cad-code-bg - Code surface color.
 * @cssprop --cad-code-ink - Code foreground color.
 */
export class CadCodeBlock extends LitElement {
  static override properties = {
    code: { type: String },
    filename: { type: String },
    language: { type: String },
    showLineNumbers: {
      attribute: 'show-line-numbers',
      reflect: true,
      type: Boolean,
    },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_code-accent: var(--cad-post-it-blue-bg, #cfe2ff);
      --_code-accent-ink: var(--cad-post-it-blue-ink, #20375d);
      display: block;
    }

    :host([tone='coral']) {
      --_code-accent: var(--cad-post-it-coral-bg, #ffd8ce);
      --_code-accent-ink: var(--cad-post-it-coral-ink, #633b32);
    }

    :host([tone='lemon']) {
      --_code-accent: var(--cad-post-it-lemon-bg, #fff1ac);
      --_code-accent-ink: var(--cad-post-it-lemon-ink, #51491f);
    }

    :host([tone='mint']) {
      --_code-accent: var(--cad-post-it-mint-bg, #d8ffec);
      --_code-accent-ink: var(--cad-post-it-mint-ink, #274f41);
    }

    :host([tone='pink']) {
      --_code-accent: var(--cad-post-it-pink-bg, #ffb7d5);
      --_code-accent-ink: var(--cad-post-it-pink-ink, #52233a);
    }

    :host([tone='violet']) {
      --_code-accent: var(--cad-sticker-violet-bg, #bba0ff);
      --_code-accent-ink: var(--cad-sticker-violet-ink, #30205e);
    }

    figure {
      position: relative;
      margin: 0;
      padding-top: 1.2rem;
    }

    .header {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 1rem;
      display: inline-flex;
      gap: 0.65rem;
      align-items: center;
      max-width: calc(100% - 2rem);
      padding: 0.35rem 0.75rem;
      overflow: hidden;
      color: var(--_code-accent-ink);
      background: var(--_code-accent);
      border-radius: 0.25rem 0.45rem 0.3rem 0.4rem;
      box-shadow: 0 0.25rem 0.4rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.12);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      transform: rotate(-0.5deg);
    }

    .filename {
      overflow: hidden;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .language {
      text-transform: uppercase;
    }

    pre {
      max-width: 100%;
      padding: 1.5rem 1.15rem 1.2rem;
      margin: 0;
      overflow: auto;
      color: var(--cad-code-ink, #edf1ff);
      background: var(--cad-code-bg, #22283a);
      border: 1px solid color-mix(in srgb, var(--_code-accent) 35%, #22283a);
      border-radius: 0.65rem 0.85rem 0.7rem 0.8rem;
      box-shadow: 0 0.65rem 1.4rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.16);
      tab-size: 2;
    }

    code {
      font-family: var(--cad-font-mono, monospace);
      font-size: 0.9rem;
      line-height: 1.65;
    }

    .line {
      display: grid;
      grid-template-columns: 2.4rem minmax(max-content, 1fr);
      min-height: 1.65em;
    }

    .number {
      padding-inline-end: 0.8rem;
      color: color-mix(in srgb, var(--cad-code-ink, #edf1ff) 45%, transparent);
      text-align: end;
      user-select: none;
    }

    @media (forced-colors: active) {
      pre {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }
    }
  `

  declare code: string
  declare filename: string
  declare language: string
  declare showLineNumbers: boolean
  declare tone: CadCodeBlockTone

  constructor() {
    super()
    this.code = ''
    this.filename = ''
    this.language = ''
    this.showLineNumbers = false
    this.tone = 'accent'
  }

  override render() {
    const lines = this.code.replace(/\n$/, '').split('\n')
    const hasHeader = this.filename || this.language
    return html`
      <figure part="base">
        ${
          hasHeader
            ? html`<figcaption class="header" part="header">
                ${
                  this.filename
                    ? html`<span class="filename">${this.filename}</span>`
                    : nothing
                }
                ${
                  this.language
                    ? html`<span class="language">${this.language}</span>`
                    : nothing
                }
              </figcaption>`
            : nothing
        }
        <pre part="pre"><code part="code">${
          this.code
            ? this.showLineNumbers
              ? lines.map(
                  (line, index) =>
                    html`<span class="line"
                      ><span aria-hidden="true" class="number"
                        >${index + 1}</span
                      ><span>${line || '\u00a0'}</span></span
                    >`,
                )
              : this.code
            : html`<slot></slot>`
        }</code></pre>
      </figure>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-code-block')
) {
  customElements.define('cad-code-block', CadCodeBlock)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-code-block': CadCodeBlock
  }
}
