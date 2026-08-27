import { css, html, LitElement, nothing } from 'lit'

export type CadDividerDensity = 'dense' | 'loose' | 'regular'
export type CadDividerOrientation = 'horizontal' | 'vertical'
export type CadDividerTone = 'accent' | 'ink' | 'muted' | 'strong'
export type CadDividerVariant =
  'dashed' | 'dotted' | 'double' | 'solid' | 'wavy'

/**
 * A hand-drawn visual or semantic separator with optional centered context.
 *
 * @slot - Optional centered label.
 * @slot start - Optional icon or leading mark beside the label.
 * @csspart base - Separator row.
 * @csspart content - Centered label container.
 * @csspart line - Each separator line.
 * @cssprop --cad-divider-color - Per-instance separator color.
 */
export class CadDivider extends LitElement {
  static override properties = {
    decorative: { reflect: true, type: Boolean },
    density: { reflect: true, type: String },
    label: { type: String },
    orientation: { reflect: true, type: String },
    semantic: { reflect: true, type: Boolean },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_divider-alpha: 78%;
      --_divider-color: var(--cad-divider-color, var(--cad-link, currentColor));
      --_divider-on: 0.9rem;
      --_divider-off: 0.75rem;
      --_divider-thickness: 1.5px;
      display: block;
      color: var(--_divider-color);
    }

    :host([orientation='vertical']) {
      display: inline-block;
      align-self: stretch;
      min-height: 1rem;
    }

    :host([tone='ink']) {
      --_divider-color: var(--cad-divider-color, var(--cad-ink, currentColor));
    }

    :host([tone='muted']) {
      --_divider-alpha: 28%;
    }

    :host([tone='strong']) {
      --_divider-alpha: 100%;
    }

    :host([density='dense']) {
      --_divider-on: 0.55rem;
      --_divider-off: 0.45rem;
    }

    :host([density='loose']) {
      --_divider-on: 1.35rem;
      --_divider-off: 1rem;
    }

    .base {
      display: flex;
      gap: 0.85rem;
      align-items: center;
      width: 100%;
      min-width: 0;
    }

    .line {
      display: block;
      flex: 1 1 auto;
      width: 100%;
      height: var(--_divider-thickness);
      background: color-mix(
        in srgb,
        var(--_divider-color) var(--_divider-alpha),
        transparent
      );
      transform: rotate(-0.08deg);
    }

    .content {
      display: inline-flex;
      flex: 0 0 auto;
      gap: 0.45rem;
      align-items: center;
      color: var(--_divider-color);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      line-height: 1;
      white-space: nowrap;
    }

    .content[hidden],
    .base:not(.has-content) .line:last-child {
      display: none;
    }

    ::slotted([slot='start']) {
      --cad-icon-size: 100%;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.35em;
      height: 1.35em;
      padding: 0.14em;
      border: 1.5px solid currentColor;
      border-radius: 50%;
      line-height: 0;
      vertical-align: 0;
    }

    :host([variant='dashed']) .line {
      background: repeating-linear-gradient(
        90deg,
        color-mix(
            in srgb,
            var(--_divider-color) var(--_divider-alpha),
            transparent
          )
          0,
        color-mix(
            in srgb,
            var(--_divider-color) var(--_divider-alpha),
            transparent
          )
          var(--_divider-on),
        transparent var(--_divider-on),
        transparent calc(var(--_divider-on) + var(--_divider-off))
      );
    }

    :host([variant='dotted']) .line {
      height: 3px;
      background: radial-gradient(
        circle,
        color-mix(
            in srgb,
            var(--_divider-color) var(--_divider-alpha),
            transparent
          )
          38%,
        transparent 44%
      );
      background-size: calc(var(--_divider-on) + var(--_divider-off)) 100%;
    }

