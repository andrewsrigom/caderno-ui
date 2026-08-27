import { css, html, LitElement, nothing } from 'lit'

import {
  renderSystemIcon,
  type CadSystemIconName,
} from '../internal/system-icon.js'

type CadPaginationItem = number | 'ellipsis'
export type CadPaginationVariant = 'boxed' | 'text'

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) =>
    Math.floor(start + index),
  )
}

/**
 * A compact, URL-based pagination landmark for long collections.
 *
 * @slot next-label - Visible next label in the text variant.
 * @slot previous-label - Visible previous label in the text variant.
 * @csspart base - Native navigation landmark.
 * @csspart current - Current page link.
 * @csspart direction - First, previous, next, and last controls.
 * @csspart ellipsis - Omitted page range.
 * @csspart list - Ordered page list.
 * @csspart page - Page link.
 * @cssprop --cad-pagination-accent - Per-instance ink color.
 * @cssprop --cad-pagination-current-bg - Current-page marker color.
 */
export class CadPagination extends LitElement {
  static override properties = {
    baseHref: { attribute: 'base-href', type: String },
    boundaryCount: { attribute: 'boundary-count', type: Number },
    firstLabel: { attribute: 'first-label', type: String },
    hrefs: { type: Array },
    label: { type: String },
    lastLabel: { attribute: 'last-label', type: String },
    nextLabel: { attribute: 'next-label', type: String },
    nextText: { attribute: 'next-text', type: String },
    page: { reflect: true, type: Number },
    pageLabel: { attribute: 'page-label', type: String },
    pageParam: { attribute: 'page-param', type: String },
    previousLabel: { attribute: 'previous-label', type: String },
    previousText: { attribute: 'previous-text', type: String },
    showFirstLast: {
      attribute: 'show-first-last',
      reflect: true,
      type: Boolean,
    },
    siblingCount: { attribute: 'sibling-count', type: Number },
    total: { reflect: true, type: Number },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_pagination-accent: var(
        --cad-pagination-accent,
        var(--cad-link, #005bac)
      );
      --_pagination-current-bg: var(
        --cad-pagination-current-bg,
        color-mix(in srgb, var(--cad-post-it-blue-bg, #cfe2ff) 72%, white)
      );
      display: block;
    }

    nav,
    ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.52rem;
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
      min-width: 2.65rem;
      min-height: 2.65rem;
      box-sizing: border-box;
      padding-inline: 0.45rem;
      color: var(--_pagination-accent);
      border-radius: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.15rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1;
      text-decoration: none;
    }

    .page,
    .direction,
    .disabled {
      position: relative;
      background: var(--cad-surface-raised, #fff);
      border: 1.4px solid var(--_pagination-accent);
      box-shadow: 0.5px 0.75px 0
        color-mix(in srgb, var(--_pagination-accent) 34%, transparent);
    }

    li:nth-child(3n + 1) .page {
      transform: rotate(-0.28deg);
    }

    li:nth-child(3n + 2) .page {
      transform: rotate(0.2deg);
    }

    a:hover {
      color: var(--_pagination-accent);
      background: color-mix(
        in srgb,
        var(--cad-post-it-blue-bg, #cfe2ff) 34%,
        var(--cad-surface-raised, #fff)
      );
      box-shadow:
        inset 0 -2px var(--cad-link-mark, #ff5c5c),
        0.5px 0.75px 0
          color-mix(in srgb, var(--_pagination-accent) 34%, transparent);
    }

    a[aria-current='page'] {
      color: var(--_pagination-accent);
      background:
        repeating-linear-gradient(
          -18deg,
          color-mix(in srgb, var(--_pagination-accent) 13%, transparent) 0 1px,
          transparent 1px 4px
        ),
        var(--_pagination-current-bg);
      border-width: 1.7px;
      font-weight: var(--cad-hand-weight-strong, 700);
      transform: rotate(-0.55deg);
    }

    a:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--_pagination-accent))
      );
      outline-offset: 3px;
    }

    .disabled {
      color: var(--cad-ink-muted, #8a919d);
      border-color: color-mix(in srgb, currentColor 62%, transparent);
      box-shadow: none;
      opacity: 0.42;
    }

    .direction svg,
    .disabled svg {
      width: 1.15rem;
      height: 1.15rem;
    }

    .direction-content {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
      justify-content: center;
    }

    :host([variant='text']) nav {
      gap: 0.75rem;
    }

    :host([variant='text']) ol {
      gap: 0.35rem;
    }

    :host([variant='text']) .page,
    :host([variant='text']) .direction,
    :host([variant='text']) .disabled {
      min-width: 2.25rem;
      background: transparent;
      border-color: transparent;
      box-shadow: none;
      transform: none;
    }

    :host([variant='text']) .direction {
      min-width: auto;
      padding-inline: 0.25rem;
      box-shadow: inset 0 -2px var(--cad-link-mark, #ff5c5c);
    }

    :host([variant='text']) a[aria-current='page'] {
      background:
        repeating-linear-gradient(
          -18deg,
          color-mix(in srgb, var(--_pagination-accent) 11%, transparent) 0 1px,
          transparent 1px 4px
        ),
        var(--_pagination-current-bg);
      border-color: var(--_pagination-accent);
      box-shadow: none;
    }

    :host([variant='text']) a:hover {
      background-color: color-mix(
        in srgb,
        var(--cad-post-it-blue-bg, #cfe2ff) 28%,
        transparent
      );
    }

    @media (max-width: 34rem) {
      nav,
      ol {
        gap: 0.25rem;
      }

      a,
      .disabled,
      .ellipsis {
        min-width: 2.3rem;
        min-height: 2.3rem;
        padding-inline: 0.3rem;
        font-size: 1rem;
      }

      :host([variant='text']) .direction-content span {
        display: none;
      }
    }

    @media (forced-colors: active) {
      a,
      .disabled {
        border-color: CanvasText;
      }
    }
  `

  declare baseHref: string
  declare boundaryCount: number
  declare firstLabel: string
  declare hrefs: string[]
  declare label: string
  declare lastLabel: string
  declare nextLabel: string
  declare nextText: string
  declare page: number
  declare pageLabel: string
  declare pageParam: string
  declare previousLabel: string
  declare previousText: string
  declare showFirstLast: boolean
  declare siblingCount: number
  declare total: number
  declare variant: CadPaginationVariant

  constructor() {
    super()
    this.baseHref = '/'
    this.boundaryCount = 1
    this.firstLabel = 'First page'
    this.hrefs = []
    this.label = 'Pagination'
    this.lastLabel = 'Last page'
    this.nextLabel = 'Next page'
    this.nextText = 'Next'
    this.page = 1
    this.pageLabel = 'Page'
    this.pageParam = 'page'
    this.previousLabel = 'Previous page'
    this.previousText = 'Previous'
    this.showFirstLast = false
    this.siblingCount = 1
    this.total = 1
    this.variant = 'boxed'
  }

  override render() {
    const total = Math.max(1, Math.floor(this.total || 1))
    const page = Math.min(total, Math.max(1, Math.floor(this.page || 1)))
    return html`
      <nav aria-label=${this.label} part="base">
        ${
          this.showFirstLast
            ? this.renderDirection(
                1,
                page === 1,
                'first-page',
                this.firstLabel,
                'first',
              )
            : nothing
        }
        ${this.renderDirection(
          page - 1,
          page === 1,
          'chevron-left',
          this.previousLabel,
          'previous',
        )}
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
                      class="page"
                      href=${this.pageHref(item)}
                      part="page current"
                      >${item}</a
                    >
                  </li>`
                : html`<li>
                    <a
                      aria-label="${this.pageLabel} ${item}"
                      class="page"
                      href=${this.pageHref(item)}
                      part="page"
                      >${item}</a
                    >
                  </li>`,
          )}
        </ol>
        ${this.renderDirection(
          page + 1,
          page === total,
          'chevron-right',
          this.nextLabel,
          'next',
        )}
        ${
          this.showFirstLast
            ? this.renderDirection(
                total,
                page === total,
                'last-page',
                this.lastLabel,
                'last',
              )
            : nothing
        }
      </nav>
    `
  }

  private items(page: number, total: number): CadPaginationItem[] {
    const boundaryCount = Math.max(0, Math.floor(this.boundaryCount || 0))
    const siblingCount = Math.max(0, Math.floor(this.siblingCount || 0))
    const visibleThreshold = boundaryCount * 2 + siblingCount * 2 + 3
    if (total <= visibleThreshold) return range(1, total)

    const startPages = range(1, Math.min(boundaryCount, total))
    const endPages = range(
      Math.max(total - boundaryCount + 1, boundaryCount + 1),
      total,
    )
    const siblingsStart = Math.max(
      Math.min(
        page - siblingCount,
        total - boundaryCount - siblingCount * 2 - 1,
      ),
      boundaryCount + 2,
    )
    const siblingsEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      (endPages[0] ?? total + 1) - 2,
    )

    return [
      ...startPages,
      siblingsStart > boundaryCount + 2 ? 'ellipsis' : boundaryCount + 1,
      ...range(siblingsStart, siblingsEnd),
      siblingsEnd < total - boundaryCount - 1
        ? 'ellipsis'
        : total - boundaryCount,
      ...endPages,
    ].filter(
      (item, index, items): item is CadPaginationItem =>
        item === 'ellipsis' ||
        (typeof item === 'number' &&
          item >= 1 &&
          item <= total &&
          items.findIndex((candidate) => candidate === item) === index),
    )
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
    kind: 'first' | 'last' | 'next' | 'previous',
  ) {
    const content = this.renderDirectionContent(icon, kind)
    return disabled
      ? html`<span
          aria-disabled="true"
          aria-label=${label}
          class="disabled direction ${kind}"
          part="direction"
          >${content}</span
        >`
      : html`<a
          aria-label=${label}
          class="direction ${kind}"
          href=${this.pageHref(target)}
          part="direction"
          >${content}</a
        >`
  }

  private renderDirectionContent(
    icon: CadSystemIconName,
    kind: 'first' | 'last' | 'next' | 'previous',
  ) {
    const isTextDirection =
      this.variant === 'text' && (kind === 'next' || kind === 'previous')
    if (!isTextDirection) return renderSystemIcon(icon)

    const textIcon = kind === 'previous' ? 'arrow-left' : 'arrow-right'

    return kind === 'previous'
      ? html`<span class="direction-content">
          ${renderSystemIcon(textIcon)}
          <span><slot name="previous-label">${this.previousText}</slot></span>
        </span>`
      : html`<span class="direction-content">
          <span><slot name="next-label">${this.nextText}</slot></span>
          ${renderSystemIcon(textIcon)}
        </span>`
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
