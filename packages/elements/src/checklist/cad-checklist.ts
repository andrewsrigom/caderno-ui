import { css, html, LitElement, type PropertyValues } from 'lit'

import { renderSystemIcon } from '../internal/system-icon.js'

export type CadChecklistItemKind = 'check' | 'cross'
export type CadChecklistTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadChecklistVariant = 'do' | 'dont' | 'mixed'

/**
 * One composable row inside `cad-checklist`.
 *
 * @slot - Item content.
 * @csspart item - Accessible list item.
 * @csspart mark - Intrinsic check or cross mark.
 */
export class CadChecklistItem extends LitElement {
  static override properties = {
    kind: { reflect: true, type: String },
    resolvedKind: { attribute: false, state: true },
  }

  static override styles = css`
    :host {
      display: block;
    }

    .item {
      display: grid;
      grid-template-columns: 1.65rem minmax(0, 1fr);
      gap: 0.75rem;
      align-items: start;
      color: var(--cad-ink, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      line-height: 1.4;
    }

    .mark {
      display: inline-grid;
      place-items: center;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--_check-accent, currentColor);
      border: 1.5px solid color-mix(in srgb, currentColor 82%, transparent);
      transform: rotate(-2deg);
    }

    .mark svg {
      width: 1rem;
      height: 1rem;
    }

    :host([kind='cross']) .item,
    :host([data-resolved-kind='cross']) .item {
      color: var(--cad-ink, currentColor);
    }

    :host([kind='cross']) .mark,
    :host([data-resolved-kind='cross']) .mark {
      transform: rotate(2deg);
    }
  `

  declare kind: CadChecklistItemKind | ''
  declare resolvedKind: CadChecklistItemKind

  constructor() {
    super()
    this.kind = ''
    this.resolvedKind = 'check'
  }

  override updated(): void {
    this.dataset.resolvedKind = this.resolvedKind
  }

  override render() {
    const kind = this.kind || this.resolvedKind
    return html`
      <div class="item" part="item" role="listitem">
        <span aria-hidden="true" class="mark" part="mark">
          ${renderSystemIcon(kind === 'cross' ? 'close' : 'check')}
        </span>
        <span><slot></slot></span>
      </div>
    `
  }
}

/**
 * A semantic checklist or do/don't list composed from checklist items.
 *
 * @slot - Direct `cad-checklist-item` children.
 * @slot title - Optional visible title. Falls back to `title`.
 * @csspart base - Checklist surface.
 * @csspart list - Accessible list container.
 * @csspart title - Checklist title.
 */
export class CadChecklist extends LitElement {
  static override properties = {
    title: { type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_check-accent: var(--cad-link, #005bac);
      --_check-bg: var(--cad-post-it-blue-bg, #cfe2ff);
      display: block;
      color: var(--cad-ink, #162033);
    }

    :host([tone='blue']) {
      --_check-accent: var(--cad-post-it-blue-ink, #20375d);
      --_check-bg: var(--cad-post-it-blue-bg, #cfe2ff);
    }

    :host([tone='coral']) {
      --_check-accent: var(--cad-post-it-coral-ink, #633b32);
      --_check-bg: var(--cad-post-it-coral-bg, #ffd8ce);
    }

    :host([tone='lemon']) {
      --_check-accent: var(--cad-post-it-lemon-ink, #51491f);
      --_check-bg: var(--cad-post-it-lemon-bg, #fff1ac);
    }

    :host([tone='pink']) {
      --_check-accent: var(--cad-post-it-pink-ink, #52233a);
      --_check-bg: var(--cad-post-it-pink-bg, #ffb7d5);
    }

    :host([tone='violet']) {
      --_check-accent: var(--cad-sticker-violet-ink, #30205e);
      --_check-bg: var(--cad-sticker-violet-bg, #bba0ff);
    }

    .base {
      position: relative;
      display: grid;
      gap: 1rem;
      padding: 1.15rem 1.25rem 1.25rem;
      background: color-mix(
        in srgb,
        var(--_check-bg) 8%,
        var(--cad-surface, #fff)
      );
      border: var(--cad-frame-border, 1.5px dashed var(--cad-border-ink));
      border-radius: 0;
    }

    .title {
      position: relative;
      width: fit-content;
      color: var(--_check-accent);
      font-family: var(--cad-type-title-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-title-size, var(--cad-hand-md, 1.25rem));
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: var(--cad-type-title-line-height, 1.15);
    }

    .title::after {
      position: absolute;
      right: 8%;
      bottom: -0.22rem;
      left: 0;
      height: 2px;
      background: color-mix(in srgb, var(--_check-accent) 72%, transparent);
      content: '';
      transform: rotate(-1deg);
    }

    .title[hidden] {
      display: none;
    }

    .list {
      display: grid;
      gap: 0.75rem;
    }

    @media (forced-colors: active) {
      .base {
        border-color: CanvasText;
      }
    }
  `

  declare title: string
  declare tone: CadChecklistTone
  declare variant: CadChecklistVariant

  constructor() {
    super()
    this.title = ''
    this.tone = 'blue'
    this.variant = 'mixed'
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('variant')) this.syncItems()
  }

  override render() {
    const hasTitle = this.title || this.querySelector('[slot="title"]')
    return html`
      <section class="base" part="base">
        <div class="title" ?hidden=${!hasTitle} part="title">
          <slot name="title">${this.title}</slot>
        </div>
        <div class="list" part="list" role="list">
          <slot @slotchange=${this.syncItems}></slot>
        </div>
      </section>
    `
  }

  private syncItems = (): void => {
    const fallback = this.variant === 'dont' ? 'cross' : 'check'
    for (const item of this.querySelectorAll<CadChecklistItem>(
      ':scope > cad-checklist-item',
    )) {
      item.resolvedKind = item.kind || fallback
    }
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-checklist-item')) {
    customElements.define('cad-checklist-item', CadChecklistItem)
  }
  if (!customElements.get('cad-checklist')) {
    customElements.define('cad-checklist', CadChecklist)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-checklist': CadChecklist
    'cad-checklist-item': CadChecklistItem
  }
}