    :host([variant='double']) .line {
      height: 6px;
      background:
        linear-gradient(
            color-mix(
              in srgb,
              var(--_divider-color) var(--_divider-alpha),
              transparent
            ),
            color-mix(
              in srgb,
              var(--_divider-color) var(--_divider-alpha),
              transparent
            )
          )
          0 0 / 100% 1.25px no-repeat,
        linear-gradient(
            color-mix(
              in srgb,
              var(--_divider-color) var(--_divider-alpha),
              transparent
            ),
            color-mix(
              in srgb,
              var(--_divider-color) var(--_divider-alpha),
              transparent
            )
          )
          0 5px / 100% 1px no-repeat;
    }

    :host([variant='wavy']) .line {
      height: 6px;
      background-color: color-mix(
        in srgb,
        var(--_divider-color) var(--_divider-alpha),
        transparent
      );
      mask: radial-gradient(circle at 50% 0, transparent 3px, black 3.5px) 0
        100% / 12px 6px repeat-x;
    }

    :host([orientation='vertical']) .base {
      width: var(--_divider-thickness);
      height: 100%;
      min-height: 1rem;
    }

    :host([orientation='vertical']) .content,
    :host([orientation='vertical']) .line:last-child {
      display: none;
    }

    :host([orientation='vertical']) .line {
      width: var(--_divider-thickness);
      height: 100%;
      min-height: 1rem;
      transform: none;
    }

    :host([orientation='vertical'][variant='dashed']) .line {
      background: repeating-linear-gradient(
        180deg,
        color-mix(
            in srgb,
            var(--_divider-color) var(--_divider-alpha),
            transparent
          )
          0,
        color-mix(
            in srgb,
            var(--_divider-color) var(--_divider-alpha),
            transparent
          )
          var(--_divider-on),
        transparent var(--_divider-on),
        transparent calc(var(--_divider-on) + var(--_divider-off))
      );
    }

    :host([orientation='vertical'][variant='dotted']) .line {
      width: 3px;
      background: radial-gradient(
        circle,
        var(--_divider-color) 38%,
        transparent 44%
      );
      background-size: 100% calc(var(--_divider-on) + var(--_divider-off));
    }

    :host([orientation='vertical'][variant='double']) .line {
      width: 6px;
      background:
        linear-gradient(var(--_divider-color), var(--_divider-color)) 0 0 / 1px
          100% no-repeat,
        linear-gradient(var(--_divider-color), var(--_divider-color)) 5px 0 /
          1px 100% no-repeat;
    }

    :host([orientation='vertical'][variant='wavy']) .line {
      width: 6px;
      background-color: color-mix(
        in srgb,
        var(--_divider-color) var(--_divider-alpha),
        transparent
      );
      mask: radial-gradient(circle at 0 50%, transparent 3px, black 3.5px) 100%
        0 / 6px 12px repeat-y;
    }

    @media (forced-colors: active) {
      .line {
        background: CanvasText;
      }
    }
  `

  declare decorative: boolean
  declare density: CadDividerDensity
  declare label: string
  declare orientation: CadDividerOrientation
  declare semantic: boolean
  declare tone: CadDividerTone
  declare variant: CadDividerVariant

  constructor() {
    super()
    this.decorative = true
    this.density = 'regular'
    this.label = ''
    this.orientation = 'horizontal'
    this.semantic = false
    this.tone = 'accent'
    this.variant = 'solid'
  }

  override render() {
    const hasContent =
      this.orientation === 'horizontal' &&
      Boolean(
        this.label ||
        this.textContent?.trim() ||
        this.querySelector('[slot="start"]'),
      )
    const semantic = this.semantic || !this.decorative

    return html`
      <div
        aria-hidden=${!semantic && !hasContent ? 'true' : nothing}
        aria-label=${semantic && this.label ? this.label : nothing}
        aria-orientation=${semantic ? this.orientation : nothing}
        class=${hasContent ? 'base has-content' : 'base'}
        part="base"
        role=${semantic ? 'separator' : 'none'}
      >
        <span aria-hidden="true" class="line" part="line"></span>
        <span class="content" ?hidden=${!hasContent} part="content">
          <slot name="start"></slot>
          <slot>${this.label}</slot>
        </span>
        <span aria-hidden="true" class="line" part="line"></span>
      </div>
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
