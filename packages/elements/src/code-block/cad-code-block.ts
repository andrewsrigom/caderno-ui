import { css, html, LitElement, nothing } from 'lit'

export type CadCodeBlockTone =
  'accent' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

type SyntaxTokenKind =
  | 'attribute'
  | 'comment'
  | 'keyword'
  | 'literal'
  | 'number'
  | 'property'
  | 'punctuation'
  | 'string'
  | 'tag'

type SyntaxToken = {
  kind?: SyntaxTokenKind
  value: string
}

const scriptKeywords = new Set([
  'as',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'of',
  'private',
  'protected',
  'public',
  'readonly',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'type',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
])

const scriptPattern =
  /(\/\/.*$|\/\*.*?\*\/|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:+*/%=<>!?&|~-])/g
const markupPattern =
  /(<!--.*?-->|<\/?[A-Za-z][\w:-]*|\/?>|[\w:@-]+(?=\s*=)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[={}])/g
const stylePattern =
  /(\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--[\w-]+|-?[A-Za-z][\w-]*(?=\s*:)|(?:[.#]|::?)?-?[A-Za-z][\w-]*(?=\s*[{,])|\b\d+(?:\.\d+)?(?:%|[a-z]+)?\b|[{}():;,])/gi
const shellPattern =
  /(#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--?[\w-]+|\b(?:cd|curl|echo|export|git|npm|npx|pnpm|yarn)\b|\b\d+\b|[|&;])/g

function tokenKind(
  value: string,
  language: string,
): SyntaxTokenKind | undefined {
  const isShell = ['bash', 'shell', 'sh'].includes(language)
  if (
    value.startsWith('<!--') ||
    value.startsWith('//') ||
    value.startsWith('/*')
  ) {
    return 'comment'
  }
  if (isShell && value.startsWith('#')) return 'comment'
  if (/^["'`]/.test(value)) return 'string'
  if (/^\d/.test(value)) return 'number'

  if (language === 'html' || language === 'astro' || language === 'markup') {
    if (/^<\/?[A-Za-z]/.test(value)) return 'tag'
    if (/^[\w:@-]+$/.test(value)) return 'attribute'
    return 'punctuation'
  }

  if (language === 'css' || language === 'scss') {
    if (value.startsWith('--') || /[A-Za-z]/.test(value)) return 'property'
    return 'punctuation'
  }

  if (scriptKeywords.has(value)) return 'keyword'
  if (['false', 'null', 'true', 'undefined'].includes(value)) return 'literal'
  if (/^[{}()[\].,;:+*/%=<>!?&|~-]$/.test(value)) return 'punctuation'
  if (isShell && (/^-/.test(value) || /^[a-z]+$/.test(value))) {
    return 'keyword'
  }
  return undefined
}

function syntaxPattern(language: string): RegExp | undefined {
  if (['astro', 'html', 'markup'].includes(language)) return markupPattern
  if (['css', 'scss'].includes(language)) return stylePattern
  if (['bash', 'shell', 'sh'].includes(language)) return shellPattern
  if (
    ['js', 'javascript', 'json', 'jsx', 'ts', 'tsx', 'typescript'].includes(
      language,
    )
  ) {
    return scriptPattern
  }
  return undefined
}

function tokenize(line: string, language: string): SyntaxToken[] {
  const normalizedLanguage = language.toLowerCase()
  const pattern = syntaxPattern(normalizedLanguage)
  if (!pattern) return [{ value: line }]

  pattern.lastIndex = 0
  const tokens: SyntaxToken[] = []
  let cursor = 0
  for (const match of line.matchAll(pattern)) {
    const index = match.index
    if (index > cursor) tokens.push({ value: line.slice(cursor, index) })
    const kind = tokenKind(match[0], normalizedLanguage)
    tokens.push(kind ? { kind, value: match[0] } : { value: match[0] })
    cursor = index + match[0].length
  }
  if (cursor < line.length) tokens.push({ value: line.slice(cursor) })
  return tokens
}

/**
 * A readable notebook code sample with optional filename and line numbers.
 *
 * @slot - Progressive code content used when `code` is not set.
 * @slot actions - Optional actions such as an application-owned copy button.
 * @csspart base - Native figure.
 * @csspart code - Native code element.
 * @csspart header - Filename and language metadata.
 * @csspart pre - Native preformatted block.
 * @cssprop --cad-code-bg - Code surface color.
 * @cssprop --cad-code-ink - Code foreground color.
 * @cssprop --cad-code-comment - Syntax comment color.
 * @cssprop --cad-code-keyword - Syntax keyword color.
 * @cssprop --cad-code-string - Syntax string color.
 * @cssprop --cad-code-number - Syntax number color.
 * @cssprop --cad-code-tag - Syntax tag color.
 * @cssprop --cad-code-attribute - Syntax attribute color.
 * @cssprop --cad-code-property - Syntax property color.
 * @cssprop --cad-code-punctuation - Syntax punctuation color.
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
    }

    figure.has-header {
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

    .actions {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      margin-inline-start: auto;
    }

    ::slotted([slot='actions']) {
      padding: 0.2rem 0.45rem;
      color: inherit;
      background: color-mix(in srgb, currentColor 8%, transparent);
      border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
      border-radius: 0.3rem;
      cursor: pointer;
      font: inherit;
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

    .token.comment {
      color: var(--cad-code-comment, #b7c1d8);
      font-style: italic;
    }

    .token.keyword,
    .token.literal {
      color: var(--cad-code-keyword, #ffacd0);
    }

    .token.string {
      color: var(--cad-code-string, #bfe68f);
    }

    .token.number {
      color: var(--cad-code-number, #ffd479);
    }

    .token.tag {
      color: var(--cad-code-tag, #91dcff);
    }

    .token.attribute {
      color: var(--cad-code-attribute, #d0bdff);
    }

    .token.property {
      color: var(--cad-code-property, #9fdcff);
    }

    .token.punctuation {
      color: var(--cad-code-punctuation, #d7dded);
    }

    @media (forced-colors: active) {
      pre {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
        forced-color-adjust: none;
      }

      .token.token {
        color: CanvasText;
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
    const hasHeader =
      this.filename || this.language || this.querySelector('[slot="actions"]')
    return html`
      <figure class=${hasHeader ? 'has-header' : ''} part="base">
        <figcaption ?hidden=${!hasHeader} class="header" part="header">
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
          <span class="actions">
            <slot
              name="actions"
              @slotchange=${() => this.requestUpdate()}
            ></slot>
          </span>
        </figcaption>
        <pre part="pre"><code part="code">${
          this.code
            ? this.showLineNumbers
              ? lines.map(
                  (line, index) =>
                    html`<span class="line"
                      ><span aria-hidden="true" class="number"
                        >${index + 1}</span
                      ><span>${this.renderLine(line) || '\u00a0'}</span></span
                    >`,
                )
              : lines.map(
                  (line, index) =>
                    html`${this.renderLine(line)}${
                      index < lines.length - 1 ? '\n' : nothing
                    }`,
                )
            : html`<slot></slot>`
        }</code></pre>
      </figure>
    `
  }

  private renderLine(line: string) {
    return tokenize(line, this.language).map((token) =>
      token.kind
        ? html`<span class="token ${token.kind}">${token.value}</span>`
        : token.value,
    )
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
