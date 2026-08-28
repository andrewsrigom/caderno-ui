import { css, html, LitElement } from 'lit'

export type CadKanbanCardTone = 'blue' | 'coral' | 'lemon' | 'mint' | 'pink'

/**
 * A compact note composed inside a Kanban column.
 *
 * @slot - Card content.
 * @csspart card - Note surface and accessible list item.
 */
export class CadKanbanCard extends LitElement {
  static override properties = {
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_kanban-bg: var(--cad-post-it-lemon-bg, #fff1ac);
      --_kanban-ink: var(--cad-post-it-lemon-ink, #51491f);
      display: block;
    }
    :host([tone='blue']) {
      --_kanban-bg: var(--cad-post-it-blue-bg, #cfe2ff);
      --_kanban-ink: var(--cad-post-it-blue-ink, #20375d);
    }
    :host([tone='coral']) {
      --_kanban-bg: var(--cad-post-it-coral-bg, #ffd8ce);
      --_kanban-ink: var(--cad-post-it-coral-ink, #633b32);
    }
    :host([tone='mint']) {
      --_kanban-bg: var(--cad-post-it-mint-bg, #d8ffec);
      --_kanban-ink: var(--cad-post-it-mint-ink, #274f41);
    }
    :host([tone='pink']) {
      --_kanban-bg: var(--cad-post-it-pink-bg, #ffb7d5);
      --_kanban-ink: var(--cad-post-it-pink-ink, #52233a);
    }
    .card {
      position: relative;
      padding: 0.75rem 0.8rem 0.8rem;
      color: var(--_kanban-ink);
      background: color-mix(
        in srgb,
        var(--_kanban-bg) 76%,
        var(--cad-surface, #fff)
      );
      border: 1px solid color-mix(in srgb, var(--_kanban-ink) 48%, transparent);
      box-shadow: 0.2rem 0.22rem 0
        color-mix(in srgb, var(--_kanban-ink) 10%, transparent);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      line-height: 1.25;
      transform: rotate(-0.35deg);
    }

    :host(:nth-of-type(even)) .card {
      transform: rotate(0.3deg);
    }
  `

  declare tone: CadKanbanCardTone

  constructor() {
    super()
    this.tone = 'lemon'
  }

  override render() {
    return html`<div class="card" part="card" role="listitem">
      <slot></slot>
    </div>`
  }
}

/**
 * One titled column inside `cad-kanban`.
 *
 * @slot - Direct `cad-kanban-card` children.
 * @slot title - Optional native heading. Falls back to `title`.
 * @csspart column - Column surface and accessible list item.
 * @csspart header - Column header.
 * @csspart title - Title wrapper.
 * @csspart count - Derived card count.
 * @csspart cards - Accessible card list.
 */
export class CadKanbanColumn extends LitElement {
  static override properties = {
    count: { state: true, type: Number },
    title: { type: String },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 13rem;
      color: var(--cad-link, #005bac);
    }
    .column {
      box-sizing: border-box;
      position: relative;
      min-height: 100%;
      padding: 0.75rem 0.9rem 0.95rem 1rem;
      background: transparent;
      border: 0;
      border-inline-start: 1.5px solid
        color-mix(in srgb, currentColor 68%, transparent);
      border-radius: 0;
    }
    .column::before {
      position: absolute;
      inset-block: 0.2rem 0;
      inset-inline-start: 0.18rem;
      border-inline-start: 1px dashed
        color-mix(in srgb, currentColor 28%, transparent);
      content: '';
      pointer-events: none;
      transform: rotate(0.15deg);
    }
    header {
      position: relative;
      display: flex;
      gap: 0.7rem;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.2rem 0.75rem;
      margin-bottom: 0.75rem;
      border-block-end: 1px solid
        color-mix(in srgb, currentColor 42%, transparent);
      font-family: var(--cad-font-hand, cursive);
      font-weight: 700;
    }
    .title {
      font-size: var(--cad-hand-lg, 1.55rem);
      line-height: 1;
    }
    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }
    .count {
      display: inline-grid;
      place-items: center;
      min-width: 1.7rem;
      height: 1.7rem;
      color: var(--cad-link, #005bac);
      background: color-mix(
        in srgb,
        var(--cad-post-it-blue-bg, #cfe2ff) 48%,
        transparent
      );
      border: 1px solid currentColor;
      border-radius: 51% 49% 47% 53%;
      font-family: var(--cad-font-hand, cursive);
      transform: rotate(3deg);
    }
    .cards {
      display: grid;
      gap: 0.65rem;
    }
  `

  declare count: number
  declare title: string

  constructor() {
    super()
    this.count = 0
    this.title = ''
  }

  override render() {
    return html`
      <div class="column" part="column" role="listitem">
        <header part="header">
          <div class="title" part="title">
            <slot name="title"><strong>${this.title}</strong></slot>
          </div>
          <span aria-label="${this.count} cards" class="count" part="count">
            ${this.count}
          </span>
        </header>
        <div class="cards" part="cards" role="list">
          <slot @slotchange=${this.syncCount}></slot>
        </div>
      </div>
    `
  }

  private syncCount = (): void => {
    this.count = this.querySelectorAll(':scope > cad-kanban-card').length
  }
}

/**
 * A horizontally scrollable Kanban board composed from columns and cards.
 *
 * @slot - Direct `cad-kanban-column` children.
 * @csspart board - Scrollable accessible column list.
 */
export class CadKanban extends LitElement {
  static override properties = {
    label: { type: String },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      max-width: 100%;
    }
    .board {
      display: grid;
      grid-auto-columns: minmax(13rem, 1fr);
      grid-auto-flow: column;
      gap: 0.45rem;
      max-width: 100%;
      padding: 0.75rem 0 0.45rem;
      overflow-x: auto;
      background: var(--cad-surface, #fff);
      border-block: 1px solid
        color-mix(in srgb, var(--cad-link, #005bac) 34%, transparent);
    }
  `

  declare label: string

  constructor() {
    super()
    this.label = 'Kanban board'
  }

  override render() {
    return html`<div
      aria-label=${this.label}
      class="board"
      part="board"
      role="list"
    >
      <slot></slot>
    </div>`
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-kanban-card')) {
    customElements.define('cad-kanban-card', CadKanbanCard)
  }
  if (!customElements.get('cad-kanban-column')) {
    customElements.define('cad-kanban-column', CadKanbanColumn)
  }
  if (!customElements.get('cad-kanban')) {
    customElements.define('cad-kanban', CadKanban)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-kanban': CadKanban
    'cad-kanban-card': CadKanbanCard
    'cad-kanban-column': CadKanbanColumn
  }
}
