import { css, html, LitElement, nothing } from 'lit'

export type CadCodeBlockTone =
  'accent' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadCodeCopyDetail = { success: boolean }
export type CadCodeCopyEvent = CustomEvent<CadCodeCopyDetail>

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
 * @fires cad-code-copy - Reports whether the source was copied to the clipboard.
 * @csspart copy - Optional compact copy button.
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
    copyable: { reflect: true, type: Boolean },
    copyLabel: { attribute: 'copy-label', type: String },
    copiedLabel: { attribute: 'copied-label', type: String },
    copyErrorLabel: { attribute: 'copy-error-label', type: String },
    copying: { attribute: false, state: true },
    copyMessage: { attribute: false, state: true },
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

    .header {
      position: absolute;
      z-index: 1;
      top: 0.65rem;
      right: 0.65rem;
      left: 0.75rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      min-width: 0;
      padding: 0;
      color: color-mix(in srgb, var(--cad-code-ink, #edf1ff) 72%, transparent);
      font-family: var(--cad-font-mono, monospace);
      font-size: 0.7rem;
    }

    .filename {
      overflow: hidden;
      margin-inline-end: auto;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .language {
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .language:first-child {
      margin-inline-start: auto;
    }

    .actions {
      display: inline-flex;
      flex: 0 0 auto;
      align-items: center;
      margin-inline-start: auto;
    }

    .copy,
    ::slotted(button[slot='actions']) {
      min-height: 1.65rem;
      min-width: 3.25rem;
      padding: 0.15rem 0.5rem;
      color: var(--_code-accent-ink);
      background: var(--_code-accent);
      border: 1px solid
        color-mix(in srgb, var(--_code-accent-ink) 30%, transparent);
      border-radius: 0;
      cursor: pointer;
      font-family: var(--cad-font-ui, sans-serif);
      font-size: 0.7rem;
      font-weight: 700;
      line-height: 1;
    }

    .copy:focus-visible {
      outline: var(--cad-focus-outline, 2px dashed currentColor);
      outline-offset: 2px;
    }

    .copy:disabled {
      cursor: progress;
    }

    .copy-status {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    pre {
      max-width: 100%;
      padding: 1.5rem 1.15rem 1.2rem;
      margin: 0;
      overflow: auto;
      color: var(--cad-code-ink, #edf1ff);
      background: var(--cad-code-bg, #22283a);
      border: 1px solid color-mix(in srgb, var(--_code-accent) 35%, #22283a);
      border-radius: 0;
      box-shadow: 0 0.65rem 1.4rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.16);
      tab-size: 2;
    }

    figure.has-header pre {
      padding-top: 3rem;
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
      .header {
        color: CanvasText;
        forced-color-adjust: none;
      }

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
  declare copyable: boolean
  declare copyLabel: string
  declare copiedLabel: string
  declare copyErrorLabel: string
  declare private copying: boolean
  declare private copyMessage: string
  declare filename: string
  declare language: string
  declare showLineNumbers: boolean
  declare tone: CadCodeBlockTone
  private copyTimer: ReturnType<typeof setTimeout> | undefined

  constructor() {
    super()
    this.code = ''
    this.copyable = false
    this.copyLabel = 'Copy'
    this.copiedLabel = 'Copied'
    this.copyErrorLabel = 'Copy failed'
    this.copying = false
    this.copyMessage = ''
    this.filename = ''
    this.language = ''
    this.showLineNumbers = false
    this.tone = 'accent'
  }

  override disconnectedCallback(): void {
    clearTimeout(this.copyTimer)
    super.disconnectedCallback()
  }

  async copy(): Promise<boolean> {
    if (this.copying) return false
    this.copying = true
    clearTimeout(this.copyTimer)
    let success: boolean
    const source =
      this.code ||
      [...this.childNodes]
        .filter(
          (node) => !(node instanceof Element) || !node.getAttribute('slot'),
        )
        .map((node) => node.textContent ?? '')
        .join('')
    try {
      await navigator.clipboard.writeText(source)
      success = true
    } catch {
      success = false
    } finally {
      this.copying = false
    }
    this.copyMessage = success ? this.copiedLabel : this.copyErrorLabel
    this.dispatchEvent(
      new CustomEvent<CadCodeCopyDetail>('cad-code-copy', {
        bubbles: true,
        composed: true,
        detail: { success },
      }),
    )
    if (this.isConnected) {
      this.copyTimer = setTimeout(() => {
        this.copyMessage = ''
      }, 1800)
    }
    return success
  }

  override render() {
    const lines = this.code.replace(/\n$/, '').split('\n')
    const hasHeader =
      this.copyable ||
      this.filename ||
      this.language ||
      this.querySelector('[slot="actions"]')
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
            ${
              this.copyable
                ? html`<button
                    class="copy"
                    part="copy"
                    type="button"
                    ?disabled=${this.copying}
                    @click=${() => this.copy()}
                  >
                    ${this.copyMessage || this.copyLabel}
                  </button>`
                : nothing
            }
            <slot
              name="actions"
              @slotchange=${() => this.requestUpdate()}
            ></slot>
          </span>
        </figcaption>
        <span class="copy-status" role="status">${this.copyMessage}</span>
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
