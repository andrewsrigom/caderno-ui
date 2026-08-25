import { css, html, LitElement } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

export type CadProgressTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadProgressVariant = 'bar' | 'ring' | 'steps'

/**
 * A labeled progress indicator with determinate and indeterminate states.
 *
 * @slot fallback - Readable progress shown before the component upgrades.
 * @csspart bar - Native progress element.
 * @csspart base - Progress container.
 * @csspart label - Visible progress label.
 * @csspart ring - Circular progress visualization.
 * @csspart steps - Segmented progress visualization.
 * @csspart value - Visible progress value.
 * @cssprop --cad-progress-bg - Per-instance track color.
 * @cssprop --cad-progress-fill - Per-instance fill color.
 * @cssprop --cad-progress-ink - Per-instance foreground color.
 */
export class CadProgress extends LitElement {
  static override properties = {
    current: { reflect: true, type: Number },
    label: { type: String },
    max: { reflect: true, type: Number },
    showValue: { attribute: 'show-value', reflect: true, type: Boolean },
    steps: { reflect: true, type: Number },
    tone: { reflect: true, type: String },
    value: { reflect: true, type: Number },
    valueLabel: { attribute: 'value-label', type: String },
    variant: { reflect: true, type: String },
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

    :host([tone='pink']) {
      --_progress-fill: var(
        --cad-progress-fill,
        var(--cad-post-it-pink-bg, #ffb7d5)
      );
    }

    :host([tone='violet']) {
      --_progress-fill: var(
        --cad-progress-fill,
        var(--cad-sticker-violet-bg, #bba0ff)
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

    progress.bar {
      width: 100%;
      height: 1rem;
      overflow: hidden;
      appearance: none;
      background: var(--_progress-bg);
      border: 1.5px solid
        color-mix(in srgb, var(--_progress-ink) 38%, transparent);
      border-radius: 999px 920px 980px 940px;
    }

    progress.bar::-webkit-progress-bar {
      background: var(--_progress-bg);
    }

    progress.bar::-webkit-progress-value {
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

    progress.bar::-moz-progress-bar {
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

    .semantic {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(var(--_step-count), minmax(0, 1fr));
      gap: 0.45rem;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .steps li {
      min-width: 0;
      height: 0.6rem;
      background: var(--_progress-bg);
      border: 1px solid
        color-mix(in srgb, var(--_progress-ink) 28%, transparent);
      border-radius: 999px;
    }

    .steps li[data-state='complete'],
    .steps li[data-state='current'] {
      background: var(--_progress-fill);
    }

    .steps li[data-state='current'] {
      outline: 2px solid
        color-mix(in srgb, var(--_progress-ink) 42%, transparent);
      outline-offset: 2px;
    }

    :host([variant='ring']) .base {
      justify-items: center;
      width: fit-content;
      text-align: center;
    }

    :host([variant='ring']) .header {
      display: grid;
      justify-items: center;
    }

    .ring {
      display: grid;
      place-items: center;
      width: 5.5rem;
      aspect-ratio: 1;
      padding: 0.55rem;
      background: conic-gradient(
        var(--_progress-fill) var(--_progress-angle),
        var(--_progress-bg) 0
      );
      border: 1px solid
        color-mix(in srgb, var(--_progress-ink) 32%, transparent);
      border-radius: 50% 48% 52% 47%;
    }

    .ring::before {
      width: 100%;
      height: 100%;
      grid-area: 1 / 1;
      background: var(--cad-surface, #fffdf7);
      border-radius: 48% 52% 47% 53%;
      content: '';
    }

    .ring strong {
      position: relative;
      grid-area: 1 / 1;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
    }

    @media (prefers-reduced-motion: no-preference) {
      progress.bar:not([value]) {
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
      progress.bar,
      .ring,
      .steps li {
        border-color: CanvasText;
      }
    }
  `

  declare current: number
  declare label: string
  declare max: number
  declare showValue: boolean
  declare steps: number
  declare tone: CadProgressTone
  declare value: number | undefined
  declare valueLabel: string
  declare variant: CadProgressVariant

  constructor() {
    super()
    this.current = 0
    this.label = 'Progress'
    this.max = 100
    this.showValue = true
    this.steps = 0
    this.tone = 'blue'
    this.value = undefined
    this.valueLabel = ''
    this.variant = 'bar'
  }

  private get normalizedMax(): number {
    if (this.variant === 'steps')
      return Number.isFinite(this.steps) && this.steps > 0
        ? Math.floor(this.steps)
        : 1
    return Number.isFinite(this.max) && this.max > 0 ? this.max : 100
  }

  private get normalizedValue(): number | undefined {
    if (this.variant === 'steps') {
      const current = Number.isFinite(this.current) ? this.current : 0
      return Math.min(this.normalizedMax, Math.max(0, Math.floor(current)))
    }
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

  private get percentage(): number {
    const value = this.normalizedValue
    return value === undefined
      ? 0
      : Math.round((value / this.normalizedMax) * 100)
  }

  override render() {
    const value = this.normalizedValue
    const progress =
      this.variant === 'bar'
        ? html`<progress
            aria-label=${this.label}
            aria-valuetext=${ifDefined(this.valueLabel || undefined)}
            class="bar"
            max=${this.normalizedMax}
            part="bar"
            value=${ifDefined(value)}
          ></progress>`
        : html`<progress
            aria-label=${this.label}
            aria-valuetext=${ifDefined(this.valueLabel || undefined)}
            class="semantic"
            max=${this.normalizedMax}
            value=${ifDefined(value)}
          ></progress>`

    return html`
      <div class="base" part="base">
        <div class="header">
          <span part="label">${this.label}</span>
          ${
            this.showValue && this.variant !== 'ring'
              ? html`<span class="value" part="value"
                  >${this.visibleValue}</span
                >`
              : null
          }
        </div>
        ${progress}
        ${
          this.variant === 'steps'
            ? html`<ol
                aria-hidden="true"
                class="steps"
                part="steps"
                style="--_step-count: ${this.normalizedMax}"
              >
                ${Array.from({ length: this.normalizedMax }, (_, index) => {
                  const current = value ?? 0
                  const state =
                    index < current
                      ? 'complete'
                      : index === current
                        ? 'current'
                        : 'pending'
                  return html`<li data-state=${state}></li>`
                })}
              </ol>`
            : null
        }
        ${
          this.variant === 'ring'
            ? html`<span
                aria-hidden="true"
                class="ring"
                part="ring"
                style="--_progress-angle: ${this.percentage * 3.6}deg"
                ><strong>${this.percentage}%</strong></span
              >`
            : null
        }
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
