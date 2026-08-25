import { css, html, LitElement } from 'lit'

import {
  renderSystemIcon,
  type CadSystemIconName,
} from '../internal/system-icon.js'

type CadPaginationItem = number | 'ellipsis'

/**
 * A compact, URL-based pagination landmark for long collections.
 *
 * @csspart base - Native navigation landmark.
 * @csspart current - Current page link.
 * @csspart direction - Previous and next controls.
 * @csspart ellipsis - Omitted page range.
 * @csspart list - Ordered page list.
 * @csspart page - Page link.
 */
export class CadPagination extends LitElement {
  static override properties = {
    baseHref: { attribute: 'base-href', type: String },
    hrefs: { type: Array },
    label: { type: String },
    nextLabel: { attribute: 'next-label', type: String },
    page: { reflect: true, type: Number },
    pageLabel: { attribute: 'page-label', type: String },
    pageParam: { attribute: 'page-param', type: String },
    previousLabel: { attribute: 'previous-label', type: String },
    total: { reflect: true, type: Number },
  }

  static override styles = css`
    :host {
      display: block;
    }
    nav,
    ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      align-items: center;
      justify-content: center;
    }
    ol {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    a,
    .disabled,
    .ellipsis {
      display: inline-grid;
      place-items: center;
      min-width: 2.75rem;
      min-height: 2.75rem;
      padding-inline: 0.35rem;
      color: var(--cad-ink-muted, currentColor);
      border-radius: 50% 48% 52% 47%;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
      text-decoration: none;
    }
    a:hover {
      color: var(--cad-link, currentColor);
      background: var(--cad-control-hover, transparent);
    }
    a[aria-current='page'] {
      color: var(--cad-post-it-blue-ink, #20375d);
      background: var(--cad-post-it-blue-bg, #cfe2ff);
      border: 1.5px solid color-mix(in srgb, currentColor 44%, transparent);
      transform: rotate(-1deg);
    }
    a:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }
    .direction,
    .disabled {
      border: 1px dashed var(--cad-line-strong, currentColor);
    }
    .disabled {
      opacity: 0.42;
    }
    .direction svg,
    .disabled svg {
      width: 1.05rem;
      height: 1.05rem;
    }
    @media (forced-colors: active) {
      a,
      .disabled {
        border-color: CanvasText;
      }
    }
  `

  declare baseHref: string
  declare hrefs: string[]
  declare label: string
  declare nextLabel: string
  declare page: number
  declare pageLabel: string
  declare pageParam: string
  declare previousLabel: string
  declare total: number

  constructor() {
    super()
    this.baseHref = '/'
    this.hrefs = []
    this.label = 'Pagination'
    this.nextLabel = 'Next page'
    this.page = 1
    this.pageLabel = 'Page'
    this.pageParam = 'page'
    this.previousLabel = 'Previous page'
    this.total = 1
  }

  override render() {
    const total = Math.max(1, Math.floor(this.total || 1))
    const page = Math.min(total, Math.max(1, Math.floor(this.page || 1)))
    return html`
      <nav aria-label=${this.label} part="base">
        ${this.renderDirection(page - 1, page === 1, 'arrow-left', this.previousLabel)}
        <ol part="list">
          ${this.items(page, total).map((item) =>
            item === 'ellipsis'
              ? html`<li>
                  <span aria-hidden="true" class="ellipsis" part="ellipsis"
                    >…</span
                  >
                </li>`
              : item === page
                ? html`<li>
                    <a
                      aria-current="page"
                      aria-label="${this.pageLabel} ${item}"
                      href=${this.pageHref(item)}
                      part="page current"
                      >${item}</a
                    >
                  </li>`
                : html`<li>
                    <a
                      aria-label="${this.pageLabel} ${item}"
                      href=${this.pageHref(item)}
                      part="page"
                      >${item}</a
                    >
                  </li>`,
          )}
        </ol>
        ${this.renderDirection(page + 1, page === total, 'arrow-right', this.nextLabel)}
      </nav>
    `
  }

  private items(page: number, total: number): CadPaginationItem[] {
    const pages = [...new Set([1, page - 1, page, page + 1, total])]
      .filter((item) => item >= 1 && item <= total)
      .sort((a, b) => a - b)
    const items: CadPaginationItem[] = []
    pages.forEach((item, index) => {
      const previous = pages[index - 1]
      if (previous && item - previous > 1) items.push('ellipsis')
      items.push(item)
    })
    return items
  }

  private pageHref(target: number): string {
    const explicitHref = this.hrefs[target - 1]
    if (explicitHref) return explicitHref
    const url = new URL(this.baseHref, 'https://caderno-ui.local')
    if (target <= 1) url.searchParams.delete(this.pageParam)
    else url.searchParams.set(this.pageParam, String(target))
    return `${url.pathname}${url.search}${url.hash}`
  }

  private renderDirection(
    target: number,
    disabled: boolean,
    icon: CadSystemIconName,
    label: string,
  ) {
    return disabled
      ? html`<span
          aria-disabled="true"
          aria-label=${label}
          class="disabled"
          part="direction"
          >${renderSystemIcon(icon)}</span
        >`
      : html`<a
          aria-label=${label}
          class="direction"
          href=${this.pageHref(target)}
          part="direction"
          >${renderSystemIcon(icon)}</a
        >`
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-pagination')
)
  customElements.define('cad-pagination', CadPagination)

declare global {
  interface HTMLElementTagNameMap {
    'cad-pagination': CadPagination
  }
}
