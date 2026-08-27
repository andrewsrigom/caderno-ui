import { css, html, LitElement } from 'lit'

export type CadBadgeTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'neutral' | 'violet'
export type CadBadgeVariant = 'outline' | 'solid'

/**
 * A compact, non-interactive status annotation with an ink marker.
 *
 * @slot - Badge label.
 * @slot start - Optional leading visual, replacing the decorative status marker.
 * @csspart base - Badge container.
 * @csspart label - Badge text.
 * @csspart start - Leading composition slot.
 * @csspart marker - Decorative status marker, used when the start slot is empty.
 * @cssprop --cad-badge-bg - Marker-wash color.
 * @cssprop --cad-badge-ink - Per-instance foreground color.
 */
export class CadBadge extends LitElement {
  static override properties = {
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_badge-bg: var(
        --cad-badge-bg,
        color-mix(in srgb, var(--_badge-mark) 16%, transparent)
      );
      --_badge-ink: var(--cad-badge-ink, var(--cad-ink-soft, #6b7280));
      --_badge-mark: var(--cad-badge-ink, var(--cad-ink-muted, #6b7280));
      display: inline-flex;
      max-width: 100%;
      vertical-align: middle;
    }

    :host([tone='blue']) {
      --_badge-ink: var(--cad-badge-ink, var(--cad-link, #005bac));
      --_badge-mark: var(--cad-badge-ink, var(--cad-link, #005bac));
    }

    :host([tone='coral']) {
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-coral-ink, #a32935));
      --_badge-mark: var(--cad-badge-ink, var(--cad-danger-ink, #d52f3f));
    }

    :host([tone='lemon']) {
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-lemon-ink, #8b5b12));
      --_badge-mark: var(--cad-badge-ink, var(--cad-warning-ink, #b45f00));
    }

    :host([tone='mint']) {
      --_badge-ink: var(--cad-badge-ink, var(--cad-post-it-mint-ink, #087a4f));
      --_badge-mark: var(--cad-badge-ink, var(--cad-success-ink, #07875f));
    }

    :host([tone='violet']) {
      --_badge-ink: var(
        --cad-badge-ink,
        var(--cad-sticker-violet-ink, #6f2dbd)
      );
      --_badge-mark: var(--cad-badge-ink, var(--cad-violet-ink, #8b45d4));
    }

    .base {
      position: relative;
      isolation: isolate;
      display: inline-flex;
      gap: 0.4rem;
      align-items: center;
      max-width: 100%;
      min-width: 0;
      padding: 0.1rem 0.2rem;
      color: var(--_badge-ink);
      background: transparent;
      border: 0;
      border-radius: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1.35;
      cursor: inherit;
    }

    .base::after {
      position: absolute;
      z-index: -1;
      inset: 52% 0 0.14rem;
      content: '';
      background: var(--_badge-bg);
      clip-path: polygon(
        1% 12%,
        96% 0,
        100% 14%,
        98% 88%,
        4% 100%,
        0 82%,
        2% 48%,
        0 28%
      );
      pointer-events: none;
    }

    .start {
      display: inline-flex;
      flex: none;
      align-items: center;
      color: var(--_badge-mark);
    }

    .marker {
      box-sizing: border-box;
      width: 0.42rem;
      height: 0.42rem;
      border: 1.25px solid currentColor;
      border-radius: 50%;
      background: currentColor;
    }

    :host([variant='outline']) .base::after {
      display: none;
    }

    :host([variant='outline']) .marker {
      background: transparent;
    }

    ::slotted([slot='start']) {
      flex: none;
    }

    .label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (forced-colors: active) {
      .base {
        color: CanvasText;
      }

      .base::after {
        display: none;
      }

      .start {
        color: CanvasText;
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
        <slot name="start" class="start" part="start">
          <span aria-hidden="true" class="marker" part="marker"></span>
        </slot>
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
