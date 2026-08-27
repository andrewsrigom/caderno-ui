import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadSwitchSize = 'lg' | 'md' | 'sm'

let switchId = 0

/**
 * A form-associated switch for an immediate binary setting.
 *
 * @slot label - Visible setting label. Falls back to the `label` attribute.
 * @slot hint - Supporting consequence or context. Falls back to `hint`.
 * @csspart base - Native label and full hit target.
 * @csspart control - Native checkbox exposed with switch semantics.
 * @csspart hint - Supporting description.
 * @csspart label - Visible setting label.
 * @csspart thumb - Movable switch thumb.
 * @csspart track - Hand-drawn switch track.
 * @fires input - Fired immediately when the checked state changes.
 * @fires change - Fired after the checked state changes.
 * @cssprop --cad-switch-accent - Checked track and focus color.
 * @cssprop --cad-switch-surface - Unchecked track surface.
 */
export class CadSwitch extends LitElement {
  static formAssociated = true

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    checked: { reflect: true, type: Boolean },
    disabled: { reflect: true, type: Boolean },
    hint: { type: String },
    label: { type: String },
    name: { reflect: true, type: String },
    required: { reflect: true, type: Boolean },
    size: { reflect: true, type: String },
    value: { type: String },
  }

  static override styles = css`
    :host {
      --_switch-accent: var(--cad-switch-accent, var(--cad-link, #005bac));
      --_switch-surface: var(
        --cad-switch-surface,
        var(--cad-surface-raised, #fff)
      );
      --_track-height: 1.38rem;
      --_track-width: 2.5rem;
      --_thumb-size: 1.18rem;
      --_travel: calc(var(--_track-width) - var(--_track-height));
      display: inline-block;
      width: 100%;
      max-width: 24rem;
      color: var(--cad-ink, #162033);
    }

    :host([size='sm']) {
      --_track-height: 1.05rem;
      --_track-width: 1.8rem;
      --_thumb-size: 0.88rem;
    }

    :host([size='lg']) {
      --_track-height: 1.75rem;
      --_track-width: 3.25rem;
      --_thumb-size: 1.52rem;
    }

    .base {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      box-sizing: border-box;
      min-height: 2.75rem;
      max-width: 100%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .base.control-only {
      display: inline-grid;
      grid-template-columns: auto;
    }

    :host([disabled]) .base {
      cursor: not-allowed;
      opacity: 0.52;
    }

    .body {
      display: grid;
      gap: 0.12rem;
      min-width: 0;
    }

    .label {
      color: var(--cad-link, #005bac);
      font-family: var(--cad-type-label-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.25;
    }

    .hint {
      color: var(--cad-ink-muted, #68738c);
      font-family: var(--cad-type-meta-font, var(--cad-font-book, serif));
      font-size: var(--cad-type-meta-size, 0.82rem);
      line-height: var(--cad-type-meta-line-height, 1.45);
    }

    .control {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .track {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      width: var(--_track-width);
      height: var(--_track-height);
      overflow: visible;
      color: var(--cad-ink, #162033);
      background: color-mix(in srgb, var(--_switch-surface) 96%, currentColor);
      border: 1.5px solid currentColor;
      border-radius: 48% 52% 49% 51% / 53% 48% 52% 47%;
      box-shadow: inset 0 -0.08rem 0
        color-mix(in srgb, currentColor 12%, transparent);
      transition:
        background-color
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease),
        border-color
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease);
      transform: rotate(-1deg);
    }

    .track::before {
      position: absolute;
      inset: 1px;
      background: repeating-linear-gradient(
        164deg,
        transparent 0 0.16rem,
        rgb(255 255 255 / 22%) 0.16rem 0.22rem
      );
      border-radius: inherit;
      content: '';
      opacity: 0;
      pointer-events: none;
    }

    .thumb {
      position: absolute;
      z-index: 1;
      top: 50%;
      inset-inline-start: calc((var(--_track-height) - var(--_thumb-size)) / 2);
      box-sizing: border-box;
      width: var(--_thumb-size);
      height: var(--_thumb-size);
      background: var(--cad-surface-raised, #fff);
      border: 1.5px solid currentColor;
      border-radius: 52% 48% 54% 46%;
      box-shadow: 0.06rem 0.07rem 0
        color-mix(in srgb, currentColor 14%, transparent);
      transition:
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        width
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease);
      transform: translate(0, -50%) rotate(-2deg);
    }

    .control:checked + .track {
      color: var(--_switch-accent);
      background-color: color-mix(
        in srgb,
        var(--_switch-accent) 88%,
        var(--_switch-surface)
      );
      border-color: currentColor;
      box-shadow:
        inset 0 -0.1rem 0 color-mix(in srgb, #000 12%, transparent),
        inset 0 0.08rem 0 rgb(255 255 255 / 18%);
    }

    .control:checked + .track::before {
      opacity: 1;
    }

    .control:checked + .track .thumb {
      transform: translate(var(--_travel), -50%) rotate(1.5deg);
    }

    :host(:dir(rtl)) .control:checked + .track .thumb {
      transform: translate(calc(var(--_travel) * -1), -50%) rotate(1.5deg);
    }

    .base:hover .track {
      transform: rotate(-1deg) translateY(-1px);
    }

    .control:active + .track .thumb {
      width: calc(var(--_thumb-size) + 0.12rem);
    }

    .control:focus-visible + .track {
      outline: var(
        --cad-focus-outline,
        2px dashed var(--cad-focus-ring, var(--cad-link, #005bac))
      );
      outline-offset: 3px;
      box-shadow:
        0 0 0 1px var(--cad-surface-raised, #fff),
        0 0 0 4px
          color-mix(
            in srgb,
            var(--cad-focus-ring, var(--cad-link, #005bac)) 20%,
            transparent
          );
    }

    :host([disabled]) .base:hover .track {
      transform: rotate(-1deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .thumb,
      .track {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .track,
      .thumb {
        background: Canvas;
        border-color: CanvasText;
        forced-color-adjust: none;
      }

      .control:checked + .track {
        color: Highlight;
        background: Highlight;
      }

      .control:checked + .track .thumb {
        background: HighlightText;
        border-color: HighlightText;
      }
    }
  `

  declare checked: boolean
  declare disabled: boolean
  declare hint: string
  declare label: string
  declare name: string
  declare required: boolean
  declare size: CadSwitchSize
  declare value: string

  private readonly internals: ElementInternals
  private readonly controlId: string
  private readonly hintId: string
  private readonly labelId: string
  private customValidityMessage = ''
  private defaultChecked = false
  private formDisabled = false

  constructor() {
    super()
    const id = ++switchId
    this.internals = this.attachInternals()
    this.controlId = `cad-switch-control-${id}`
    this.hintId = `cad-switch-hint-${id}`
    this.labelId = `cad-switch-label-${id}`
    this.checked = false
    this.disabled = false
    this.hint = ''
    this.label = ''
    this.name = ''
    this.required = false
    this.size = 'md'
    this.value = 'on'
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

  private get control(): HTMLInputElement | null {
    return this.renderRoot.querySelector('input')
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasUpdated) this.defaultChecked = this.hasAttribute('checked')
  }

  override click(): void {
    this.control?.click()
  }

  override focus(options?: FocusOptions): void {
    this.control?.focus(options)
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
    this.checked = this.defaultChecked
  }

  formStateRestoreCallback(state: File | FormData | string | null): void {
    this.checked = state === 'checked'
  }

  protected override firstUpdated(): void {
    this.syncFormState()
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (
      changed.has('checked') ||
      changed.has('disabled') ||
      changed.has('required') ||
      changed.has('value')
    ) {
      this.syncFormState()
    }
  }

  override render() {
    const disabled = this.disabled || this.formDisabled
    const hasHint = Boolean(this.hint || this.querySelector('[slot="hint"]'))
    const hasLabel = Boolean(this.label || this.querySelector('[slot="label"]'))

    return html`
      <label
        class=${hasHint || hasLabel ? 'base' : 'base control-only'}
        for=${this.controlId}
        part="base"
      >
        ${
          hasHint || hasLabel
            ? html`<span class="body">
                <span class="label" id=${this.labelId} part="label">
                  <slot name="label">${this.label}</slot>
                  ${
                    this.required
                      ? html`<span aria-hidden="true"> *</span>`
                      : nothing
                  }
                </span>
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
        <input
          aria-checked=${this.checked ? 'true' : 'false'}
          aria-describedby=${hasHint ? this.hintId : nothing}
          aria-labelledby=${hasLabel ? this.labelId : nothing}
          class="control"
          .checked=${this.checked}
          ?disabled=${disabled}
          id=${this.controlId}
          part="control"
          ?required=${this.required}
          role="switch"
          type="checkbox"
          @change=${this.handleChange}
          @input=${this.handleInput}
        />
        <span aria-hidden="true" class="track" part="track">
          <span class="thumb" part="thumb"></span>
        </span>
      </label>
    `
  }

  private handleChange(event: Event): void {
    event.stopPropagation()
    const control = event.currentTarget
    if (!(control instanceof HTMLInputElement)) return
    this.checked = control.checked
    this.syncFormState()
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  private handleInput(event: Event): void {
    event.stopPropagation()
    const control = event.currentTarget
    if (!(control instanceof HTMLInputElement)) return
    this.checked = control.checked
    this.syncFormState()
    this.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  private syncFormState(): void {
    const control = this.control
    const disabled = this.disabled || this.formDisabled
    this.internals.setFormValue(
      disabled || !this.checked ? null : this.value,
      this.checked ? 'checked' : 'unchecked',
    )
    if (!control || disabled) {
      this.internals.setValidity({})
      return
    }

    control.setCustomValidity(this.customValidityMessage)
    this.internals.setValidity(
      control.validity,
      control.validationMessage,
      control,
    )
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-switch')
) {
  customElements.define('cad-switch', CadSwitch)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-switch': CadSwitch
  }
}
