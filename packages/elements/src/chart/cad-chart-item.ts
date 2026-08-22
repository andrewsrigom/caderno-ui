import { css, html, LitElement } from 'lit'

/**
 * A declarative data point consumed by `cad-chart`.
 *
 * @slot - Progressive fallback text shown before the element upgrades.
 */
export class CadChartItem extends LitElement {
  static override properties = {
    color: { reflect: true, type: String },
    label: { reflect: true, type: String },
    value: { reflect: true, type: Number },
  }

  static override styles = css`
    :host {
      display: none;
    }
  `

  declare color: string
  declare label: string
  declare value: number

  constructor() {
    super()
    this.color = ''
    this.label = ''
    this.value = 0
  }

  override render() {
    return html`<slot>${this.label}: ${this.value}</slot>`
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-chart-item')
) {
  customElements.define('cad-chart-item', CadChartItem)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-chart-item': CadChartItem
  }
}
