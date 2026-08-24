import { css, html, LitElement, nothing } from 'lit'

export type CadDividerDensity = 'dense' | 'loose' | 'regular'
export type CadDividerOrientation = 'horizontal' | 'vertical'
export type CadDividerTone = 'accent' | 'ink' | 'muted' | 'strong'
export type CadDividerVariant = 'dashed' | 'dotted' | 'wavy'

/**
 * A hand-drawn visual or semantic separator.
 *
 * @csspart base - Separator line.
 * @cssprop --cad-divider-color - Per-instance separator color.
 */
export class CadDivider extends LitElement {
  static override properties = {
    decorative: { reflect: true, type: Boolean },
    density: { reflect: true, type: String },
    orientation: { reflect: true, type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_divider-color: var(
        --cad-divider-color,
        var(--cad-ink-muted, currentColor)
      );
      --_divider-on: 4px;
      --_divider-off: 5px;
      --_divider-thickness: 1.5px;
      display: block;
    }

    :host([orientation='vertical']) {
      display: inline-block;
      align-self: stretch;
      min-height: 1rem;
    }

    :host([tone='accent']) {
      --_divider-color: var(--cad-link, currentColor);
    }

    :host([tone='ink']) {
      --_divider-color: var(--cad-ink, currentColor);
    }

    :host([tone='strong']) {
      --_divider-color: var(--cad-ink-soft, currentColor);
    }

    :host([density='dense']) {
      --_divider-on: 3px;
      --_divider-off: 3px;
    }

    :host([density='loose']) {
      --_divider-on: 6px;
      --_divider-off: 9px;
    }

    .base {
      display: block;
      width: 100%;
      height: var(--_divider-thickness);
      background: repeating-linear-gradient(
        90deg,
        color-mix(in srgb, var(--_divider-color) 64%, transparent) 0,
        color-mix(in srgb, var(--_divider-color) 64%, transparent)
          var(--_divider-on),
        transparent var(--_divider-on),
        transparent calc(var(--_divider-on) + var(--_divider-off))
      );
    }

    :host([variant='dotted']) .base {
      background: radial-gradient(
        circle,
        var(--_divider-color) 38%,
        transparent 44%
      );
      background-size: calc(var(--_divider-on) + var(--_divider-off)) 100%;
    }

    :host([variant='wavy']) .base {
      height: 6px;
      background-color: color-mix(
        in srgb,
        var(--_divider-color) 64%,
        transparent
      );
      mask: radial-gradient(circle at 50% 0, transparent 3px, black 3.5px) 0
        100% / 12px 6px repeat-x;
    }

    :host([orientation='vertical']) .base {
      width: var(--_divider-thickness);
      height: 100%;
      min-height: 1rem;
      background: repeating-linear-gradient(
        180deg,
        color-mix(in srgb, var(--_divider-color) 64%, transparent) 0,
        color-mix(in srgb, var(--_divider-color) 64%, transparent)
          var(--_divider-on),
        transparent var(--_divider-on),
        transparent calc(var(--_divider-on) + var(--_divider-off))
      );
    }

    :host([orientation='vertical'][variant='dotted']) .base {
      background: radial-gradient(
        circle,
        var(--_divider-color) 38%,
        transparent 44%
      );
      background-size: 100% calc(var(--_divider-on) + var(--_divider-off));
    }

    :host([orientation='vertical'][variant='wavy']) .base {
      width: 6px;
      background-color: color-mix(
        in srgb,
        var(--_divider-color) 64%,
        transparent
      );
      mask: radial-gradient(circle at 0 50%, transparent 3px, black 3.5px) 100%
        0 / 6px 12px repeat-y;
    }

    @media (forced-colors: active) {
      .base {
        background: CanvasText;
      }
    }
  `

  declare decorative: boolean
  declare density: CadDividerDensity
  declare orientation: CadDividerOrientation
  declare tone: CadDividerTone
  declare variant: CadDividerVariant

  constructor() {
    super()
    this.decorative = true
    this.density = 'regular'
    this.orientation = 'horizontal'
    this.tone = 'muted'
    this.variant = 'dashed'
  }

  override render() {
    return html`
      <div
        aria-hidden=${this.decorative ? 'true' : nothing}
        aria-orientation=${this.decorative ? nothing : this.orientation}
        class="base"
        part="base"
        role=${this.decorative ? 'none' : 'separator'}
      ></div>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-divider')
) {
  customElements.define('cad-divider', CadDivider)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-divider': CadDivider
  }
}
