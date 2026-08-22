import { css, html, LitElement } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

export type CadProgressTone = 'blue' | 'coral' | 'lemon' | 'mint'

/**
 * A labeled progress indicator with determinate and indeterminate states.
 *
 * @slot fallback - Readable progress shown before the component upgrades.
 * @csspart bar - Native progress element.
 * @csspart base - Progress container.
 * @csspart label - Visible progress label.
 * @csspart value - Visible progress value.
 * @cssprop --cad-progress-bg - Per-instance track color.
 * @cssprop --cad-progress-fill - Per-instance fill color.
 * @cssprop --cad-progress-ink - Per-instance foreground color.
 */
export class CadProgress extends LitElement {
  static override properties = {
    label: { type: String },
    max: { reflect: true, type: Number },
    showValue: { attribute: 'show-value', reflect: true, type: Boolean },
    tone: { reflect: true, type: String },
    value: { reflect: true, type: Number },
    valueLabel: { attribute: 'value-label', type: String },
  }

  static override styles = css`
    :host {
      --_progress-bg: var(
        --cad-progress-bg,
        var(--cad-surface-sunken, #e7dfca)
      );
      --_progress-fill: var(
        --cad-progress-fill,
        var(--cad-post-it-blue-bg, #88b7ff)
      );
      --_progress-ink: var(--cad-progress-ink, var(--cad-ink, #25202a));
      display: block;
    }

    :host([tone='coral']) {
      --_progress-fill: var(
        --cad-progress-fill,
        var(--cad-post-it-coral-bg, #ff9d87)
      );
    }

    :host([tone='lemon']) {
      --_progress-fill: var(
        --cad-progress-fill,
        var(--cad-post-it-lemon-bg, #f2d85f)
      );
    }

    :host([tone='mint']) {
      --_progress-fill: var(
        --cad-progress-fill,
        var(--cad-post-it-mint-bg, #80d9ad)
      );
    }

    .base {
      display: grid;
      gap: 0.45rem;
      color: var(--_progress-ink);
    }

    .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
    }

    .value {
      font-family: var(--cad-font-mono, monospace);
      font-size: 0.82em;
    }

    progress {
      width: 100%;
      height: 1rem;
      overflow: hidden;
      appearance: none;
      background: var(--_progress-bg);
      border: 1.5px solid
        color-mix(in srgb, var(--_progress-ink) 38%, transparent);
      border-radius: 999px 920px 980px 940px;
    }

    progress::-webkit-progress-bar {
      background: var(--_progress-bg);
    }

    progress::-webkit-progress-value {
      background: repeating-linear-gradient(
        -18deg,
        var(--_progress-fill),
        var(--_progress-fill) 0.4rem,
        color-mix(in srgb, var(--_progress-fill) 72%, var(--_progress-ink))
          0.44rem,
        color-mix(in srgb, var(--_progress-fill) 72%, var(--_progress-ink))
          0.5rem
      );
      border-radius: inherit;
    }

    progress::-moz-progress-bar {
      background: repeating-linear-gradient(
        -18deg,
        var(--_progress-fill),
        var(--_progress-fill) 0.4rem,
        color-mix(in srgb, var(--_progress-fill) 72%, var(--_progress-ink))
          0.44rem,
        color-mix(in srgb, var(--_progress-fill) 72%, var(--_progress-ink))
          0.5rem
      );
      border-radius: inherit;
    }

    slot[name='fallback'] {
      display: none;
    }

    @media (prefers-reduced-motion: no-preference) {
      progress:not([value]) {
        background: repeating-linear-gradient(
          -18deg,
          var(--_progress-bg),
          var(--_progress-bg) 0.55rem,
          var(--_progress-fill) 0.58rem,
          var(--_progress-fill) 0.8rem
        );
        background-size: 2rem 100%;
        animation: cad-progress-drift 1.4s linear infinite;
      }
    }

    @keyframes cad-progress-drift {
      to {
        background-position: 2rem 0;
      }
    }

    @media (forced-colors: active) {
      progress {
        border-color: CanvasText;
      }
    }
  `

  declare label: string
  declare max: number
  declare showValue: boolean
  declare tone: CadProgressTone
  declare value: number | undefined
  declare valueLabel: string

  constructor() {
    super()
    this.label = 'Progress'
    this.max = 100
    this.showValue = true
    this.tone = 'blue'
    this.value = undefined
    this.valueLabel = ''
  }

  private get normalizedMax(): number {
    return Number.isFinite(this.max) && this.max > 0 ? this.max : 100
  }

  private get normalizedValue(): number | undefined {
    if (this.value === undefined || !Number.isFinite(this.value))
      return undefined
    return Math.min(this.normalizedMax, Math.max(0, this.value))
  }

  private get visibleValue(): string {
    if (this.valueLabel) return this.valueLabel
    const value = this.normalizedValue
    if (value === undefined) return 'In progress'
    return `${Math.round((value / this.normalizedMax) * 100)}%`
  }

  override render() {
    const value = this.normalizedValue

    return html`
      <div class="base" part="base">
        <div class="header">
          <span part="label">${this.label}</span>
          ${
            this.showValue
              ? html`<span class="value" part="value"
                  >${this.visibleValue}</span
                >`
              : null
          }
        </div>
        <progress
          aria-label=${this.label}
          aria-valuetext=${ifDefined(this.valueLabel || undefined)}
          max=${this.normalizedMax}
          part="bar"
          value=${ifDefined(value)}
        ></progress>
        <slot name="fallback"></slot>
      </div>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-progress')
) {
  customElements.define('cad-progress', CadProgress)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-progress': CadProgress
  }
}
