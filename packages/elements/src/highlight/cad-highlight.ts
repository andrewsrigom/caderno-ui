import { css, html, LitElement } from 'lit'

export type CadHighlightTone =
  'amber' | 'blue' | 'gray' | 'lavender' | 'mint' | 'pink' | 'yellow'
export type CadHighlightVariant = 'double' | 'marker' | 'underline'

/**
 * A native inline mark with pen-drawn marker and underline treatments.
 *
 * @slot - Highlighted text.
 * @csspart base - Native mark element.
 * @cssprop --cad-highlight-color - Per-instance marker color.
 * @cssprop --cad-highlight-stroke - Per-instance underline color.
 */
export class CadHighlight extends LitElement {
  static override properties = {
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_highlight-marker: var(
        --cad-highlight-color,
        var(--cad-post-it-lemon-bg, #ffe59a)
      );
      --_highlight-stroke: var(
        --cad-highlight-stroke,
        var(--cad-warning-ink, #b77900)
      );
      display: inline;
    }

    :host([tone='blue']) {
      --_highlight-marker: var(
        --cad-highlight-color,
        color-mix(in srgb, var(--cad-link, #005bac) 22%, #fff)
      );
      --_highlight-stroke: var(
        --cad-highlight-stroke,
        var(--cad-link, #005bac)
      );
    }

    :host([tone='mint']) {
      --_highlight-marker: var(
        --cad-highlight-color,
        var(--cad-post-it-mint-bg, #bdebd4)
      );
      --_highlight-stroke: var(
        --cad-highlight-stroke,
        var(--cad-success-ink, #07875f)
      );
    }

    :host([tone='amber']) {
      --_highlight-marker: var(--cad-highlight-color, #ffd89b);
      --_highlight-stroke: var(
        --cad-highlight-stroke,
        var(--cad-warning-ink, #d97706)
      );
    }

    :host([tone='pink']) {
      --_highlight-marker: var(
        --cad-highlight-color,
        var(--cad-post-it-pink-bg, #ffc7dc)
      );
      --_highlight-stroke: var(--cad-highlight-stroke, #d63384);
    }

    :host([tone='lavender']) {
      --_highlight-marker: var(--cad-highlight-color, #d9cbff);
      --_highlight-stroke: var(--cad-highlight-stroke, #7642bd);
    }

    :host([tone='gray']) {
      --_highlight-marker: var(--cad-highlight-color, #dce1e8);
      --_highlight-stroke: var(
        --cad-highlight-stroke,
        var(--cad-ink-muted, #68738c)
      );
    }

    mark {
      position: relative;
      z-index: 0;
      display: inline;
      padding-inline: 0.06em;
      isolation: isolate;
      color: inherit;
      background: transparent;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }

    mark::before,
    mark::after {
      position: absolute;
      z-index: -1;
      display: block;
      pointer-events: none;
      content: '';
    }

    :host([variant='marker']) mark::before {
      inset: 0.12em -0.16em 0.01em -0.13em;
      background:
        linear-gradient(
          177deg,
          transparent 0 5%,
          color-mix(in srgb, var(--_highlight-marker) 86%, transparent) 7% 88%,
          transparent 91%
        ),
        var(--_highlight-marker);
      clip-path: polygon(2% 15%, 98% 5%, 100% 78%, 96% 94%, 1% 84%, 0 31%);
      opacity: 0.9;
      transform: rotate(-0.45deg) skewX(-1.2deg);
    }

    :host([variant='underline']) mark::after {
      right: -0.08em;
      bottom: -0.08em;
      left: -0.05em;
      height: 0.16em;
      background: var(--_highlight-stroke);
      clip-path: polygon(
        0 35%,
        18% 18%,
        52% 30%,
        78% 11%,
        100% 24%,
        98% 78%,
        72% 72%,
        44% 89%,
        17% 72%,
        1% 84%
      );
      transform: rotate(-0.35deg);
    }

    :host([variant='double']) mark::before,
    :host([variant='double']) mark::after {
      right: -0.09em;
      left: -0.05em;
      height: 0.11em;
      background: var(--_highlight-stroke);
    }

    :host([variant='double']) mark::before {
      bottom: 0.02em;
      clip-path: polygon(
        0 36%,
        25% 17%,
        48% 31%,
        76% 12%,
        100% 29%,
        98% 77%,
        71% 66%,
        46% 91%,
        19% 70%,
        1% 83%
      );
      transform: rotate(-0.25deg);
    }

    :host([variant='double']) mark::after {
      bottom: -0.13em;
      clip-path: polygon(
        0 28%,
        18% 18%,
        45% 36%,
        72% 13%,
        100% 23%,
        99% 78%,
        76% 68%,
        51% 88%,
        24% 72%,
        1% 85%
      );
      opacity: 0.9;
      transform: rotate(0.35deg);
    }

    @media (forced-colors: active) {
      mark::before,
      mark::after {
        display: none;
      }

      mark {
        color: CanvasText;
        text-decoration: underline 0.18em Highlight;
        text-decoration-skip-ink: none;
        forced-color-adjust: none;
      }
    }
  `

  declare tone: CadHighlightTone
  declare variant: CadHighlightVariant

  constructor() {
    super()
    this.tone = 'yellow'
    this.variant = 'marker'
  }

  override render() {
    return html`<mark part="base"><slot></slot></mark>`
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-highlight')
) {
  customElements.define('cad-highlight', CadHighlight)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-highlight': CadHighlight
  }
}
