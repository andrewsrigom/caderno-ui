import { css, html, LitElement } from 'lit'

export type CadBadgeTone = 'blue' | 'coral' | 'lemon' | 'mint' | 'neutral'
export type CadBadgeVariant = 'outline' | 'solid'

/**
 * A compact notebook label for statuses, categories, and metadata.
 *
 * @slot - Badge label.
 * @slot start - Optional leading visual.
 * @csspart base - Badge container.
 * @csspart label - Badge text.
 * @csspart start - Leading composition slot.
 * @cssprop --cad-badge-bg - Per-instance badge color.
 * @cssprop --cad-badge-ink - Per-instance foreground color.
 */
export class CadBadge extends LitElement {
  static override properties = {
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_badge-bg: var(--cad-badge-bg, var(--cad-surface-raised, #f7f0dc));
      --_badge-ink: var(--cad-badge-ink, var(--cad-ink, #25202a));
      display: inline-flex;
      max-width: 100%;
      vertical-align: middle;
    }

    :host([tone='blue']) {
      --_badge-bg: var(--cad-badge-bg, var(--cad-post-it-blue-bg, #cfe2ff));
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-blue-ink, #20375d));
    }

    :host([tone='coral']) {
      --_badge-bg: var(--cad-badge-bg, var(--cad-post-it-coral-bg, #ffd8ce));
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-coral-ink, #633b32));
    }

    :host([tone='lemon']) {
      --_badge-bg: var(--cad-badge-bg, var(--cad-post-it-lemon-bg, #fff1ac));
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-lemon-ink, #51491f));
    }

    :host([tone='mint']) {
      --_badge-bg: var(--cad-badge-bg, var(--cad-post-it-mint-bg, #d8ffec));
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-mint-ink, #274f41));
    }

    .base {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
      min-height: 1.75rem;
      max-width: 100%;
      padding: 0.16rem 0.62rem 0.22rem;
      color: var(--_badge-ink);
      background: var(--_badge-bg);
      border: 1.5px solid color-mix(in srgb, var(--_badge-ink) 54%, transparent);
      border-radius: 999px 940px 990px 920px;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
      transform: rotate(-0.25deg);
    }

    :host([variant='outline']) .base {
      background: color-mix(in srgb, var(--_badge-bg) 18%, transparent);
      border-style: dashed;
    }

    .label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (forced-colors: active) {
      .base {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }
    }
  `

  declare tone: CadBadgeTone
  declare variant: CadBadgeVariant

  constructor() {
    super()
    this.tone = 'neutral'
    this.variant = 'solid'
  }

  override render() {
    return html`
      <span class="base" part="base">
        <slot name="start" part="start"></slot>
        <span class="label" part="label"><slot></slot></span>
      </span>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-badge')) {
  customElements.define('cad-badge', CadBadge)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-badge': CadBadge
  }
}
