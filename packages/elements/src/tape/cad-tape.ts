import { css, html, LitElement } from 'lit'

export type CadTapeSize = 'lg' | 'md' | 'sm'
export type CadTapeTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'paper' | 'violet'

/**
 * A decorative strip of translucent notebook tape.
 *
 * @csspart base - Decorative tape surface.
 * @cssprop --cad-tape-tilt - Per-instance rotation.
 */
export class CadTape extends LitElement {
  static override properties = {
    size: { reflect: true, type: String },
    tilt: { type: Number },
    tone: { reflect: true, type: String },
  }
  static override styles = css`
    :host {
      --_tape-bg: var(--cad-post-it-lemon-bg, #fff1a8);
      display: inline-block;
      line-height: 0;
    }
    :host([tone='blue']) {
      --_tape-bg: var(--cad-post-it-blue-bg, #b8d5ff);
    }
    :host([tone='coral']) {
      --_tape-bg: var(--cad-post-it-coral-bg, #ffb19f);
    }
    :host([tone='mint']) {
      --_tape-bg: var(--cad-post-it-mint-bg, #a9eacb);
    }
    :host([tone='paper']) {
      --_tape-bg: var(--cad-tape-paper-bg, #d5cfb9);
    }
    :host([tone='violet']) {
      --_tape-bg: var(--cad-sticker-violet-bg, #bba0ff);
    }
    .base {
      display: inline-block;
      width: 5.4rem;
      height: 1.55rem;
      background: color-mix(in srgb, var(--_tape-bg) 82%, transparent);
      clip-path: polygon(
        0 12%,
        6% 0,
        14% 22%,
        24% 4%,
        34% 18%,
        46% 6%,
        58% 20%,
        70% 8%,
        82% 22%,
        94% 6%,
        100% 18%,
        100% 82%,
        94% 100%,
        82% 78%,
        70% 92%,
        58% 80%,
        46% 94%,
        34% 82%,
        24% 96%,
        14% 78%,
        6% 100%,
        0 88%
      );
      filter: drop-shadow(
        0 0.16rem 0.24rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.14)
      );
      transform: rotate(var(--cad-tape-tilt, -1.4deg));
    }
    :host([size='sm']) .base {
      width: 3.4rem;
      height: 1.15rem;
    }
    :host([size='lg']) .base {
      width: 7.6rem;
      height: 1.85rem;
    }
    @media (forced-colors: active) {
      .base {
        background: CanvasText;
      }
    }
  `

  declare size: CadTapeSize
  declare tilt: number
  declare tone: CadTapeTone
  constructor() {
    super()
    this.size = 'md'
    this.tilt = -1.4
    this.tone = 'lemon'
  }
  override render() {
    return html`<span
      aria-hidden="true"
      class="base"
      part="base"
      style="--cad-tape-tilt: ${this.tilt}deg"
    ></span>`
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-tape'))
  customElements.define('cad-tape', CadTape)
declare global {
  interface HTMLElementTagNameMap {
    'cad-tape': CadTape
  }
}
