import { css, html, LitElement, nothing, type PropertyValues } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { styleMap } from 'lit/directives/style-map.js'

export type CadSliderThumb = 'end' | 'start'
export type CadSliderTone = 'amber' | 'blue' | 'mint' | 'neutral' | 'red'

export type CadSliderChangeDetail = {
  activeThumb: CadSliderThumb
  endValue?: number
  value: number
}

export type CadSliderInputEvent = CustomEvent<CadSliderChangeDetail>
export type CadSliderChangeEvent = CustomEvent<CadSliderChangeDetail>

let sliderId = 0

/**
 * A form-associated single-value or range slider with native keyboard semantics.
 *
 * @slot label - Visible slider label. Falls back to the `label` attribute.
 * @slot hint - Supporting context. Falls back to the `hint` attribute.
 * @csspart active-track - Selected portion of the track.
 * @csspart base - Slider layout.
 * @csspart control - Native range input.
 * @csspart hint - Supporting description.
 * @csspart label - Visible label.
 * @csspart thumb - Draggable thumb.
 * @csspart tick - One visible scale marker.
 * @csspart track - Hand-drawn slider track.
 * @csspart value - Visible value bubble.
 * @fires input - Fired while a value changes.
 * @fires change - Fired when a value is committed.
 * @fires cad-slider-input - Fired while a value changes with both range values.
 * @fires cad-slider-change - Fired when a value is committed with both range values.
 * @cssprop --cad-slider-accent - Selected track, thumb, and focus color.
 * @cssprop --cad-slider-track - Unselected track color.
 */
