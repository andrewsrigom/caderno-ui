import { css, html, LitElement } from 'lit'

import { CadBreadcrumbItem } from './cad-breadcrumb-item.js'

export { CadBreadcrumbItem } from './cad-breadcrumb-item.js'

/**
 * A semantic breadcrumb trail composed from `cad-breadcrumb-item` children.
 *
 * @slot - Breadcrumb items.
 * @csspart base - Native navigation landmark.
 * @csspart list - Breadcrumb list.
 */
export class CadBreadcrumb extends LitElement {
  static override properties = { label: { type: String } }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      align-items: center;
      padding: 0;
      margin: 0;
      list-style: none;
    }
  `

  declare label: string

  constructor() {
    super()
    this.label = 'Breadcrumb'
  }

  override render() {
    return html`<nav aria-label=${this.label} part="base">
      <div class="list" part="list" role="list">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    </nav>`
  }

  private handleSlotChange(event: Event): void {
    const slot = event.currentTarget
    if (!(slot instanceof HTMLSlotElement)) return
    const items = slot
      .assignedElements({ flatten: true })
      .filter(
        (item): item is CadBreadcrumbItem => item instanceof CadBreadcrumbItem,
      )
    const hasCurrent = items.some((item) => item.current)
    items.forEach((item, index) => {
      item.first = index === 0
      if (!hasCurrent) item.current = index === items.length - 1
    })
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-breadcrumb')
) {
  customElements.define('cad-breadcrumb', CadBreadcrumb)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-breadcrumb': CadBreadcrumb
  }
}
