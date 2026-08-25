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
      gap: 0.35rem;
      align-items: center;
      min-width: 0;
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1.1;
    }

    a,
    .current {
      color: inherit;
      overflow-wrap: anywhere;
    }

    a {
      text-decoration: underline;
      text-decoration-color: color-mix(
        in srgb,
        var(--cad-link, currentColor) 48%,
        transparent
      );
      text-decoration-style: wavy;
      text-underline-offset: 0.2rem;
    }

    a:hover {
      color: var(--cad-link, currentColor);
    }
    a:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }

    .current {
      color: var(--cad-ink, currentColor);
      background: linear-gradient(
        transparent 62%,
        color-mix(in srgb, var(--cad-post-it-blue-bg, #cfe2ff) 65%, transparent)
          63%,
        color-mix(in srgb, var(--cad-post-it-blue-bg, #cfe2ff) 65%, transparent)
          94%,
        transparent 95%
      );
      font-weight: var(--cad-hand-weight-strong, 700);
    }

    .separator {
      display: inline-grid;
      color: var(--cad-ink-muted, currentColor);
      transform: rotate(-2deg);
    }

    .separator svg {
      width: 0.95rem;
      height: 0.95rem;
    }

    :host([variant='compact']) {
      min-width: 0;
    }

    :host([variant='compact'][current]) {
      flex: 1 1 auto;
      overflow: hidden;
    }

    :host([variant='compact']) .item {
      font-family: var(--cad-font-text, var(--cad-font-book, serif));
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.35;
    }

    :host([variant='compact']) a {
      text-decoration: none;
    }

    :host([variant='compact']) .current {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: none;
      font-weight: 600;
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
        ${this.first ? null : html`<span aria-hidden="true" class="separator" part="separator">${renderSystemIcon('arrow-right')}</span>`}
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
