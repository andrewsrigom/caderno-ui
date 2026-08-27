import { css, html, LitElement, nothing } from 'lit'

export type CadTableDensity = 'compact' | 'regular'
export type CadTableVariant = 'grid' | 'ruled'
export type CadTableTypography = 'body' | 'hand'
export type CadTableColumnFormat = 'code' | 'text'

type TableColumn = {
  format: CadTableColumnFormat
  key: string
  label: string
}

type TableRow = {
  cells: Map<string, string>
}

/**
 * A declarative column consumed by `cad-table`. Use `format="code"` for
 * technical values, rendered as escaped text inside native code elements.
 *
 * @slot - Progressive fallback label.
 */
export class CadTableColumn extends LitElement {
  static override properties = {
    format: { reflect: true, type: String },
    key: { reflect: true, type: String },
    label: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: none;
    }
  `

  declare format: CadTableColumnFormat
  declare key: string
  declare label: string

  constructor() {
    super()
    this.format = 'text'
    this.key = ''
    this.label = ''
  }

  override render() {
    return html`<slot>${this.label}</slot>`
  }
}

/**
 * A declarative cell consumed by `cad-table-row`.
 *
 * @slot - Progressive fallback cell content.
 */
export class CadTableCell extends LitElement {
  static override properties = {
    column: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: none;
    }
  `

  declare column: string

  constructor() {
    super()
    this.column = ''
  }

  override render() {
    return html`<slot></slot>`
  }
}

/**
 * A declarative row consumed by `cad-table`.
 *
 * @slot - `cad-table-cell` values with readable fallback text.
 */
