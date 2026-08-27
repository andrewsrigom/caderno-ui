import { css, html, LitElement, nothing, svg } from 'lit'

import { cadDoodleAvatarPaths, type CadDoodleAvatarVariant } from './doodles.js'

export {
  cadDoodleAvatarPaths,
  cadDoodleAvatarVariants,
  type CadDoodleAvatarVariant,
} from './doodles.js'

export type CadDoodleAvatarSize = 'lg' | 'md' | 'sm' | 'xl'

/**
 * A standalone hand-drawn character portrait for profiles and editorial accents.
 *
 * @csspart drawing - The rendered character SVG.
 * @cssprop --cad-doodle-avatar-background - Per-instance portrait background.
 * @cssprop --cad-doodle-avatar-ink - Per-instance drawing color.
 * @cssprop --cad-doodle-avatar-size - Per-instance portrait size.
 */
export class CadDoodleAvatar extends LitElement {
  static override properties = {
    label: { type: String },
    size: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_doodle-size: var(--cad-doodle-avatar-size, 3rem);
      display: inline-grid;
      place-items: center;
      width: var(--_doodle-size);
      height: var(--_doodle-size);
      box-sizing: border-box;
      color: var(--cad-doodle-avatar-ink, var(--cad-post-it-blue-ink, #20375d));
      overflow: visible;
      background: var(
        --cad-doodle-avatar-background,
        var(--cad-post-it-blue-bg, #cfe2ff)
      );
      border: 2px solid color-mix(in srgb, currentColor 42%, transparent);
      border-radius: 52% 48% 54% 46%;
      line-height: 0;
      vertical-align: middle;
    }

    :host([size='sm']) {
      --_doodle-size: var(--cad-doodle-avatar-size, 2.25rem);
    }

    :host([size='lg']) {
      --_doodle-size: var(--cad-doodle-avatar-size, 4.25rem);
    }

    :host([size='xl']) {
      --_doodle-size: var(--cad-doodle-avatar-size, 6.5rem);
    }

    :host([slot='image']) {
      --_doodle-size: 100%;
      background: transparent;
      border: 0;
    }

    svg {
      display: block;
      width: 74%;
      height: 74%;
      overflow: visible;
    }

    path {
      vector-effect: non-scaling-stroke;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.55;
    }

    .echo {
      opacity: 0.22;
      transform: translate(0.36px, -0.22px);
    }

    @media (forced-colors: active) {
      :host {
        border-color: CanvasText;
      }
    }
  `

  declare label: string
  declare size: CadDoodleAvatarSize
  declare variant: CadDoodleAvatarVariant

  constructor() {
    super()
    this.label = ''
    this.size = 'md'
    this.variant = 'happy'
  }

  override render() {
    const paths =
      cadDoodleAvatarPaths[this.variant] ?? cadDoodleAvatarPaths.happy
    const label = this.label.trim()
    const isDecorative = label.length === 0

    return html`
      <svg
        aria-hidden=${isDecorative ? 'true' : nothing}
        aria-label=${isDecorative ? nothing : label}
        fill="none"
        part="drawing"
        role=${isDecorative ? nothing : 'img'}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g class="echo">${paths.map((path) => svg`<path d=${path}></path>`)}</g>
        <g>${paths.map((path) => svg`<path d=${path}></path>`)}</g>
      </svg>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-doodle-avatar')
) {
  customElements.define('cad-doodle-avatar', CadDoodleAvatar)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-doodle-avatar': CadDoodleAvatar
  }
}