export class CadSlider extends LitElement {
  static formAssociated = true

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    disabled: { reflect: true, type: Boolean },
    endValue: { attribute: 'end-value', reflect: true, type: Number },
    hint: { type: String },
    label: { type: String },
    max: { reflect: true, type: Number },
    maxLabel: { attribute: 'max-label', type: String },
    min: { reflect: true, type: Number },
    minLabel: { attribute: 'min-label', type: String },
    name: { reflect: true, type: String },
    range: { reflect: true, type: Boolean },
    showValue: { attribute: 'show-value', reflect: true, type: Boolean },
    step: { reflect: true, type: Number },
    ticks: { type: String },
    tone: { reflect: true, type: String },
    value: { reflect: true, type: Number },
    valuePrefix: { attribute: 'value-prefix', type: String },
    valueSuffix: { attribute: 'value-suffix', type: String },
  }

  static override styles = css`
    :host {
      --_slider-accent: var(--cad-slider-accent, var(--cad-link, #005bac));
      --_slider-track: var(
        --cad-slider-track,
        color-mix(in srgb, var(--cad-ink-muted, #68738c) 46%, transparent)
      );
      display: block;
      width: 100%;
      min-width: 12rem;
      max-width: 52rem;
      color: var(--cad-ink, #162033);
    }

    :host([tone='mint']) {
      --_slider-accent: var(
        --cad-slider-accent,
        var(--cad-success-ink, #07875f)
      );
    }

    :host([tone='amber']) {
      --_slider-accent: var(
        --cad-slider-accent,
        var(--cad-warning-ink, #d97706)
      );
    }

    :host([tone='red']) {
      --_slider-accent: var(
        --cad-slider-accent,
        var(--cad-danger-ink, #e13d45)
      );
    }

    :host([tone='neutral']) {
      --_slider-accent: var(--cad-slider-accent, var(--cad-ink-muted, #68738c));
    }

    .base {
      display: grid;
      gap: 0.55rem;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .heading {
      display: grid;
      gap: 0.1rem;
      min-width: 0;
    }

    .label {
      color: var(--cad-link, #005bac);
      font-family: var(--cad-font-hand, cursive);
      font-size: 1.05rem;
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.25;
    }

    .hint {
      color: var(--cad-ink-muted, #68738c);
      font-family: var(--cad-font-book, serif);
      font-size: 0.78rem;
      line-height: 1.4;
    }

    .slider {
      position: relative;
      box-sizing: border-box;
      min-height: 4.35rem;
      padding-block: 1.9rem 1rem;
      touch-action: none;
      user-select: none;
    }

    .control {
      position: absolute;
      z-index: 3;
      inset: 0;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      appearance: none;
      background: transparent;
      opacity: 0;
      pointer-events: none;
    }

    .control.end {
      z-index: 4;
    }

    .visual {
      position: relative;
      height: 2.75rem;
      cursor: pointer;
    }

    .track,
    .active-track {
      position: absolute;
      top: 50%;
      inset-inline: 0;
      height: 0.15rem;
      border-radius: 0;
      transform: translateY(-50%) rotate(-0.12deg);
      transform-origin: center;
    }

    .track {
      background: var(--_slider-track);
      box-shadow: 0 1px 0
        color-mix(in srgb, var(--_slider-track) 45%, transparent);
    }

    .track::after {
      position: absolute;
      inset: -0.08rem 0 auto;
      height: 1px;
      background: color-mix(in srgb, var(--_slider-track) 42%, transparent);
      content: '';
      transform: rotate(0.15deg);
    }

    .active-track {
      inset-inline-start: var(--_start);
      inset-inline-end: calc(100% - var(--_end));
      height: 0.2rem;
      background:
        repeating-linear-gradient(
          -17deg,
          rgb(255 255 255 / 26%) 0 1px,
          transparent 1px 4px
        ),
        var(--_slider-accent);
      box-shadow: 0 1px 0
        color-mix(in srgb, var(--_slider-accent) 30%, transparent);
      transform: translateY(-50%) rotate(0.08deg);
    }

    .thumb {
      position: absolute;
      z-index: 2;
      top: 50%;
      inset-inline-start: var(--_position);
      display: grid;
      place-items: center;
      box-sizing: border-box;
      width: 1.7rem;
      height: 1.7rem;
      color: var(--_slider-accent);
      background: var(--cad-surface-raised, #fff);
      border: 1.8px solid currentColor;
      border-radius: 52% 48% 55% 45% / 48% 54% 46% 52%;
      box-shadow: 0.08rem 0.1rem 0
        color-mix(in srgb, currentColor 18%, transparent);
      transition:
        transform var(--cad-duration-fast, 140ms) ease,
        box-shadow var(--cad-duration-fast, 140ms) ease;
      transform: translate(-50%, -50%) rotate(-1.2deg);
    }

    .thumb.end {
      border-radius: 47% 53% 45% 55% / 54% 47% 53% 46%;
      transform: translate(-50%, -50%) rotate(1deg);
    }

    .value {
      position: absolute;
      bottom: calc(100% + 0.48rem);
      left: 50%;
      box-sizing: border-box;
      min-width: 2.35rem;
      padding: 0.25rem 0.42rem 0.2rem;
      color: var(--_slider-accent);
      background: var(--cad-surface-raised, #fff);
      border: 1.3px solid currentColor;
      font-family: var(--cad-font-mono, monospace);
      font-size: 0.72rem;
      font-weight: 650;
      line-height: 1;
      text-align: center;
      transform: translateX(-50%) rotate(-0.5deg);
      white-space: nowrap;
    }

    .value::after {
      position: absolute;
      top: calc(100% - 0.22rem);
      left: 50%;
      width: 0.42rem;
      height: 0.42rem;
      background: inherit;
      border-inline-end: 1.3px solid currentColor;
      border-block-end: 1.3px solid currentColor;
      content: '';
      transform: translateX(-50%) rotate(45deg);
    }

    .ticks {
      position: absolute;
      inset: calc(50% + 0.68rem) 0 auto;
      height: 1.2rem;
      pointer-events: none;
    }

    .tick {
      position: absolute;
      inset-inline-start: var(--_position);
      display: grid;
      gap: 0.18rem;
      justify-items: center;
      color: var(--cad-link, #005bac);
      font-family: var(--cad-font-hand, cursive);
      font-size: 0.72rem;
      line-height: 1;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    .tick::before {
      width: 1px;
      height: 0.38rem;
      background: color-mix(in srgb, var(--_slider-accent) 30%, transparent);
      content: '';
    }

    .bounds {
      display: flex;
      justify-content: space-between;
      min-height: 1rem;
      color: var(--cad-link, #005bac);
      font-family: var(--cad-font-hand, cursive);
      font-size: 0.78rem;
      line-height: 1;
    }

    .visual:hover .thumb {
      box-shadow:
        0.08rem 0.1rem 0 color-mix(in srgb, currentColor 18%, transparent),
        0 0 0 0.28rem color-mix(in srgb, currentColor 9%, transparent);
    }

    .control.start:focus-visible ~ .visual .thumb.start,
    .control.end:focus-visible ~ .visual .thumb.end {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--_slider-accent))
      );
      outline-offset: 4px;
      box-shadow:
        0 0 0 1px var(--cad-surface-raised, #fff),
        0 0 0 5px
          color-mix(
            in srgb,
            var(--cad-focus-ring, var(--_slider-accent)) 18%,
            transparent
          );
    }

    .visual[data-dragging='start'] .thumb.start,
    .visual[data-dragging='end'] .thumb.end {
      box-shadow:
        inset 0 0 0 0.18rem
          color-mix(in srgb, var(--_slider-accent) 12%, transparent),
        0.08rem 0.1rem 0 color-mix(in srgb, currentColor 20%, transparent);
      transform: translate(-50%, -50%) scale(1.06) rotate(1deg);
    }

    :host([disabled]) .base {
      opacity: 0.45;
    }

    :host([disabled]) .visual {
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      .thumb {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .track {
        background: GrayText;
      }

      .active-track {
        background: Highlight;
      }

      .thumb,
      .value {
        background: Canvas;
        forced-color-adjust: none;
      }

      .thumb {
        color: Highlight;
      }

      .value {
        color: CanvasText;
        border-color: CanvasText;
      }

      .label,
      .hint,
      .tick,
      .bounds {
        color: CanvasText;
      }
    }
  `

  declare disabled: boolean
  declare endValue: number
  declare hint: string
  declare label: string
  declare max: number
  declare maxLabel: string
  declare min: number
  declare minLabel: string
  declare name: string
  declare range: boolean
  declare showValue: boolean
  declare step: number
  declare ticks: string
  declare tone: CadSliderTone
  declare value: number
  declare valuePrefix: string
  declare valueSuffix: string

  private readonly internals: ElementInternals
  private readonly hintId: string
  private readonly labelId: string
  private activeThumb: CadSliderThumb = 'start'
  private customValidityMessage = ''
  private defaultEndValue = 75
  private defaultValue = 50
  private dragging = false
  private formDisabled = false
  private pointerStartState = ''

  constructor() {
    super()
    const id = ++sliderId
    this.internals = this.attachInternals()
    this.hintId = `cad-slider-hint-${id}`
    this.labelId = `cad-slider-label-${id}`
    this.disabled = false
    this.endValue = 75
    this.hint = ''
    this.label = ''
    this.max = 100
    this.maxLabel = ''
    this.min = 0
    this.minLabel = ''
    this.name = ''
    this.range = false
    this.showValue = false
    this.step = 1
    this.ticks = ''
    this.tone = 'blue'
    this.value = 50
    this.valuePrefix = ''
    this.valueSuffix = ''
  }

  get form(): HTMLFormElement | null {
    return this.internals.form
  }

  get validationMessage(): string {
    return this.internals.validationMessage
  }

  get validity(): ValidityState {
    return this.internals.validity
  }

  get willValidate(): boolean {
    return this.internals.willValidate
  }

  private get controls(): HTMLInputElement[] {
    return Array.from(
      this.renderRoot.querySelectorAll<HTMLInputElement>('input'),
    )
  }

  override focus(options?: FocusOptions): void {
    this.controls[0]?.focus(options)
  }

  focusEnd(options?: FocusOptions): void {
    this.controls[1]?.focus(options)
  }

  checkValidity(): boolean {
    return this.internals.checkValidity()
  }

  reportValidity(): boolean {
    return this.internals.reportValidity()
  }

  setCustomValidity(message: string): void {
    this.customValidityMessage = message
    this.syncFormState()
  }

  formDisabledCallback(disabled: boolean): void {
    this.formDisabled = disabled
    this.requestUpdate()
  }

  formResetCallback(): void {
    this.value = this.defaultValue
    this.endValue = this.defaultEndValue
  }

  formStateRestoreCallback(state: File | FormData | string | null): void {
    if (typeof state !== 'string') return
    const [value, endValue] = state.split(',').map(Number)
    if (value !== undefined && Number.isFinite(value)) {
      this.value = this.normalizeValue(value)
    }
    if (this.range && endValue !== undefined && Number.isFinite(endValue)) {
      this.endValue = this.normalizeValue(endValue)
    }
  }

  protected override firstUpdated(): void {
    this.normalizeExternalValues()
    this.defaultValue = this.value
    this.defaultEndValue = this.endValue
    this.syncFormState()
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (
      changed.has('min') ||
      changed.has('max') ||
      changed.has('step') ||
      changed.has('value') ||
      changed.has('endValue') ||
      changed.has('range')
    ) {
      this.normalizeExternalValues()
    }

    if (
      changed.has('disabled') ||
      changed.has('endValue') ||
      changed.has('name') ||
      changed.has('range') ||
      changed.has('value')
    ) {
      this.syncFormState()
    }
  }

  override render() {
    const disabled = this.disabled || this.formDisabled
    const hasHint = Boolean(this.hint || this.querySelector('[slot="hint"]'))
    const hasLabel = Boolean(this.label || this.querySelector('[slot="label"]'))
    const valuePosition = this.percent(this.value)
    const start = this.range ? valuePosition : this.percent(this.min)
    const end = this.percent(this.range ? this.endValue : this.value)
    const ticks = this.tickValues
    const style = {
      '--_end': `${end}%`,
      '--_start': `${start}%`,
    }

    return html`
      <div class="base" part="base">
        ${
          hasLabel || hasHint
            ? html`<span class="heading">
                ${
                  hasLabel
                    ? html`<span class="label" id=${this.labelId} part="label">
                        <slot name="label">${this.label}</slot>
                      </span>`
                    : nothing
                }
                ${
                  hasHint
                    ? html`<span class="hint" id=${this.hintId} part="hint">
                        <slot name="hint">${this.hint}</slot>
                      </span>`
                    : nothing
                }
              </span>`
            : nothing
        }
        <div class="slider">
          ${this.renderControl('start', disabled, hasHint, hasLabel)}
          ${
            this.range
              ? this.renderControl('end', disabled, hasHint, hasLabel)
              : nothing
          }
          <div
            class="visual"
            data-dragging=${this.dragging ? this.activeThumb : nothing}
            style=${styleMap(style)}
            @pointercancel=${this.handlePointerEnd}
            @pointerdown=${this.handlePointerDown}
            @pointermove=${this.handlePointerMove}
            @pointerup=${this.handlePointerEnd}
          >
            <span aria-hidden="true" class="track" part="track"></span>
            <span
              aria-hidden="true"
              class="active-track"
              part="active-track"
            ></span>
            ${this.renderThumb('start', valuePosition)}
            ${this.range ? this.renderThumb('end', end) : nothing}
            ${
              ticks.length > 0
                ? html`<span aria-hidden="true" class="ticks">
                    ${ticks.map(
                      (tick) =>
                        html`<span
                          class="tick"
                          part="tick"
                          style=${styleMap({
                            '--_position': `${this.percent(tick)}%`,
                          })}
                          >${this.formatValue(tick)}</span
                        >`,
                    )}
                  </span>`
                : nothing
            }
          </div>
          ${
            this.minLabel || this.maxLabel
              ? html`<span aria-hidden="true" class="bounds">
                  <span>${this.minLabel}</span><span>${this.maxLabel}</span>
                </span>`
              : nothing
          }
        </div>
      </div>
    `
  }

  private renderControl(
    thumb: CadSliderThumb,
    disabled: boolean,
    hasHint: boolean,
    hasLabel: boolean,
  ) {
    const value = thumb === 'end' ? this.endValue : this.value
    const label = this.controlLabel(thumb, hasLabel)

    return html`<input
      aria-describedby=${hasHint ? this.hintId : nothing}
      aria-label=${ifDefined(label || undefined)}
      aria-labelledby=${!this.range && hasLabel ? this.labelId : nothing}
      aria-valuetext=${this.formatValue(value)}
      class="control ${thumb}"
      .value=${String(value)}
      ?disabled=${disabled}
      max=${this.normalizedMax}
      min=${this.normalizedMin}
      part="control"
      step=${this.normalizedStep}
      type="range"
      @change=${(event: Event) => this.handleNativeChange(event, thumb)}
      @focus=${() => {
        this.activeThumb = thumb
      }}
      @input=${(event: Event) => this.handleNativeInput(event, thumb)}
      @keydown=${(event: KeyboardEvent) => this.handleKeyDown(event, thumb)}
    />`
  }

  private renderThumb(thumb: CadSliderThumb, position: number) {
    const value = thumb === 'end' ? this.endValue : this.value
    return html`<span
      aria-hidden="true"
      class="thumb ${thumb}"
      part="thumb"
      style=${styleMap({ '--_position': `${position}%` })}
    >
      ${
        this.showValue
          ? html`<span class="value" part="value">
              ${this.formatValue(value)}
            </span>`
          : nothing
      }
    </span>`
  }

  private get normalizedMin(): number {
    return Number.isFinite(this.min) ? this.min : 0
  }

  private get normalizedMax(): number {
    const min = this.normalizedMin
    return Number.isFinite(this.max) && this.max > min ? this.max : min + 100
  }

  private get normalizedStep(): number {
    return Number.isFinite(this.step) && this.step > 0 ? this.step : 1
  }

  private get tickValues(): number[] {
    const values = this.ticks
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value))
      .map((value) => this.normalizeValue(value))
    return [...new Set(values)].sort((left, right) => left - right)
  }

  private formatValue(value: number): string {
    return `${this.valuePrefix}${this.formatNumber(value)}${this.valueSuffix}`
  }

  private formatNumber(value: number): string {
    return Number.isInteger(value)
      ? String(value)
      : String(Number(value.toFixed(6)))
  }

  private controlLabel(thumb: CadSliderThumb, hasLabel: boolean): string {
    if (!this.range) return hasLabel ? '' : this.label || 'Value'
    const base = this.label || 'Range'
    return `${base} ${thumb === 'start' ? 'minimum' : 'maximum'}`
  }

  private normalizeValue(value: number): number {
    const min = this.normalizedMin
    const max = this.normalizedMax
    const step = this.normalizedStep
    const clamped = Math.min(
      max,
      Math.max(min, Number.isFinite(value) ? value : min),
    )
    const stepped = min + Math.round((clamped - min) / step) * step
    const precision = Math.max(
      this.decimalPlaces(min),
      this.decimalPlaces(step),
    )
    return Number(Math.min(max, Math.max(min, stepped)).toFixed(precision))
  }

  private decimalPlaces(value: number): number {
    const [, decimals = ''] = String(value).split('.')
    return decimals.length
  }

  private normalizeExternalValues(): void {
    let value = this.normalizeValue(this.value)
    let endValue = this.normalizeValue(this.endValue)
    if (this.range && value > endValue) [value, endValue] = [endValue, value]
    if (value !== this.value) this.value = value
    if (endValue !== this.endValue) this.endValue = endValue
  }

  private percent(value: number): number {
    return (
      ((value - this.normalizedMin) /
        (this.normalizedMax - this.normalizedMin)) *
      100
    )
  }

  private setThumbValue(thumb: CadSliderThumb, nextValue: number): void {
    const value = this.normalizeValue(nextValue)
    if (thumb === 'end') {
      this.endValue = Math.max(this.value, value)
    } else {
      this.value = this.range ? Math.min(value, this.endValue) : value
    }
  }

  private handleNativeInput(event: Event, thumb: CadSliderThumb): void {
    event.stopPropagation()
    const control = event.currentTarget
    if (!(control instanceof HTMLInputElement)) return
    this.activeThumb = thumb
    this.setThumbValue(thumb, control.valueAsNumber)
    this.syncFormState()
    this.dispatchInput(thumb)
  }

  private handleNativeChange(event: Event, thumb: CadSliderThumb): void {
    event.stopPropagation()
    this.activeThumb = thumb
    this.dispatchChange(thumb)
  }

  private handleKeyDown(event: KeyboardEvent, thumb: CadSliderThumb): void {
    if (
      !event.shiftKey ||
      !['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)
    ) {
      return
    }
    event.preventDefault()
    const direction =
      event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1
    const current = thumb === 'end' ? this.endValue : this.value
    this.setThumbValue(thumb, current + this.normalizedStep * 10 * direction)
    this.syncFormState()
    this.dispatchInput(thumb)
    this.dispatchChange(thumb)
  }

  private handlePointerDown(event: PointerEvent): void {
    if (this.disabled || this.formDisabled || event.button !== 0) return
    const visual = event.currentTarget
    if (!(visual instanceof HTMLElement)) return
    this.activeThumb = this.closestThumb(event, visual)
    this.dragging = true
    this.pointerStartState = this.serializedState
    visual.setPointerCapture(event.pointerId)
    this.updateFromPointer(event, visual)
    this.controls[this.activeThumb === 'end' ? 1 : 0]?.focus()
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.dragging) return
    const visual = event.currentTarget
    if (!(visual instanceof HTMLElement)) return
    this.updateFromPointer(event, visual)
  }

  private handlePointerEnd(event: PointerEvent): void {
    if (!this.dragging) return
    const visual = event.currentTarget
    if (
      visual instanceof HTMLElement &&
      visual.hasPointerCapture(event.pointerId)
    ) {
      visual.releasePointerCapture(event.pointerId)
    }
    this.dragging = false
    this.requestUpdate()
    if (this.serializedState !== this.pointerStartState) {
      this.dispatchChange(this.activeThumb)
    }
  }

  private closestThumb(
    event: PointerEvent,
    visual: HTMLElement,
  ): CadSliderThumb {
    if (!this.range) return 'start'
    const value = this.pointerValue(event, visual)
    return Math.abs(value - this.value) <= Math.abs(value - this.endValue)
      ? 'start'
      : 'end'
  }

  private updateFromPointer(event: PointerEvent, visual: HTMLElement): void {
    const previous = this.serializedState
    this.setThumbValue(this.activeThumb, this.pointerValue(event, visual))
    if (this.serializedState === previous) return
    this.syncFormState()
    this.dispatchInput(this.activeThumb)
  }

  private pointerValue(event: PointerEvent, visual: HTMLElement): number {
    const rect = visual.getBoundingClientRect()
    const rawPercent = (event.clientX - rect.left) / rect.width
    const percent =
      getComputedStyle(this).direction === 'rtl' ? 1 - rawPercent : rawPercent
    return (
      this.normalizedMin +
      Math.min(1, Math.max(0, percent)) *
        (this.normalizedMax - this.normalizedMin)
    )
  }

  private get serializedState(): string {
    return this.range ? `${this.value},${this.endValue}` : String(this.value)
  }

  private eventDetail(activeThumb: CadSliderThumb): CadSliderChangeDetail {
    const detail: CadSliderChangeDetail = {
      activeThumb,
      value: this.value,
    }
    if (this.range) detail.endValue = this.endValue
    return detail
  }

  private dispatchInput(activeThumb: CadSliderThumb): void {
    this.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    )
    this.dispatchEvent(
      new CustomEvent('cad-slider-input', {
        bubbles: true,
        composed: true,
        detail: this.eventDetail(activeThumb),
      }),
    )
  }

  private dispatchChange(activeThumb: CadSliderThumb): void {
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      }),
    )
    this.dispatchEvent(
      new CustomEvent('cad-slider-change', {
        bubbles: true,
        composed: true,
        detail: this.eventDetail(activeThumb),
      }),
    )
  }

  private syncFormState(): void {
    const disabled = this.disabled || this.formDisabled
    if (disabled || !this.name) {
      this.internals.setFormValue(null)
    } else if (this.range) {
      const values = new FormData()
      values.append(this.name, String(this.value))
      values.append(this.name, String(this.endValue))
      this.internals.setFormValue(values, this.serializedState)
    } else {
      this.internals.setFormValue(String(this.value), this.serializedState)
    }

    const anchor = this.controls[this.activeThumb === 'end' ? 1 : 0]
    if (this.customValidityMessage) {
      this.internals.setValidity(
        { customError: true },
        this.customValidityMessage,
        anchor,
      )
    } else {
      this.internals.setValidity({})
    }
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-slider')
) {
  customElements.define('cad-slider', CadSlider)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-slider': CadSlider
  }
}
