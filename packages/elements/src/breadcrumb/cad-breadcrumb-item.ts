import { css, html, LitElement } from 'lit'

import { renderSystemIcon } from '../internal/system-icon.js'

/**
 * One link or current-page label inside a `cad-breadcrumb`.
 *
 * @slot - Item label.
 * @csspart base - List item.
 * @csspart link - Navigable item.
 * @csspart current - Current-page label.
 * @csspart separator - Decorative separator.
 */
export class CadBreadcrumbItem extends LitElement {
  static override properties = {
    current: { reflect: true, type: Boolean },
    first: { state: true },
    href: { type: String },
    rel: { type: String },
    target: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: inline-flex;
      min-width: 0;
    }

    .item {
      display: inline-flex;
      gap: 0.45rem;
      align-items: center;
      min-width: 0;
      color: var(--cad-link, #005bac);
      font-family: var(--cad-type-control-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, var(--cad-hand-sm, 1.05rem));
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: var(--cad-type-title-line-height, 1.15);
    }

    a,
    .current {
      position: relative;
      box-sizing: border-box;
      padding: 0.12rem 0.08rem 0.18rem;
      color: inherit;
      background: transparent;
      border: 0;
      border-radius: 0;
      overflow-wrap: anywhere;
      transform: none;
    }

    a {
      text-decoration: none;
    }

    a::after {
      position: absolute;
      right: 0.04rem;
      bottom: 0;
      left: 0.04rem;
      height: 2px;
      background: var(--cad-link-mark, #ef4d4f);
      content: '';
      transform: rotate(-0.7deg);
      transform-origin: left center;
    }

    a:hover {
      color: var(--cad-link, currentColor);
    }

    a:hover::after {
      height: 3px;
      transform: rotate(0.25deg);
    }

    a:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, currentColor)
      );
      outline-offset: 3px;
    }

    .current {
      color: var(--cad-ink-muted, #68738c);
      font-weight: var(--cad-hand-weight-strong, 700);
    }

    .separator {
      display: inline-grid;
      color: color-mix(in srgb, var(--cad-link, currentColor) 72%, transparent);
      transform: rotate(-1deg) translateY(0.02rem);
    }

    .separator svg {
      width: 0.9rem;
      height: 0.9rem;
    }

    :host([variant='compact']) {
      min-width: 0;
    }

    :host([variant='compact'][current]) {
      flex: 1 1 auto;
      overflow: hidden;
    }

    :host([variant='compact']) .item {
      font-family: var(--cad-type-meta-font, var(--cad-font-book, serif));
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.35;
    }

    :host([variant='compact']) a {
      padding: 0;
      background: none;
      border: 0;
      border-radius: 0;
      text-decoration: none;
      transform: none;
    }

    :host([variant='compact']) .current {
      padding: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: none;
      border: 0;
      border-radius: 0;
      font-weight: 600;
      transform: none;
    }

    :host([variant='compact']) .separator {
      color: var(--cad-line-strong, currentColor);
      transform: none;
    }

    @media (max-width: 639px) {
      :host([variant='compact'][current]) {
        display: none;
      }
    }
    @media (forced-colors: active) {
      a,
      .current {
        color: LinkText;
      }
    }
  `

  declare current: boolean
  declare first: boolean
  declare href: string
  declare rel: string
  declare target: string
  declare variant: 'compact' | 'default'

  constructor() {
    super()
    this.current = false
    this.first = false
    this.href = ''
    this.rel = ''
    this.target = ''
    this.variant = 'default'
  }

  override render() {
    const label = html`<slot></slot>`
    return html`
      <span class="item" part="base" role="listitem">
        ${this.first ? null : html`<span aria-hidden="true" class="separator" part="separator">${renderSystemIcon('chevron-right')}</span>`}
        ${this.href && !this.current ? html`<a href=${this.href} part="link" rel=${this.rel || undefined} target=${this.target || undefined}>${label}</a>` : html`<span aria-current=${this.current ? 'page' : undefined} class="current" part="current">${label}</span>`}
      </span>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-breadcrumb-item')
) {
  customElements.define('cad-breadcrumb-item', CadBreadcrumbItem)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-breadcrumb-item': CadBreadcrumbItem
  }
}
