import { css, html, LitElement } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

export type CadProgressSize = 'md' | 'sm' | 'xs'
export type CadProgressTone = 'amber' | 'blue' | 'mint' | 'neutral' | 'red'

/**
 * A native horizontal progress indicator for determinate and indeterminate work.
 *
 * @slot fallback - Readable progress shown before the component upgrades.
 * @csspart bar - Native progress element.
 * @csspart base - Progress layout.
 * @csspart label - Visible progress label.
 * @csspart value - Visible percentage or count.
 * @cssprop --cad-progress-bg - Per-instance track color.
 * @cssprop --cad-progress-fill - Per-instance fill color.
 * @cssprop --cad-progress-ink - Per-instance foreground color.
 */
export class CadProgress extends LitElement {
  static override properties = {
    label: { type: String },
    max: { reflect: true, type: Number },
    showValue: { attribute: 'show-value', reflect: true, type: Boolean },
    size: { reflect: true, type: String },
    tone: { reflect: true, type: String },
    value: { reflect: true, type: Number },
    valueLabel: { attribute: 'value-label', type: String },
  }

  static override styles = css`
    :host {
      --_progress-accent: var(--cad-progress-fill, var(--cad-link, #005bac));
      --_progress-bg: var(
        --cad-progress-bg,
        color-mix(in srgb, var(--_progress-accent) 6%, #fff)
      );
      --_progress-ink: var(--cad-progress-ink, var(--cad-ink, #162033));
      --_progress-height: 0.65rem;
      display: block;
      min-width: 0;
    }

    :host([tone='mint']) {
      --_progress-accent: var(
        --cad-progress-fill,
        var(--cad-success-ink, #07875f)
      );
    }

    :host([tone='amber']) {
      --_progress-accent: var(
        --cad-progress-fill,
        var(--cad-warning-ink, #d97706)
      );
    }

    :host([tone='red']) {
      --_progress-accent: var(
        --cad-progress-fill,
        var(--cad-danger-ink, #e13d45)
      );
    }

    :host([tone='neutral']) {
      --_progress-accent: var(
        --cad-progress-fill,
        var(--cad-ink-muted, #68738c)
      );
    }

    :host([size='sm']) {
      --_progress-height: 0.5rem;
    }

    :host([size='xs']) {
      --_progress-height: 0.36rem;
      display: inline-block;
      max-width: 100%;
    }

    .base {
      display: grid;
      grid-template-areas:
        'label label'
        'bar value';
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.35rem 1rem;
      align-items: center;
      width: 100%;
      min-width: 0;
      color: var(--_progress-ink);
    }

    .base:not(.has-value) {
      grid-template-areas:
        'label'
        'bar';
      grid-template-columns: minmax(0, 1fr);
    }

    .label {
      grid-area: label;
      min-width: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.15;
    }

    .value {
      grid-area: value;
      min-width: 3.5rem;
      color: var(--_progress-ink);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-xs, 0.88rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
      text-align: end;
      white-space: nowrap;
    }

    progress.bar {
      grid-area: bar;
      width: 100%;
      height: var(--_progress-height);
      min-width: 4rem;
      overflow: hidden;
      appearance: none;
      color: var(--_progress-accent);
      background: var(--_progress-bg);
      border: 1px solid
        color-mix(in srgb, var(--_progress-accent) 68%, transparent);
      border-radius: 999px;
      box-shadow: 0 1px 0
        color-mix(in srgb, var(--_progress-accent) 18%, transparent);
    }

    progress.bar::-webkit-progress-bar {
      background: var(--_progress-bg);
      border-radius: inherit;
    }

    progress.bar::-webkit-progress-value {
      background:
        repeating-linear-gradient(
          -18deg,
          transparent 0 0.24rem,
          rgb(255 255 255 / 34%) 0.24rem 0.3rem
        ),
        var(--_progress-accent);
      border-radius: inherit;
      box-shadow: inset -1px 0
        color-mix(in srgb, var(--_progress-accent) 72%, #000);
    }

    progress.bar::-moz-progress-bar {
      background:
        repeating-linear-gradient(
          -18deg,
          transparent 0 0.24rem,
          rgb(255 255 255 / 34%) 0.24rem 0.3rem
        ),
        var(--_progress-accent);
      border-radius: inherit;
    }

    progress.bar:not([value]) {
      background:
        repeating-linear-gradient(
          118deg,
          transparent 0 0.65rem,
          var(--_progress-accent) 0.68rem 0.86rem,
          transparent 0.9rem 1.5rem
        ),
        var(--_progress-bg);
      background-size: 2.2rem 100%;
    }

    progress.bar:not([value])::-webkit-progress-bar {
      background:
        repeating-linear-gradient(
          118deg,
          transparent 0 0.65rem,
          var(--_progress-accent) 0.68rem 0.86rem,
          transparent 0.9rem 1.5rem
        ),
        var(--_progress-bg);
      background-size: 2.2rem 100%;
    }

    :host([size='xs']) .base {
      grid-template-areas: 'label bar value';
      grid-template-columns: auto minmax(4rem, 8rem) auto;
      gap: 0.55rem;
      width: fit-content;
      max-width: 100%;
    }

    :host([size='xs']) .base:not(.has-value) {
      grid-template-areas: 'label bar';
      grid-template-columns: auto minmax(4rem, 8rem);
    }

    :host([size='xs']) .label,
    :host([size='xs']) .value {
      font-size: var(--cad-hand-xs, 0.82rem);
    }

    slot[name='fallback'] {
      display: none;
    }

    @media (prefers-reduced-motion: no-preference) {
      progress.bar:not([value]),
      progress.bar:not([value])::-webkit-progress-bar {
        animation: cad-progress-drift 1.15s linear infinite;
      }
    }

    @keyframes cad-progress-drift {
      to {
        background-position: 2.2rem 0;
      }
    }

    @media (forced-colors: active) {
      progress.bar {
        border-color: CanvasText;
      }

      progress.bar::-webkit-progress-value,
      progress.bar::-moz-progress-bar {
        background: Highlight;
      }
    }
  `

  declare label: string
  declare max: number
  declare showValue: boolean
  declare size: CadProgressSize
  declare tone: CadProgressTone
  declare value: number | undefined
  declare valueLabel: string

  constructor() {
    super()
    this.label = 'Progress'
    this.max = 100
    this.showValue = false
    this.size = 'md'
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
    return value === undefined
      ? ''
      : `${Math.round((value / this.normalizedMax) * 100)}%`
  }

  override render() {
    const value = this.normalizedValue
    const visibleValue = this.visibleValue
    const hasVisibleValue = this.showValue && visibleValue.length > 0

    return html`
      <div class="base ${hasVisibleValue ? 'has-value' : ''}" part="base">
        <span class="label" part="label">${this.label}</span>
        <progress
          aria-label=${this.label}
          aria-valuetext=${ifDefined(this.valueLabel || undefined)}
          class="bar"
          max=${this.normalizedMax}
          part="bar"
          value=${ifDefined(value)}
        ></progress>
        ${
          hasVisibleValue
            ? html`<span class="value" part="value">${visibleValue}</span>`
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
