import { css, html, LitElement } from 'lit'

export type CadEmptyStateSize = 'comfortable' | 'compact' | 'minimal'
export type CadEmptyStateTone = 'amber' | 'blue' | 'mint' | 'neutral' | 'red'
export type CadEmptyStateVariant = 'no-access' | 'no-data' | 'no-results'

/**
 * A static empty collection or permission state with composable content.
 *
 * @slot actions - Legacy action group.
 * @slot description - Supporting copy. Falls back to `description`.
 * @slot eyebrow - Optional context label. Falls back to `eyebrow`.
 * @slot icon - Optional product-facing illustration.
 * @slot primary - Primary recovery action.
 * @slot secondary - Optional alternative action.
 * @slot title - Visible title. Falls back to `title`.
 * @csspart actions - Action area.
 * @csspart base - Empty state surface.
 * @csspart description - Supporting copy.
 * @csspart eyebrow - Context label.
 * @csspart icon - Illustration area.
 * @csspart title - Title area.
 * @cssprop --cad-empty-state-accent - Per-instance accent color.
 * @cssprop --cad-empty-state-bg - Per-instance surface color.
 */
export class CadEmptyState extends LitElement {
  static override properties = {
    description: { type: String },
    eyebrow: { type: String },
    size: { reflect: true, type: String },
    title: { type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_empty-accent: var(--cad-empty-state-accent, var(--cad-link, #005bac));
      --_empty-bg: var(--cad-empty-state-bg, var(--cad-surface-raised, #fff));
      --_empty-tint: color-mix(
        in srgb,
        var(--_empty-accent) 7%,
        var(--_empty-bg)
      );
      display: block;
    }

    :host([tone='blue']) {
      --_empty-accent: var(--cad-empty-state-accent, var(--cad-link, #005bac));
      --_empty-tint: color-mix(
        in srgb,
        var(--_empty-accent) 10%,
        var(--_empty-bg)
      );
    }

    :host([tone='mint']) {
      --_empty-accent: var(--cad-empty-state-accent, #07875f);
    }

    :host([tone='amber']) {
      --_empty-accent: var(--cad-empty-state-accent, #df7b00);
    }

    :host([tone='red']) {
      --_empty-accent: var(--cad-empty-state-accent, #e23847);
    }

    .base {
      display: grid;
      justify-items: center;
      gap: 1rem;
      box-sizing: border-box;
      width: min(100%, 42rem);
      padding: 2.8rem 2rem 2.5rem;
      color: var(--_empty-accent);
      text-align: center;
      background:
        repeating-linear-gradient(
          -18deg,
          transparent 0 0.6rem,
          color-mix(in srgb, var(--_empty-accent) 3.5%, transparent) 0.6rem
            0.67rem
        ),
        var(--_empty-bg);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_empty-accent);
      border-radius: 0;
      box-shadow: 1.5px 2px 0
        color-mix(in srgb, var(--_empty-accent) 12%, transparent);
      font-family: var(--cad-font-hand, cursive);
    }

    .icon {
      position: relative;
      display: inline-grid;
      place-items: center;
      width: 7.25rem;
      height: 7.25rem;
      color: var(--_empty-accent);
      background: color-mix(in srgb, var(--_empty-tint) 48%, transparent);
      border: 1.5px dashed
        color-mix(in srgb, var(--_empty-accent) 68%, transparent);
      border-radius: 50%;
    }

    .icon::after {
      position: absolute;
      top: 0.85rem;
      right: -1.55rem;
      width: 1.25rem;
      height: 1.7rem;
      background:
        linear-gradient(var(--_empty-accent), var(--_empty-accent)) 0 0 / 1.1rem
          1.5px no-repeat,
        linear-gradient(var(--_empty-accent), var(--_empty-accent)) 0.2rem
          0.75rem / 1.05rem 1.5px no-repeat,
        linear-gradient(var(--_empty-accent), var(--_empty-accent)) 0 1.5rem /
          0.75rem 1.5px no-repeat;
      content: '';
      transform: rotate(-12deg);
    }

    .icon[hidden],
    .eyebrow[hidden],
    .actions[hidden] {
      display: none;
    }

    .icon ::slotted(*) {
      --cad-icon-size: 4.2rem;
      color: inherit;
    }

    .eyebrow {
      padding: 0.15rem 0.75rem 0.22rem;
      color: var(--_empty-accent);
      background: var(--_empty-tint);
      border: 1px solid
        color-mix(in srgb, var(--_empty-accent) 46%, transparent);
      border-radius: 999px;
      font-size: var(--cad-hand-sm, 1rem);
      line-height: 1;
      transform: rotate(-0.7deg);
    }

    .copy {
      display: grid;
      gap: 0.55rem;
      max-width: 34rem;
    }

    .title {
      color: var(--_empty-accent);
      font-size: var(--cad-hand-lg, 1.6rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.08;
    }

    .title ::slotted(*) {
      margin: 0;
      color: inherit;
      font: inherit !important;
    }

    .description {
      color: var(--cad-ink, #162033);
      font-size: var(--cad-hand-md, 1.12rem);
      line-height: 1.45;
    }

    .description ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .actions {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 0.65rem;
      align-items: center;
      justify-content: center;
    }

    ::slotted([slot='primary']) {
      --cad-button-bg: var(--_empty-accent);
      --cad-button-ink: var(--cad-surface-raised, #fff);
    }

    ::slotted([slot='secondary']) {
      --cad-button-bg: color-mix(
        in srgb,
        var(--_empty-accent) 28%,
        var(--cad-post-it-coral-bg, #ffb19f)
      );
    }

    :host([size='compact']) .base {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.6rem 1.1rem;
      justify-items: start;
      width: min(100%, 31rem);
      padding: 1.35rem 1.5rem;
      text-align: left;
    }

    :host([size='compact']) .icon {
      grid-row: 1 / span 3;
      width: 4.4rem;
      height: 4.4rem;
    }

    :host([size='compact']) .icon::after {
      display: none;
    }

    :host([size='compact']) .icon ::slotted(*) {
      --cad-icon-size: 2.35rem;
    }

    :host([size='compact']) .eyebrow,
    :host([size='compact']) .copy,
    :host([size='compact']) .actions {
      grid-column: 2;
    }

    :host([size='compact']) .copy {
      gap: 0.25rem;
    }

    :host([size='compact']) .title {
      font-size: var(--cad-hand-lg, 1.35rem);
    }

    :host([size='compact']) .description {
      font-size: var(--cad-hand-sm, 1rem);
    }

    :host([size='compact']) .actions {
      flex-direction: row;
      justify-content: flex-start;
    }

    :host([size='minimal']) .base {
      width: min(100%, 20rem);
      padding: 1rem;
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }

    :host([size='minimal']) .icon {
      width: 4.25rem;
      height: 4.25rem;
    }

    :host([size='minimal']) .icon::after,
    :host([size='minimal']) .eyebrow {
      display: none;
    }

    :host([size='minimal']) .icon ::slotted(*) {
      --cad-icon-size: 2.3rem;
    }

    :host([size='minimal']) .title {
      font-size: var(--cad-hand-lg, 1.35rem);
    }

    @media (max-width: 34rem) {
      :host([size='comfortable']) .base,
      :host(:not([size])) .base {
        padding: 2.2rem 1.25rem 2rem;
      }

      .icon {
        width: 6rem;
        height: 6rem;
      }

      .icon ::slotted(*) {
        --cad-icon-size: 3.35rem;
      }
    }

    @media (forced-colors: active) {
      .base,
      .icon,
      .eyebrow {
        border-color: CanvasText;
      }
    }
  `

  declare description: string
  declare eyebrow: string
  declare size: CadEmptyStateSize
  declare title: string
  declare tone: CadEmptyStateTone
  declare variant: CadEmptyStateVariant

  constructor() {
    super()
    this.description = ''
    this.eyebrow = ''
    this.size = 'comfortable'
    this.title = ''
    this.tone = 'neutral'
    this.variant = 'no-data'
  }

  override render() {
    const hasIcon = this.querySelector('[slot="icon"]') !== null
    const hasEyebrow =
      Boolean(this.eyebrow) || this.querySelector('[slot="eyebrow"]') !== null
    const hasActions =
      this.querySelector(
        '[slot="actions"], [slot="primary"], [slot="secondary"]',
      ) !== null

    const updateSlots = () => this.requestUpdate()

    return html`
      <section class="base" part="base">
        <div class="icon" ?hidden=${!hasIcon} part="icon">
          <slot name="icon" @slotchange=${updateSlots}></slot>
        </div>
        <div class="eyebrow" ?hidden=${!hasEyebrow} part="eyebrow">
          <slot name="eyebrow">${this.eyebrow}</slot>
        </div>
        <div class="copy">
          <div class="title" part="title">
            <slot name="title"><strong>${this.title}</strong></slot>
          </div>
          <div class="description" part="description">
            <slot name="description">${this.description}</slot>
          </div>
        </div>
        <div class="actions" ?hidden=${!hasActions} part="actions">
          <slot name="primary" @slotchange=${updateSlots}></slot>
          <slot name="actions" @slotchange=${updateSlots}></slot>
          <slot name="secondary" @slotchange=${updateSlots}></slot>
        </div>
      </section>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-empty-state')
) {
  customElements.define('cad-empty-state', CadEmptyState)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-empty-state': CadEmptyState
  }
}
