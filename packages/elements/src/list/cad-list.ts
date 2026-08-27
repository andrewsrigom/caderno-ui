import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

import { renderSystemIcon } from '../internal/system-icon.js'

export type CadListVariant = 'bullet' | 'numbered'

/**
 * One navigable or static row inside `cad-list`.
 *
 * @slot - Item label.
 * @csspart arrow - Trailing direction mark.
 * @csspart item - Accessible list item.
 * @csspart label - Visible item label.
 * @csspart marker - Bullet or number marker.
 * @csspart row - Native link or static row.
 */
export class CadListItem extends LitElement {
  static override properties = {
    current: { reflect: true, type: Boolean },
    disabled: { reflect: true, type: Boolean },
    href: { type: String },
    index: { attribute: false, state: true },
    rel: { type: String },
    target: { type: String },
    value: { type: String },
    variant: { attribute: false, state: true },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      color: var(--cad-link, #005bac);
    }

    .row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-height: 3.25rem;
      padding: 0.7rem 1rem;
      color: inherit;
      background: var(--cad-surface, #fff);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        color-mix(in srgb, var(--cad-link, #005bac) 82%, transparent);
      border-radius: 0;
      font-family: var(--cad-type-control-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-control-size, var(--cad-hand-md, 1.2rem));
      line-height: 1.25;
      text-decoration: none;
      transform: rotate(-0.06deg);
    }

    a.row {
      cursor: pointer;
    }

    a.row:hover {
      background: color-mix(
        in srgb,
        var(--cad-post-it-blue-bg, #cfe2ff) 24%,
        var(--cad-surface, #fff)
      );
    }

    a.row:focus-visible {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--cad-link, #005bac))
      );
      outline-offset: 3px;
    }

    :host([current]) .row {
      background:
        repeating-linear-gradient(
          -24deg,
          color-mix(
              in srgb,
              var(--cad-post-it-blue-bg, #cfe2ff) 38%,
              transparent
            )
            0 2px,
          transparent 2px 7px
        ),
        var(--cad-surface, #fff);
      border-color: var(--cad-link, #005bac);
      transform: rotate(0.08deg);
    }

    :host([disabled]) .row {
      cursor: not-allowed;
      opacity: 0.42;
    }

    .marker {
      display: inline-grid;
      place-items: center;
      width: 0.55rem;
      height: 0.55rem;
      margin-inline: 0.35rem;
      background: currentColor;
      border-radius: 50%;
      transform: rotate(-2deg);
    }

    :host([data-variant='numbered']) .marker {
      box-sizing: border-box;
      width: 2.15rem;
      height: 2.15rem;
      margin-inline: 0;
      background: transparent;
      border: 1.5px solid currentColor;
      border-radius: 50%;
      font-size: var(--cad-hand-md, 1.2rem);
    }

    .label {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .arrow {
      display: inline-grid;
      transform: rotate(-1deg);
    }

    .arrow svg {
      width: 1.35rem;
      height: 1.35rem;
    }

    @media (forced-colors: active) {
      .row {
        border-color: CanvasText;
      }

      :host([current]) .row {
        outline: 2px solid Highlight;
        outline-offset: -4px;
      }
    }
  `

  declare current: boolean
  declare disabled: boolean
  declare href: string
  declare index: number
  declare rel: string
  declare target: string
  declare value: string
  declare variant: CadListVariant

  constructor() {
    super()
    this.current = false
    this.disabled = false
    this.href = ''
    this.index = 1
    this.rel = ''
    this.target = ''
    this.value = ''
    this.variant = 'bullet'
  }

  protected override updated(): void {
    this.dataset.variant = this.variant
  }

  override render() {
    const content = html`
      <span aria-hidden="true" class="marker" part="marker">
        ${this.variant === 'numbered' ? this.value || this.index : nothing}
      </span>
      <span class="label" part="label"><slot></slot></span>
      <span aria-hidden="true" class="arrow" part="arrow">
        ${renderSystemIcon('arrow-right')}
      </span>
    `

    return html`
      <div class="item" part="item" role="listitem">
        ${
          this.href && !this.disabled
            ? html`<a
                aria-current=${this.current ? 'page' : nothing}
                class="row"
                href=${this.href}
                part="row"
                rel=${this.rel || nothing}
                target=${this.target || nothing}
                >${content}</a
              >`
            : html`<span
                aria-current=${this.current ? 'page' : nothing}
                aria-disabled=${this.disabled ? 'true' : nothing}
                class="row"
                part="row"
                >${content}</span
              >`
        }
      </div>
    `
  }
}

/**
 * A hand-drawn bullet or numbered list for navigable collections.
 *
 * @slot - Direct `cad-list-item` children.
 * @csspart list - Accessible list container.
 */
export class CadList extends LitElement {
  static override properties = {
    label: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
    }

    .list {
      display: grid;
      gap: 0.65rem;
    }
  `

  declare label: string
  declare variant: CadListVariant

  constructor() {
    super()
    this.label = 'List'
    this.variant = 'bullet'
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('variant')) this.syncItems()
  }

  override render() {
    return html`
      <div aria-label=${this.label} class="list" part="list" role="list">
        <slot @slotchange=${this.syncItems}></slot>
      </div>
    `
  }

  private syncItems = (): void => {
    const items = Array.from(
      this.querySelectorAll<CadListItem>(':scope > cad-list-item'),
    )
    items.forEach((item, index) => {
      item.index = index + 1
      item.variant = this.variant
    })
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-list-item')) {
    customElements.define('cad-list-item', CadListItem)
  }
  if (!customElements.get('cad-list')) {
    customElements.define('cad-list', CadList)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-list': CadList
    'cad-list-item': CadListItem
  }
}
