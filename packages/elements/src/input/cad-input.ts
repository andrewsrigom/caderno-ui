import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadInputSize = 'lg' | 'md' | 'sm'
export type CadInputLayout = 'block' | 'inline'
export type CadInputTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadInputType =
  'email' | 'password' | 'search' | 'tel' | 'text' | 'url'

/**
 * A form-associated notebook input with native validation and reset behavior.
 *
 * @slot label - Visible control label. Falls back to the `label` attribute.
 * @slot prefix - Optional leading content inside the field.
 * @csspart base - Field container.
 * @csspart control - Native input.
 * @csspart field - Ruled input frame.
 * @csspart hint - Hint or error message.
 * @csspart label - Visible label.
 * @csspart prefix - Leading composition slot.
 * @fires input - Fired while the user edits the value.
 * @fires change - Fired when the user commits a value change.
 * @cssprop --cad-input-focus - Per-instance focus and label color.
 * @cssprop --cad-input-line - Per-instance ruled line color.
 */
export class CadInput extends LitElement {
  static formAssociated = true

  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    autocomplete: { type: String },
    disabled: { reflect: true, type: Boolean },
    error: { type: String },
    hint: { type: String },
    inputMode: { attribute: 'inputmode', type: String },
    invalid: { reflect: true, type: Boolean },
    label: { type: String },
    layout: { reflect: true, type: String },
    maxLength: { attribute: 'maxlength', type: Number },
    minLength: { attribute: 'minlength', type: Number },
    name: { reflect: true, type: String },
    pattern: { type: String },
    placeholder: { type: String },
    readOnly: { attribute: 'readonly', reflect: true, type: Boolean },
    required: { reflect: true, type: Boolean },
    size: { reflect: true, type: String },
    tone: { reflect: true, type: String },
    type: { reflect: true, type: String },
    value: { type: String },
  }

  static override styles = css`
    :host {
      --_input-focus: var(--cad-input-focus, var(--cad-link, #005bac));
      --_input-line: var(
        --cad-input-line,
        var(
          --cad-border-ink,
          color-mix(in srgb, var(--_input-focus) 72%, transparent)
        )
      );
      display: block;
      color: var(--cad-ink, #25202a);
      max-width: 100%;
    }

    :host([tone='coral']),
    :host([invalid]) {
      --_input-focus: var(--cad-input-focus, var(--cad-danger-ink, #d52f3f));
      --_input-line: var(--cad-input-line, var(--cad-danger-ink, #d52f3f));
    }

    :host([tone='lemon']) {
      --_input-focus: var(
        --cad-input-focus,
        var(--cad-post-it-lemon-ink, #51491f)
      );
    }

    :host([tone='mint']) {
      --_input-focus: var(
        --cad-input-focus,
        var(--cad-post-it-mint-ink, #274f41)
      );
    }

    :host([tone='pink']) {
      --_input-focus: var(
        --cad-input-focus,
        var(--cad-post-it-pink-ink, #52233a)
      );
    }

    :host([tone='violet']) {
      --_input-focus: var(
        --cad-input-focus,
        var(--cad-sticker-violet-ink, #30205e)
      );
    }

    .base {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.4rem;
      align-items: center;
    }

    :host([layout='inline']) .base {
      grid-template-columns: minmax(4.75rem, auto) minmax(0, 1fr);
      column-gap: 1rem;
    }

    .label {
      color: var(--_input-focus);
      font-family: var(--cad-type-label-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, var(--cad-hand-sm, 1.05rem));
      font-weight: var(--cad-hand-weight-regular, 500);
      letter-spacing: 0;
    }

    .required {
      margin-inline-start: 0.15rem;
      color: var(--cad-post-it-coral-ink, #633b32);
    }

    .field {
      position: relative;
      display: flex;
      gap: 0.55rem;
      align-items: center;
      min-height: 2.55rem;
      padding: 0.42rem 0.72rem 0.48rem;
      background: var(--cad-surface, #fff);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_input-line);
      border-radius: 0;
      box-shadow: 0.3px 0.5px 0
        color-mix(in srgb, var(--_input-line) 26%, transparent);
      transform: rotate(-0.08deg);
      transition: border-color var(--cad-duration-fast, 140ms) ease;
    }

    .field:focus-within {
      border-color: var(--_input-focus);
      box-shadow: 0.4px 0.6px 0
        color-mix(in srgb, var(--_input-focus) 28%, transparent);
    }

    .field::after {
      position: absolute;
      top: 50%;
      right: -1.55rem;
      width: 1rem;
      height: 1.5rem;
      background:
        linear-gradient(
            18deg,
            transparent 45%,
            var(--_input-focus) 47% 54%,
            transparent 56%
          )
          0 0 / 0.72rem 0.42rem no-repeat,
        linear-gradient(
            90deg,
            transparent 44%,
            var(--_input-focus) 46% 54%,
            transparent 56%
          )
          0 50% / 0.82rem 0.42rem no-repeat,
        linear-gradient(
            162deg,
            transparent 45%,
            var(--_input-focus) 47% 54%,
            transparent 56%
          )
          0 100% / 0.72rem 0.42rem no-repeat;
      content: '';
      opacity: 0;
      pointer-events: none;
      transform: translateY(-50%);
    }

    .field:focus-within::after {
      opacity: 1;
    }

    .control {
      flex: 1 1 auto;
      min-width: 0;
      padding: 0;
      margin: 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      font-family: var(--cad-type-control-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, var(--cad-hand-sm, 1.05rem));
      line-height: 1.35;
    }

    :host([size='sm']) .control {
      font-size: var(--cad-hand-sm, 1.05rem);
    }

    :host([size='lg']) .control {
      font-size: var(--cad-hand-lg, 1.55rem);
    }

    .control::placeholder {
      color: color-mix(
        in srgb,
        var(--cad-ink-muted, currentColor) 78%,
        transparent
      );
      font-style: normal;
    }

    .control:focus {
      outline: none;
    }

    .control:focus-visible {
      outline: none;
    }

    .control:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .hint {
      margin: 0;
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-type-meta-font, var(--cad-font-book, serif));
      font-size: var(--cad-type-meta-size, 0.82rem);
      line-height: var(--cad-type-meta-line-height, 1.45);
    }

    :host([layout='inline']) .hint {
      grid-column: 2;
    }

    :host([tone='coral']) .hint,
    :host([invalid]) .hint {
      color: var(--cad-danger-ink, #bd1f32);
    }

    :host([tone='coral']) .label,
    :host([invalid]) .label {
      color: var(--cad-danger-ink, #bd1f32);
    }

    .status {
      position: relative;
      flex: 0 0 1rem;
      width: 1rem;
      height: 1rem;
      color: var(--cad-danger-ink, #d52f3f);
    }

    .status::before,
    .status::after {
      position: absolute;
      top: 50%;
      left: 0;
      width: 1rem;
      height: 1.5px;
      background: currentColor;
      content: '';
    }

    .status::before {
      transform: rotate(47deg);
    }

    .status::after {
      transform: rotate(-44deg);
    }

    @media (max-width: 34rem) {
      :host([layout='inline']) .base {
        grid-template-columns: minmax(0, 1fr);
      }

      :host([layout='inline']) .hint {
        grid-column: 1;
      }

      .field::after {
        right: -1.1rem;
        transform: translateY(-50%) scale(0.75);
      }
    }

    @media (forced-colors: active) {
      .field {
        border-bottom: 1px solid CanvasText;
        background: none;
      }

      .label,
      .hint,
      .status {
        color: CanvasText;
      }
    }
  `

  declare autocomplete: string
  declare disabled: boolean
  declare error: string
  declare hint: string
  declare inputMode: string
  declare invalid: boolean
  declare label: string
  declare layout: CadInputLayout
  declare maxLength: number
  declare minLength: number
  declare name: string
  declare pattern: string
  declare placeholder: string
  declare readOnly: boolean
  declare required: boolean
  declare size: CadInputSize
  declare tone: CadInputTone
  declare type: CadInputType
  declare value: string

  private readonly internals: ElementInternals
  private customValidityMessage = ''
  private defaultValue = ''
  private formDisabled = false

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.autocomplete = ''
    this.disabled = false
    this.error = ''
    this.hint = ''
    this.inputMode = ''
    this.invalid = false
    this.label = ''
    this.layout = 'block'
    this.maxLength = -1
    this.minLength = -1
    this.name = ''
    this.pattern = ''
    this.placeholder = ''
    this.readOnly = false
    this.required = false
    this.size = 'md'
    this.tone = 'blue'
    this.type = 'text'
    this.value = ''
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
    if (!this.hasUpdated) this.defaultValue = this.getAttribute('value') ?? ''
  }

  override focus(options?: FocusOptions): void {
    this.control?.focus(options)
  }

  select(): void {
    this.control?.select()
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
  }

  formStateRestoreCallback(state: File | FormData | string | null): void {
    if (typeof state === 'string') this.value = state
  }

  protected override firstUpdated(): void {
    this.syncFormState()
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (
      changed.has('disabled') ||
      changed.has('error') ||
      changed.has('invalid') ||
      changed.has('required') ||
      changed.has('value')
    ) {
      this.syncFormState()
    }
  }

  override render() {
    const message = this.invalid && this.error ? this.error : this.hint
    const disabled = this.disabled || this.formDisabled

    return html`
      <div class="base" part="base">
        <label class="label" for="control" part="label">
          <slot name="label">${this.label}</slot>
          ${
            this.required
              ? html`<span aria-hidden="true" class="required">*</span>`
              : nothing
          }
        </label>
        <div class="field" part="field">
          <slot name="prefix" part="prefix"></slot>
          <input
            aria-describedby=${message ? 'message' : nothing}
            aria-invalid=${this.invalid ? 'true' : nothing}
            autocomplete=${this.autocomplete || nothing}
            class="control"
            ?disabled=${disabled}
            id="control"
            inputmode=${this.inputMode || nothing}
            maxlength=${this.maxLength >= 0 ? this.maxLength : nothing}
            minlength=${this.minLength >= 0 ? this.minLength : nothing}
            part="control"
            pattern=${this.pattern || nothing}
            placeholder=${this.placeholder}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            type=${this.type}
            .value=${this.value}
            @change=${this.handleChange}
            @input=${this.handleInput}
          />
          ${this.invalid ? html`<span aria-hidden="true" class="status"></span>` : nothing}
        </div>
        ${
          message
            ? html`<p class="hint" id="message" part="hint">${message}</p>`
            : nothing
        }
      </div>
    `
  }

  private handleChange(event: Event): void {
    event.stopPropagation()
    this.syncValue(event.currentTarget)
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  private handleInput(event: Event): void {
    event.stopPropagation()
    this.syncValue(event.currentTarget)
    this.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  private syncValue(target: EventTarget | null): void {
    if (!(target instanceof HTMLInputElement)) return
    this.value = target.value
    this.syncFormState()
  }

  private syncFormState(): void {
    const control = this.control
    const disabled = this.disabled || this.formDisabled
    this.internals.setFormValue(disabled ? null : this.value, this.value)
    if (!control || disabled) {
      this.internals.setValidity({})
      return
    }

    const message =
      this.customValidityMessage ||
      (this.invalid ? this.error || 'Invalid value.' : '')
    control.setCustomValidity(message)
    this.internals.setValidity(
      control.validity,
      control.validationMessage,
      control,
    )
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-input')) {
  customElements.define('cad-input', CadInput)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-input': CadInput
  }
}
