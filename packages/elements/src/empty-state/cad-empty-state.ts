import { css, html, LitElement } from 'lit'

export type CadEmptyStateVariant = 'no-access' | 'no-data' | 'no-results'

/**
 * A static empty collection or permission state with composable content.
 *
 * @slot actions - Recovery actions.
 * @slot description - Supporting copy. Falls back to `description`.
 * @slot icon - Optional product-facing illustration.
 * @slot title - Visible title. Falls back to `title`.
 * @csspart actions - Action area.
 * @csspart base - Empty state surface.
 * @csspart description - Supporting copy.
 * @csspart icon - Illustration area.
 * @csspart title - Title area.
 */
export class CadEmptyState extends LitElement {
  static override properties = {
    description: { type: String },
    title: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_empty-accent: var(--cad-link, var(--cad-post-it-blue-ink, #20375d));
      display: block;
    }

    :host([variant='no-access']) {
      --_empty-accent: var(--cad-post-it-coral-ink, #633b32);
    }

    :host([variant='no-results']) {
      --_empty-accent: var(--cad-post-it-lemon-ink, #51491f);
    }

    .base {
      display: grid;
      justify-items: center;
      gap: 0.9rem;
      box-sizing: border-box;
      width: min(100%, 34rem);
      padding: 2.4rem 1.5rem 2.2rem;
      color: var(--cad-ink, currentColor);
      text-align: center;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent 1.75rem,
        color-mix(
            in srgb,
            var(--cad-line-strong, currentColor) 25%,
            transparent
          )
          1.75rem,
        color-mix(
            in srgb,
            var(--cad-line-strong, currentColor) 25%,
            transparent
          )
          calc(1.75rem + 1px)
      );
      border: 1.5px dashed var(--cad-line-strong, currentColor);
      border-radius: 0.9rem 1.1rem 0.85rem 1rem;
    }

    .icon {
      display: inline-grid;
      place-items: center;
      color: var(--_empty-accent);
      transform: rotate(-2deg);
    }

    .icon[hidden],
    .actions[hidden] {
      display: none;
    }

    .copy {
      display: grid;
      gap: 0.35rem;
      max-width: 28rem;
      padding-inline: 0.6rem;
      background: color-mix(
        in srgb,
        var(--cad-surface, white) 92%,
        transparent
      );
    }

    .title {
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-xl, 2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .description {
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-book, serif);
      line-height: 1.55;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      justify-content: center;
    }

    @media (forced-colors: active) {
      .base {
        border-color: CanvasText;
      }
    }
  `

  declare description: string
  declare title: string
  declare variant: CadEmptyStateVariant

  constructor() {
    super()
    this.description = ''
    this.title = ''
    this.variant = 'no-data'
  }

  override render() {
    const hasIcon = this.querySelector('[slot="icon"]')
    const hasActions = this.querySelector('[slot="actions"]')
    return html`
      <section class="base" part="base">
        <div class="icon" ?hidden=${!hasIcon} part="icon">
          <slot name="icon" @slotchange=${() => this.requestUpdate()}></slot>
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
          <slot name="actions" @slotchange=${() => this.requestUpdate()}></slot>
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
