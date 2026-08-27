import { css, html, LitElement } from 'lit'

export type CadSkeletonAnimation = 'none' | 'pulse' | 'wave'
export type CadSkeletonShape = 'circle' | 'rectangle' | 'text'

const MAX_LINES = 20

/**
 * A decorative layout placeholder for content that is still loading.
 *
 * @csspart base - Placeholder group.
 * @csspart item - Each rendered placeholder shape or text line.
 * @cssprop --cad-skeleton-bg - Placeholder base color.
 * @cssprop --cad-skeleton-highlight - Traveling highlight color for `wave`.
 * @cssprop --cad-skeleton-width - Item width. A circle also uses it as its default height.
 * @cssprop --cad-skeleton-height - Item height.
 * @cssprop --cad-skeleton-radius - Item corner radius.
 * @cssprop --cad-skeleton-gap - Gap between repeated text lines.
 * @cssprop --cad-skeleton-last-line-width - Final line width when `lines` is greater than one.
 */
export class CadSkeleton extends LitElement {
  static override properties = {
    animation: { reflect: true, type: String },
    lines: { reflect: true, type: Number },
    shape: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_skeleton-ink: var(--cad-skeleton-bg, var(--cad-link, #005bac));
      --_skeleton-wash: color-mix(
        in srgb,
        var(--_skeleton-ink) 8%,
        transparent
      );
      display: block;
      min-width: 0;
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      display: grid;
      width: var(--cad-skeleton-width, 100%);
      gap: var(--cad-skeleton-gap, 0.6rem);
      min-width: 0;
    }

    .item {
      position: relative;
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: var(--cad-skeleton-height, 6rem);
      overflow: hidden;
      background:
        repeating-linear-gradient(
          -12deg,
          transparent 0 0.28rem,
          color-mix(in srgb, var(--_skeleton-ink) 11%, transparent) 0.3rem
            0.36rem
        ),
        var(--_skeleton-wash);
      border: 1px dashed
        color-mix(in srgb, var(--_skeleton-ink) 44%, transparent);
      border-radius: var(--cad-skeleton-radius, 0);
      transform: rotate(-0.12deg);
    }

    :host([shape='text']) .item {
      height: var(--cad-skeleton-height, 0.72em);
      background: linear-gradient(
        178deg,
        transparent 0 54%,
        color-mix(in srgb, var(--_skeleton-ink) 24%, transparent) 56% 78%,
        transparent 80%
      );
      border: 0;
      border-radius: var(--cad-skeleton-radius, 0);
    }

    :host([shape='text']) .item:nth-child(even) {
      transform: rotate(0.18deg);
    }

    :host([shape='text']) .item.last {
      width: var(--cad-skeleton-last-line-width, 72%);
    }

    :host([shape='circle']) .base {
      width: var(--cad-skeleton-width, 3rem);
    }

    :host([shape='circle']) .item {
      height: var(--cad-skeleton-height, var(--cad-skeleton-width, 3rem));
      border-radius: var(--cad-skeleton-radius, 50%);
    }

    :host([animation='pulse']) .item {
      animation: pulse 1.8s ease-in-out infinite;
    }

    :host([animation='wave']) .item::after {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        100deg,
        transparent 20%,
        var(
            --cad-skeleton-highlight,
            color-mix(in srgb, var(--_skeleton-ink) 18%, transparent)
          )
          50%,
        transparent 80%
      );
      content: '';
      transform: translateX(-100%);
      animation: wave 1.8s ease-in-out infinite;
    }

    @keyframes pulse {
      50% {
        opacity: 0.52;
      }
    }

    @keyframes wave {
      to {
        transform: translateX(100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .item,
      .item::after {
        animation: none !important;
      }
    }

    @media (forced-colors: active) {
      .item {
        background: Canvas;
        border: 1px dashed GrayText;
      }

      :host([shape='text']) .item {
        border-block-end: 2px solid GrayText;
      }

      .item::after {
        display: none;
      }
    }
  `

  declare animation: CadSkeletonAnimation
  declare lines: number
  declare shape: CadSkeletonShape

  constructor() {
    super()
    this.animation = 'pulse'
    this.lines = 1
    this.shape = 'text'
  }

  private get renderedLineCount() {
    if (this.shape !== 'text') return 1
    if (!Number.isFinite(this.lines) || this.lines < 1) return 1
    return Math.min(Math.trunc(this.lines), MAX_LINES)
  }

  override render() {
    const count = this.renderedLineCount
    return html`
      <span aria-hidden="true" class="base" part="base">
        ${Array.from({ length: count }, (_, index) => {
          const isLastTextLine =
            this.shape === 'text' && count > 1 && index === count - 1
          return html`<span
            class=${isLastTextLine ? 'item last' : 'item'}
            part="item"
          ></span>`
        })}
      </span>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-skeleton')
) {
  customElements.define('cad-skeleton', CadSkeleton)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-skeleton': CadSkeleton
  }
}
