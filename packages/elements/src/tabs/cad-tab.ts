import { css, html, LitElement } from 'lit'

export type CadTabTone =
  'accent' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * A declarative panel consumed by `cad-tabs`.
 *
 * @slot - Panel content.
 * @csspart panel - Panel content container.
 */
export class CadTab extends LitElement {
  static override properties = {
    icon: { reflect: true, type: String },
    label: { reflect: true, type: String },
    name: { reflect: true, type: String },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
      color: var(--cad-ink, currentColor);
      font-family: var(--cad-font-book, serif);
      font-size: 1rem;
      line-height: 1.65;
    }

    :host([hidden]) {
      display: none;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }
  `

  declare icon: string
  declare label: string
  declare name: string
  declare tone: CadTabTone

  constructor() {
    super()
    this.icon = ''
    this.label = ''
    this.name = ''
    this.tone = 'accent'
  }

  override render() {
    return html`<div part="panel"><slot></slot></div>`
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-tab')) {
  customElements.define('cad-tab', CadTab)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-tab': CadTab
  }
}