export class CadTableRow extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
  `

  override render() {
    return html`<slot></slot>`
  }
}

/**
 * A responsive native data table built from declarative column and row children.
 *
 * @slot - `cad-table-column` and `cad-table-row` data.
 * @slot caption - Visible table caption. Falls back to the `caption` attribute.
 * @csspart base - Responsive scroll container.
 * @csspart caption - Native table caption.
 * @csspart cell - Native body cell.
 * @csspart empty - Empty-state cell.
 * @csspart header - Native column header.
 * @csspart table - Native table element.
 * @cssprop --cad-table-grid - Table line color.
 * @cssprop --cad-table-ink - Table foreground color.
 * @cssprop --cad-table-paper - Table paper color.
 */
export class CadTable extends LitElement {
  static override properties = {
    caption: { type: String },
    density: { reflect: true, type: String },
    emptyText: { attribute: 'empty-text', type: String },
    minWidth: { attribute: 'min-width', type: String },
    typography: { reflect: true, type: String },
    variant: { reflect: true, type: String },
    zebra: { reflect: true, type: Boolean },
  }

  static override styles = css`
    :host {
      --_table-grid: var(
        --cad-table-grid,
        color-mix(
          in srgb,
          var(--cad-line-strong, currentColor) 72%,
          transparent
        )
      );
      --_table-ink: var(--cad-table-ink, var(--cad-link, #005bac));
      --_table-paper: var(--cad-table-paper, var(--cad-surface, #fff));
      display: block;
      min-width: 0;
      color: var(--_table-ink);
    }

    .base {
      position: relative;
      max-width: 100%;
      overflow-x: auto;
      background: var(--_table-paper);
      border-block-end: 1px solid var(--_table-grid);
      border-inline: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .base:focus-visible {
      outline: var(--cad-focus-outline, 2px dashed var(--_table-ink));
      outline-offset: -2px;
    }

    table {
      width: 100%;
      min-width: var(--_table-min-width, 32rem);
      border-collapse: collapse;
      color: inherit;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-variant-numeric: tabular-nums;
    }

    :host([typography='body']) table {
      color: var(--cad-ink, currentColor);
      font-family: var(--cad-type-body-font, var(--cad-font-book, serif));
      font-size: var(--cad-type-body-size, 1rem);
      line-height: var(--cad-type-body-line-height, 1.5);
    }

    code {
      font-family: var(--cad-type-code-font, var(--cad-font-mono, monospace));
      font-size: 0.85em;
      font-weight: normal;
      overflow-wrap: anywhere;
    }

    :host([typography='body']) th {
      font-family: var(--cad-type-body-font, serif);
      font-size: var(--cad-book-sm, 0.95rem);
      letter-spacing: normal;
    }

    :host([typography='body']) caption {
      font-family: var(--cad-type-title-font, cursive);
      font-size: var(--cad-type-title-size, 1.5rem);
      transform: none;
    }

    caption {
      padding: 1rem 1rem 0.8rem;
      color: var(--_table-ink);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      text-align: left;
      transform: rotate(-0.25deg);
    }

    th,
    td {
      padding: 0.78rem 0.9rem;
      text-align: left;
      vertical-align: top;
    }

    th {
      border: 0;
      color: var(--_table-ink);
      background: color-mix(
        in srgb,
        var(--_table-ink) 10%,
        var(--_table-paper)
      );
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      letter-spacing: 0.02em;
    }

    tbody tr + tr td {
      border-block-start: 1px solid var(--_table-grid);
    }

    :host([variant='grid']) td:not(:last-child) {
      border-inline-end: 1px solid
        color-mix(in srgb, var(--_table-ink) 58%, transparent);
    }

    :host([variant='ruled']) .base {
      border-inline: 0;
      border-radius: 0;
      box-shadow: none;
    }

    :host([zebra]) tbody tr:nth-child(even) td {
      background: color-mix(in srgb, var(--_table-ink) 3%, transparent);
    }

    tbody tr:hover td {
      background: color-mix(in srgb, var(--_table-ink) 8%, var(--_table-paper));
    }

    tbody td:first-child {
      font-weight: var(--cad-hand-weight-strong, 700);
    }

    :host([density='compact']) th,
    :host([density='compact']) td {
      padding: 0.52rem 0.7rem;
    }

    .empty {
      padding-block: 1.5rem;
      color: var(--_table-ink);
      font-family: var(--cad-font-hand, cursive);
      text-align: center;
    }

    slot:not([name]) {
      display: none;
    }

    @media (forced-colors: active) {
      .base,
      th,
      td {
        border-color: CanvasText;
      }
    }
  `

  declare caption: string
  declare density: CadTableDensity
  declare emptyText: string
  declare minWidth: string
  declare typography: CadTableTypography
  declare variant: CadTableVariant
  declare zebra: boolean

  private readonly dataObserver =
    typeof MutationObserver === 'undefined'
      ? undefined
      : new MutationObserver(() => this.requestUpdate())

  constructor() {
    super()
    this.caption = ''
    this.density = 'regular'
    this.emptyText = 'No data'
    this.minWidth = '32rem'
    this.typography = 'hand'
    this.variant = 'grid'
    this.zebra = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.dataObserver?.observe(this, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
  }

  override disconnectedCallback(): void {
    this.dataObserver?.disconnect()
    super.disconnectedCallback()
  }

  private get columns(): TableColumn[] {
    return [...this.children]
      .filter(
        (child): child is CadTableColumn => child instanceof CadTableColumn,
      )
      .map((column) => ({
        format: column.format,
        key: column.key.trim(),
        label: column.label.trim() || column.textContent?.trim() || column.key,
      }))
      .filter((column) => column.key.length > 0)
  }

  private get rows(): TableRow[] {
    return [...this.children]
      .filter((child): child is CadTableRow => child instanceof CadTableRow)
      .map((row) => ({
        cells: new Map(
          [...row.children]
            .filter(
              (child): child is CadTableCell => child instanceof CadTableCell,
            )
            .map((cell) => [
              cell.column.trim(),
              cell.textContent?.trim() ?? '',
            ]),
        ),
      }))
  }

  override render() {
    const columns = this.columns
    const rows = this.rows
    const columnCount = Math.max(1, columns.length)
    const style = `--_table-min-width: ${this.minWidth || '32rem'}`

    return html`
      <div class="base" part="base" style=${style} tabindex="0">
        <table part="table">
          ${
            this.caption || this.querySelector('[slot="caption"]')
              ? html`<caption part="caption">
                  <slot name="caption">${this.caption}</slot>
                </caption>`
              : nothing
          }
          ${
            columns.length > 0
              ? html`<thead>
                  <tr>
                    ${columns.map(
                      (column) =>
                        html`<th part="header" scope="col">
                          ${column.label}
                        </th>`,
                    )}
                  </tr>
                </thead>`
              : nothing
          }
          <tbody>
            ${
              rows.length > 0 && columns.length > 0
                ? rows.map(
                    (row) =>
                      html`<tr>
                        ${columns.map(
                          (column) =>
                            html`<td part="cell">
                              ${
                                column.format === 'code'
                                  ? html`<code
                                      >${row.cells.get(column.key) ?? ''}</code
                                    >`
                                  : (row.cells.get(column.key) ?? '')
                              }
                            </td>`,
                        )}
                      </tr>`,
                  )
                : html`<tr>
                    <td class="empty" colspan=${columnCount} part="empty">
                      ${this.emptyText}
                    </td>
                  </tr>`
            }
          </tbody>
        </table>
      </div>
      <slot></slot>
    `
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-table-column')) {
    customElements.define('cad-table-column', CadTableColumn)
  }
  if (!customElements.get('cad-table-cell')) {
    customElements.define('cad-table-cell', CadTableCell)
  }
  if (!customElements.get('cad-table-row')) {
    customElements.define('cad-table-row', CadTableRow)
  }
  if (!customElements.get('cad-table')) {
    customElements.define('cad-table', CadTable)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-table': CadTable
    'cad-table-cell': CadTableCell
    'cad-table-column': CadTableColumn
    'cad-table-row': CadTableRow
  }
}
