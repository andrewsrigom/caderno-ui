import { css, html, LitElement, nothing } from 'lit'

export type CadLinkTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadLinkVariant = 'highlight' | 'plain' | 'underline'
export type CadLinkCurrent =
  '' | 'date' | 'false' | 'location' | 'page' | 'step' | 'time' | 'true'

/**
 * A notebook link with marker and hand-drawn underline treatments.
 *
 * @slot - Link label.
 * @slot end - Optional trailing visual.
 * @slot start - Optional leading visual.
 * @csspart base - Native anchor.
 * @csspart end - Trailing composition slot.
 * @csspart external - External-link indicator.
 * @csspart start - Leading composition slot.
 * @cssprop --cad-link-mark - Per-instance marker color.
 * @cssprop --cad-link-ink - Per-instance text color.
 */
export class CadLink extends LitElement {
  static override properties = {
    current: { attribute: 'aria-current', reflect: true, type: String },
    disabled: { reflect: true, type: Boolean },
    download: { type: String },
    external: { reflect: true, type: Boolean },
    href: { type: String },
    label: { type: String },
    rel: { type: String },
    target: { type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_link-mark: var(--cad-link-mark, #ef4d4f);
      --_link-ink: var(--cad-link-ink, var(--cad-link, #005bac));
      display: inline;
    }

    :host([tone='coral']) {
      --_link-mark: var(--cad-link-mark, #ff3347);
      --_link-ink: var(--cad-link-ink, #e62436);
    }

    :host([tone='lemon']) {
      --_link-mark: var(--cad-link-mark, #f0a11a);
      --_link-ink: var(--cad-link-ink, #80530d);
    }

    :host([tone='mint']) {
      --_link-mark: var(--cad-link-mark, #1aa36e);
      --_link-ink: var(--cad-link-ink, #087a4f);
    }

    :host([tone='pink']) {
      --_link-mark: var(--cad-link-mark, #ef669c);
      --_link-ink: var(--cad-link-ink, #a92b60);
    }

    :host([tone='violet']) {
      --_link-mark: var(--cad-link-mark, #ff5c5c);
      --_link-ink: var(--cad-link-ink, #7131b5);
    }

    .base {
      padding: 0.08rem 0.08rem 0.15rem;
      color: var(--_link-ink);
      font-family: var(--cad-type-control-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, 1.05rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      text-decoration: none;
      background-image: linear-gradient(
        180deg,
        transparent 0 calc(100% - 2px),
        var(--_link-mark) calc(100% - 2px) 100%
      );
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: 100% 100%;
      border-radius: 0;
      box-decoration-break: clone;
      cursor: pointer;
      transition:
        background-size var(--cad-duration-fast, 140ms) ease,
        color var(--cad-duration-fast, 140ms) ease;
      -webkit-box-decoration-break: clone;
    }

    :host([variant='highlight']) .base {
      background-image: linear-gradient(
        180deg,
        transparent 62%,
        color-mix(in srgb, var(--_link-mark) 28%, transparent) 63% 88%,
        transparent 89% calc(100% - 2px),
        var(--_link-mark) calc(100% - 2px) 100%
      );
    }

    :host([variant='plain']) .base {
      padding-block-end: 0.08rem;
      background: none;
    }

    .base:not([aria-disabled='true']):hover {
      background-image: linear-gradient(
        180deg,
        transparent 0 calc(100% - 3.5px),
        var(--_link-mark) calc(100% - 3.5px) 100%
      );
    }

    :host([variant='plain']) .base:not([aria-disabled='true']):hover {
      background: color-mix(in srgb, var(--_link-ink) 7%, transparent);
    }

    .base:visited {
      color: #7131b5;
    }

    :host([tone='coral']) .base:visited {
      color: var(--_link-ink);
    }

    .base:not([aria-disabled='true']):active {
      opacity: 0.78;
      transform: translateY(1px);
    }

    .base:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--cad-link, #005bac))
      );
      outline-offset: 3px;
    }

    .base[aria-disabled='true'] {
      --_link-ink: var(--cad-ink-muted, #8a919d);
      --_link-mark: #9aa1ab;
      cursor: not-allowed;
      opacity: 0.72;
    }

    .external {
      position: relative;
      display: inline-block;
      width: 0.9em;
      height: 0.9em;
      margin-inline-start: 0.42rem;
      color: currentColor;
      vertical-align: 0.02em;
    }

    .external::before {
      position: absolute;
      inset: 0.22em 0 0 0;
      border: 1.5px solid currentColor;
      border-block-start-color: transparent;
      content: '';
    }

    .external::after {
      position: absolute;
      top: -0.12em;
      right: -0.1em;
      width: 0.6em;
      height: 0.6em;
      border-block-start: 1.5px solid currentColor;
      border-inline-end: 1.5px solid currentColor;
      content: '';
      box-shadow: -0.2em 0.2em 0 -0.08em currentColor;
    }

    ::slotted([slot='start']),
    ::slotted([slot='end']) {
      display: inline-block;
      color: currentColor;
      vertical-align: -0.15em;
    }

    ::slotted([slot='start']) {
      margin-inline-end: 0.28rem;
    }

    ::slotted([slot='end']) {
      margin-inline-start: 0.28rem;
    }

    @media (forced-colors: active) {
      .base {
        color: LinkText;
        text-decoration: underline;
      }
    }
  `

  declare current: CadLinkCurrent
  declare disabled: boolean
  declare download: string
  declare external: boolean
  declare href: string
  declare label: string
  declare rel: string
  declare target: string
  declare tone: CadLinkTone
  declare variant: CadLinkVariant

  constructor() {
    super()
    this.current = ''
    this.disabled = false
    this.download = ''
    this.external = false
    this.href = ''
    this.label = ''
    this.rel = ''
    this.target = ''
    this.tone = 'blue'
    this.variant = 'underline'
  }

  override render() {
    const target = this.target || (this.external ? '_blank' : '')
    const rel = this.rel || (this.external ? 'noopener noreferrer' : '')
    const downloads = this.hasAttribute('download')

    return html`
      <a
        aria-current=${this.current || nothing}
        aria-disabled=${this.disabled ? 'true' : nothing}
        aria-label=${this.label || nothing}
        class="base"
        download=${downloads ? this.download : nothing}
        href=${this.disabled ? nothing : this.href || nothing}
        part="base"
        rel=${rel || nothing}
        tabindex=${this.disabled ? '-1' : nothing}
        target=${target || nothing}
        @click=${this.handleClick}
      >
        <slot name="start" part="start"></slot>
        <slot></slot>
        ${
          this.external
            ? html`<span
                aria-hidden="true"
                class="external"
                part="external"
              ></span>`
            : nothing
        }
        <slot name="end" part="end"></slot>
      </a>
    `
  }

  private handleClick(event: MouseEvent): void {
    if (!this.disabled) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-link')) {
  customElements.define('cad-link', CadLink)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-link': CadLink
  }
}
