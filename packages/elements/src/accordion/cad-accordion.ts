import { css, html, LitElement, nothing } from 'lit'

import {
  CadAccordionItem,
  type CadAccordionToggleEvent,
} from './cad-accordion-item.js'

export {
  CadAccordionItem,
  type CadAccordionAnimation,
  type CadAccordionToggleDetail,
  type CadAccordionToggleEvent,
  type CadAccordionTone,
} from './cad-accordion-item.js'

export type CadAccordionMode = 'multiple' | 'single'

/**
 * Coordinates notebook disclosure items, optionally allowing one open item.
 *
 * @slot - `cad-accordion-item` elements.
 * @csspart base - Accordion container.
 */
export class CadAccordion extends LitElement {
  static override properties = {
    label: { type: String },
    mode: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: grid;
    }

    .base {
      display: grid;
      gap: 0.75rem;
    }
  `

  declare label: string
  declare mode: CadAccordionMode

  constructor() {
    super()
    this.label = ''
    this.mode = 'multiple'
  }

  override render() {
    return html`
      <div
        aria-label=${this.label || nothing}
        class="base"
        part="base"
        role=${this.label ? 'group' : nothing}
        @cad-accordion-toggle=${this.handleToggle}
      >
        <slot></slot>
      </div>
    `
  }

  private handleToggle(event: CadAccordionToggleEvent): void {
    if (this.mode !== 'single' || !event.detail.open) return
    const item = event.target
    if (
      !(item instanceof CadAccordionItem) ||
      item.closest('cad-accordion') !== this
    ) {
      return
    }

    for (const sibling of this.querySelectorAll('cad-accordion-item')) {
      if (sibling !== item) sibling.open = false
    }
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-accordion')
) {
  customElements.define('cad-accordion', CadAccordion)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-accordion': CadAccordion
  }
}
