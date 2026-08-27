import { css, html, LitElement } from 'lit'

export type CadStickerShape = 'banner' | 'bubble' | 'burst' | 'label' | 'round'
export type CadStickerSize = 'md' | 'sm'
export type CadStickerTone = 'blue' | 'coral' | 'lemon' | 'mint' | 'violet'

/**
 * A compact decorative label for categories, milestones, and annotations.
 *
 * @slot - Sticker label. Falls back to the `label` attribute.
 * @slot start - Optional leading visual.
 * @csspart base - Sticker container.
 * @csspart start - Leading composition slot.
 * @csspart surface - Colored sticker surface.
 * @csspart text - Sticker text.
 * @cssprop --cad-sticker-bg - Per-instance sticker background.
 * @cssprop --cad-sticker-ink - Per-instance sticker foreground.
 */
export class CadSticker extends LitElement {
  static override properties = {
    label: { type: String },
    shape: { reflect: true, type: String },
    size: { reflect: true, type: String },
    tone: { reflect: true, type: String },
  }
  static override styles = css`
    :host {
      --_sticker-bg: var(--cad-sticker-bg, var(--cad-post-it-blue-bg, #b8d5ff));
      --_sticker-ink: var(
        --cad-sticker-ink,
        var(--cad-post-it-blue-ink, #18345d)
      );
      position: relative;
      display: inline-flex;
      color: var(--_sticker-ink);
      filter: none;
      transform: rotate(-0.4deg);
    }
    :host([tone='coral']) {
      --_sticker-bg: var(
        --cad-sticker-bg,
        var(--cad-post-it-coral-bg, #ffb19f)
      );
      --_sticker-ink: var(
        --cad-sticker-ink,
        var(--cad-post-it-coral-ink, #55251b)
      );
      transform: rotate(0.4deg);
    }
    :host([tone='lemon']) {
      --_sticker-bg: var(
        --cad-sticker-bg,
        var(--cad-post-it-lemon-bg, #fff1a8)
      );
      --_sticker-ink: var(
        --cad-sticker-ink,
        var(--cad-post-it-lemon-ink, #49370d)
      );
    }
    :host([tone='mint']) {
      --_sticker-bg: var(--cad-sticker-bg, var(--cad-post-it-mint-bg, #a9eacb));
      --_sticker-ink: var(
        --cad-sticker-ink,
        var(--cad-post-it-mint-ink, #173d2c)
      );
      transform: rotate(0.3deg);
    }
    :host([tone='violet']) {
      --_sticker-bg: var(
        --cad-sticker-bg,
        var(--cad-sticker-violet-bg, #bba0ff)
      );
      --_sticker-ink: var(
        --cad-sticker-ink,
        var(--cad-sticker-violet-ink, #30205e)
      );
      transform: rotate(-0.5deg);
    }
    .base,
    .surface {
      border-radius: 0;
    }
    .surface {
      position: relative;
      display: inline-flex;
      gap: 0.38rem;
      align-items: center;
      justify-content: center;
      min-height: 2.1rem;
      padding: 0.42rem 0.72rem 0.45rem;
      color: var(--_sticker-ink);
      white-space: nowrap;
      background: color-mix(
        in srgb,
        var(--_sticker-bg) 54%,
        var(--cad-surface, #fff)
      );
      border: 1.5px solid color-mix(in srgb, currentColor 76%, transparent);
      box-shadow: none;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.1;
    }
    .surface::after {
      position: absolute;
      inset: 0.12rem -0.1rem -0.08rem 0.1rem;
      border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
      content: '';
      pointer-events: none;
      transform: rotate(0.7deg);
    }
    :host([size='sm']) .surface {
      min-height: 1.65rem;
      padding: 0.27rem 0.52rem 0.3rem;
      font-size: 0.88rem;
    }
    :host([shape='round']) .base,
    :host([shape='round']) .surface {
      border-radius: 52% 48% 50% 46%;
    }
    :host([shape='round']) .surface {
      flex-direction: column;
      min-width: 4.6rem;
      min-height: 4.25rem;
      padding: 0.75rem;
    }
    :host([shape='burst']) .base,
    :host([shape='burst']) .surface {
      border-radius: 0;
      clip-path: polygon(
        50% 0%,
        58% 12%,
        71% 4%,
        74% 18%,
        88% 15%,
        85% 29%,
        98% 30%,
        89% 43%,
        100% 54%,
        87% 58%,
        92% 73%,
        78% 71%,
        79% 86%,
        65% 79%,
        60% 94%,
        50% 84%,
        40% 94%,
        35% 79%,
        21% 86%,
        22% 71%,
        8% 73%,
        13% 58%,
        0% 54%,
        11% 43%,
        2% 30%,
        15% 29%,
        12% 15%,
        26% 18%,
        29% 4%,
        42% 12%
      );
    }
    :host([shape='burst']) .surface::after,
    :host([shape='banner']) .surface::after {
      border: 0;
    }
    :host([shape='burst']) .surface {
      flex-direction: column;
      min-width: 5.6rem;
      min-height: 5.1rem;
      padding: 1.05rem 0.85rem;
      text-align: center;
    }
    :host([shape='banner']) .base,
    :host([shape='banner']) .surface {
      border-radius: 0;
      clip-path: polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%);
    }
    :host([shape='banner']) .surface {
      padding-inline-end: 1.35rem;
    }
    :host([shape='bubble']) {
      padding-bottom: 0.55rem;
    }
    :host([shape='bubble']) .base,
    :host([shape='bubble']) .surface {
      border-radius: 0;
    }
    :host([shape='bubble'])::after {
      position: absolute;
      bottom: 0;
      left: 1.15rem;
      width: 0.95rem;
      height: 0.65rem;
      content: '';
      background: var(--_sticker-bg);
      clip-path: polygon(0 0, 100% 0, 25% 100%);
    }
    @media (forced-colors: active) {
      .surface {
        color: CanvasText;
        background: Canvas;
        border: 1px solid CanvasText;
      }
    }
  `

  declare label: string
  declare shape: CadStickerShape
  declare size: CadStickerSize
  declare tone: CadStickerTone
  constructor() {
    super()
    this.label = ''
    this.shape = 'label'
    this.size = 'md'
    this.tone = 'blue'
  }
  override render() {
    return html`
      <span class="base" part="base">
        <span class="surface" part="surface">
          <slot name="start" part="start"></slot>
          <span part="text"><slot>${this.label}</slot></span>
        </span>
      </span>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-sticker'))
  customElements.define('cad-sticker', CadSticker)
declare global {
  interface HTMLElementTagNameMap {
    'cad-sticker': CadSticker
  }
}
