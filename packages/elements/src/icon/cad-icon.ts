import { cadIcons, type CadIconName } from '@caderno-ui/icons'
import { css, html, LitElement, nothing, svg } from 'lit'

/**
 * A typed, hand-drawn Caderno UI SVG icon.
 *
 * @csspart svg - The rendered SVG element.
 */
export class CadIcon extends LitElement {
  static override properties = {
    label: { type: String },
    name: { reflect: true, type: String },
    size: { type: String },
  }

  static override styles = css`
    :host {
      display: inline-flex;
      flex: 0 0 auto;
      color: inherit;
      line-height: 0;
      vertical-align: -0.18em;
    }

    svg {
      display: block;
      overflow: visible;
    }

    path {
      vector-effect: non-scaling-stroke;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.55;
    }

    .echo {
      opacity: 0.22;
      transform: translate(0.36px, -0.22px);
    }
  `

  declare label: string
  declare name: CadIconName
  declare size: string

  constructor() {
    super()
    this.label = ''
    this.name = 'spark'
    this.size = '24'
  }

  override render() {
    const paths = cadIcons[this.name] ?? cadIcons.spark
    const label = this.label?.trim() ?? ''
    const isDecorative = label.length === 0

    return html`
      <svg
        aria-hidden=${isDecorative ? 'true' : 'false'}
        aria-label=${isDecorative ? nothing : label}
        fill="none"
        height=${this.size}
        part="svg"
        role=${isDecorative ? nothing : 'img'}
        viewBox="0 0 24 24"
        width=${this.size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g class="echo">${paths.map((path) => svg`<path d=${path}></path>`)}</g>
        <g>${paths.map((path) => svg`<path d=${path}></path>`)}</g>
      </svg>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-icon')) {
  customElements.define('cad-icon', CadIcon)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-icon': CadIcon
  }
}
