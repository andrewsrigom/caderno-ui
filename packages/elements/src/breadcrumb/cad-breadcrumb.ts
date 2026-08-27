import { css, html, LitElement, type PropertyValues } from 'lit'

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
  static override properties = {
    label: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    :host([variant='compact']) .list {
      flex-wrap: nowrap;
      gap: 0.35rem;
      overflow: hidden;
    }
  `

  declare label: string
  declare variant: 'compact' | 'default'

  constructor() {
    super()
    this.label = 'Breadcrumb'
    this.variant = 'default'
  }

  override render() {
    return html`<nav aria-label=${this.label} part="base">
      <div class="list" part="list" role="list">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    </nav>`
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('variant')) {
      this.syncItems(this.renderRoot.querySelector('slot'))
    }
  }

  private handleSlotChange(event: Event): void {
    const slot = event.currentTarget
    this.syncItems(slot instanceof HTMLSlotElement ? slot : null)
  }

  private syncItems(slot: HTMLSlotElement | null): void {
    if (!slot) return
    const items = slot
      .assignedElements({ flatten: true })
      .filter(
        (item): item is CadBreadcrumbItem => item instanceof CadBreadcrumbItem,
      )
    const hasCurrent = items.some((item) => item.current)
    items.forEach((item, index) => {
      item.first = index === 0
      item.variant = this.variant
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
