import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

import { renderSystemIcon } from '../internal/system-icon.js'

export type CadListVariant = 'bullet' | 'numbered'

/**
 * A content item inside `cad-list`. Compose links or buttons in the default
 * slot. The optional href is a convenience for a single native link.
 *
 * @slot - Item content, including consumer-owned links or buttons.
 * @slot action - One native link or button owning the entire interactive row.
 * @csspart arrow - Decorative trailing arrow on interactive rows.
 * @csspart item - Accessible list item.
 * @csspart label - Visible item label.
 * @csspart marker - Bullet or number marker.
 * @csspart row - Native link or static row.
 */
export class CadListItem extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    compact: { attribute: false, state: true },
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
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
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

    .row.compact {
      min-height: 0;
      padding: 0;
      background: transparent;
      border: 0;
      transform: none;
    }

    ::slotted(a:not([slot='action'])) {
      color: var(--cad-link, #005bac);
      text-decoration: underline;
      text-decoration-color: var(--cad-link-mark, #ef4d4f);
      text-decoration-thickness: 2px;
      text-underline-offset: 0.2em;
      cursor: pointer;
    }

    ::slotted(a:not([slot='action']):hover) {
      text-decoration-thickness: 3px;
    }

    a.row {
      cursor: pointer;
    }

    a.row:hover,
    .row.has-action:hover {
      background: color-mix(
        in srgb,
        var(--cad-post-it-blue-bg, #cfe2ff) 24%,
        var(--cad-surface, #fff)
      );
    }

    a.row:focus-visible,
    ::slotted(a:focus-visible),
    ::slotted(button[slot='action']:focus-visible) {
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

    :host([current]) .row.compact {
      background: transparent;
      font-weight: 700;
      transform: none;
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
      user-select: none;
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

    .row.interactive {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    .row.has-action {
      grid-template-columns: minmax(0, 1fr);
      min-height: 0;
      padding: 0;
    }

    .row.has-action .marker {
      position: absolute;
      inset-inline-start: 1rem;
      top: 50%;
      z-index: 1;
      pointer-events: none;
      transform: translateY(-50%) rotate(-2deg);
    }

    .row.has-action.compact .marker {
      inset-inline-start: 0;
    }

    .arrow {
      display: inline-grid;
      pointer-events: none;
      transform: rotate(-1deg);
    }

    .arrow svg {
      width: 1.35rem;
      height: 1.35rem;
    }

    .row.has-action .arrow {
      position: absolute;
      inset-inline-end: 1rem;
      top: 50%;
      transform: translateY(-50%) rotate(-1deg);
    }

    ::slotted([slot='action']) {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
      min-height: calc(3.25rem - 2 * var(--cad-border-width, 1.5px));
      padding: 0.7rem 3.35rem 0.7rem 3.25rem;
      color: inherit;
      background: transparent;
      border: 0;
      border-radius: 0;
      font: inherit;
      text-align: start;
      text-decoration: none;
      cursor: pointer;
    }

    :host([data-variant='numbered']) ::slotted([slot='action']) {
      min-height: calc(2.15rem + 1.4rem);
      padding-inline-start: 4.15rem;
    }

    .compact ::slotted([slot='action']) {
      min-height: 1.25em;
      padding-block: 0;
      padding-inline-start: 2.25rem;
    }

    :host([data-variant='numbered']) .compact ::slotted([slot='action']) {
      min-height: 2.15rem;
      padding-inline-start: 3.15rem;
    }

    :host(:has(> [slot='action']:disabled)) .row {
      opacity: 0.42;
    }

    ::slotted([slot='action']:disabled) {
      cursor: not-allowed;
    }

    @media (forced-colors: active) {
      .row {
        border-color: CanvasText;
      }

      a.row,
      ::slotted(a) {
        color: LinkText;
      }

      :host([current]) .row {
        outline: 2px solid Highlight;
        outline-offset: -4px;
      }
    }
  `

  declare compact: boolean
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
    this.compact = false
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
    const hasAction = Boolean(this.querySelector(':scope > [slot="action"]'))
    const linked = Boolean(this.href && !this.disabled && !hasAction)
    const interactive = hasAction || Boolean(this.href)
    const rowClass = `row${this.compact ? ' compact' : ''}${interactive ? ' interactive' : ''}${hasAction ? ' has-action' : ''}`
    const content = html`
      <span aria-hidden="true" class="marker" part="marker">
        ${this.variant === 'numbered' ? this.value || this.index : nothing}
      </span>
      <span class="label" part="label">
        <slot name="action" @slotchange=${this.onActionSlotChange}
          ><slot></slot
        ></slot>
      </span>
      ${interactive ? html`<span aria-hidden="true" class="arrow" part="arrow">${renderSystemIcon('arrow-right')}</span>` : nothing}
    `

    return html`
      <div class="item" part="item" role="listitem">
        ${
          linked
            ? html`<a
                aria-current=${this.current ? 'page' : nothing}
                class=${rowClass}
                href=${this.href}
                part="row"
                rel=${this.rel || nothing}
                target=${this.target || nothing}
                >${content}</a
              >`
            : html`<span
                aria-current=${this.current ? 'page' : nothing}
                aria-disabled=${this.disabled ? 'true' : nothing}
                class=${rowClass}
                part="row"
                >${content}</span
              >`
        }
      </div>
    `
  }

  private onActionSlotChange = (): void => {
    this.requestUpdate()
  }
}

/**
 * A handwritten list with individual frames and blue markers. The optional
 * compact option removes frames and padding, preserving markers and readable gaps. A link
 * or button in the action slot owns navigation and interaction.
 *
 * @slot - Direct `cad-list-item` children.
 * @csspart list - Accessible list container.
 */
export class CadList extends LitElement {
  static override properties = {
    compact: { reflect: true, type: Boolean },
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

    :host([compact]:not([variant='numbered'])) .list {
      gap: 0;
    }
  `

  declare compact: boolean
  declare label: string
  declare variant: CadListVariant

  constructor() {
    super()
    this.compact = false
    this.label = 'List'
    this.variant = 'bullet'
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('variant') || changed.has('compact')) this.syncItems()
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
      item.compact = this.compact
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
