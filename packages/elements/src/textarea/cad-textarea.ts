import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadTextareaResize = 'both' | 'horizontal' | 'none' | 'vertical'
export type CadTextareaLayout = 'block' | 'inline'
export type CadTextareaTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * A form-associated ruled textarea with native validation and reset behavior.
 *
 * @slot label - Visible control label. Falls back to the `label` attribute.
 * @csspart base - Field container.
 * @csspart control - Native textarea.
 * @csspart field - Hand-drawn textarea frame.
 * @csspart hint - Hint or error message.
 * @csspart label - Visible label.
 * @fires input - Fired while the user edits the value.
 * @fires change - Fired when the user commits a value change.
 * @cssprop --cad-textarea-focus - Per-instance focus and label color.
 * @cssprop --cad-textarea-line - Per-instance ruled line color.
 */
export class CadTextarea extends LitElement {
  static formAssociated = true

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    autocomplete: { type: String },
    cols: { type: Number },
    disabled: { reflect: true, type: Boolean },
    error: { type: String },
    hint: { type: String },
    invalid: { reflect: true, type: Boolean },
    label: { type: String },
    layout: { reflect: true, type: String },
    maxLength: { attribute: 'maxlength', type: Number },
    minLength: { attribute: 'minlength', type: Number },
    name: { reflect: true, type: String },
    placeholder: { type: String },
    readOnly: { attribute: 'readonly', reflect: true, type: Boolean },
    required: { reflect: true, type: Boolean },
    resize: { reflect: true, type: String },
    rows: { type: Number },
    tone: { reflect: true, type: String },
    value: { type: String },
    wrap: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_textarea-focus: var(--cad-textarea-focus, var(--cad-link, #005bac));
      --_textarea-line: var(
        --cad-textarea-line,
        var(
          --cad-border-ink,
          color-mix(in srgb, var(--_textarea-focus) 72%, transparent)
        )
      );
      display: block;
      color: var(--cad-ink, #25202a);
      max-width: 100%;
    }

    :host([tone='coral']),
    :host([invalid]) {
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-danger-ink, #d52f3f)
      );
      --_textarea-line: var(
        --cad-textarea-line,
        var(--cad-danger-ink, #d52f3f)
      );
    }

    :host([tone='lemon']) {
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-post-it-lemon-ink, #51491f)
      );
    }

    :host([tone='mint']) {
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-post-it-mint-ink, #274f41)
      );
    }

    :host([tone='pink']) {
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-post-it-pink-ink, #52233a)
      );
    }

    :host([tone='violet']) {
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-sticker-violet-ink, #30205e)
      );
    }

    .base {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.4rem;
      align-items: start;
    }

    :host([layout='inline']) .base {
      grid-template-columns: minmax(4.75rem, auto) minmax(0, 1fr);
      column-gap: 1rem;
    }

    .label {
      color: var(--_textarea-focus);
      font-family: var(--cad-type-label-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, var(--cad-hand-sm, 1.05rem));
      font-weight: var(--cad-hand-weight-regular, 500);
      letter-spacing: 0;
      padding-top: 0.35rem;
    }

    .required {
      margin-inline-start: 0.15rem;
      color: var(--cad-post-it-coral-ink, #633b32);
    }

    .field {
      position: relative;
      min-width: 0;
    }

    .field::after {
      position: absolute;
      top: 0.25rem;
      right: -1.55rem;
      width: 1rem;
      height: 1.5rem;
      background:
        linear-gradient(
            18deg,
            transparent 45%,
            var(--_textarea-focus) 47% 54%,
            transparent 56%
          )
          0 0 / 0.72rem 0.42rem no-repeat,
        linear-gradient(
            90deg,
            transparent 44%,
            var(--_textarea-focus) 46% 54%,
            transparent 56%
          )
          0 50% / 0.82rem 0.42rem no-repeat,
        linear-gradient(
            162deg,
            transparent 45%,
            var(--_textarea-focus) 47% 54%,
            transparent 56%
          )
          0 100% / 0.72rem 0.42rem no-repeat;
      content: '';
      opacity: 0;
      pointer-events: none;
    }

    .field:focus-within::after {
      opacity: 1;
    }

    .control {
      display: block;
      box-sizing: border-box;
      width: 100%;
      min-height: 5.25rem;
      padding: 0.52rem 0.75rem 0.62rem;
      color: inherit;
      background: var(--cad-surface, #fff);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_textarea-line);
      border-radius: 0;
      box-shadow: 0.3px 0.5px 0
        color-mix(in srgb, var(--_textarea-line) 26%, transparent);
      font-family: var(--cad-type-control-font, var(--cad-font-hand, cursive));
      font-size: var(--cad-type-label-size, var(--cad-hand-sm, 1.05rem));
      line-height: 1.4;
      resize: vertical;
      transform: rotate(-0.06deg);
    }

    :host([resize='both']) .control {
      resize: both;
    }

    :host([resize='horizontal']) .control {
      resize: horizontal;
    }

    :host([resize='none']) .control {
      resize: none;
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
      border-color: var(--_textarea-focus);
      box-shadow: 0.4px 0.6px 0
        color-mix(in srgb, var(--_textarea-focus) 28%, transparent);
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
      color: var(--cad-danger-ink, #d52f3f);
    }

    :host([tone='coral']) .label,
    :host([invalid]) .label {
      color: var(--cad-danger-ink, #d52f3f);
    }

    .status {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 1rem;
      height: 1rem;
      color: var(--cad-danger-ink, #d52f3f);
      pointer-events: none;
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

    :host([invalid]) .control {
      padding-inline-end: 2.35rem;
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
        transform: scale(0.75);
      }
    }

    @media (forced-colors: active) {
      .control {
        background: Canvas;
        border-color: CanvasText;
      }
    }
  `

  declare autocomplete: string
  declare cols: number
  declare disabled: boolean
  declare error: string
  declare hint: string
  declare invalid: boolean
  declare label: string
  declare layout: CadTextareaLayout
  declare maxLength: number
  declare minLength: number
  declare name: string
  declare placeholder: string
  declare readOnly: boolean
  declare required: boolean
  declare resize: CadTextareaResize
  declare rows: number
  declare tone: CadTextareaTone
  declare value: string
  declare wrap: 'hard' | 'soft'

  private readonly internals: ElementInternals
  private customValidityMessage = ''
  private defaultValue = ''
  private formDisabled = false

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.autocomplete = ''
    this.cols = 20
    this.disabled = false
    this.error = ''
    this.hint = ''
    this.invalid = false
    this.label = ''
    this.layout = 'block'
    this.maxLength = -1
    this.minLength = -1
    this.name = ''
    this.placeholder = ''
    this.readOnly = false
    this.required = false
    this.resize = 'vertical'
    this.rows = 4
    this.tone = 'blue'
    this.value = ''
    this.wrap = 'soft'
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

  private get control(): HTMLTextAreaElement | null {
    return this.renderRoot.querySelector('textarea')
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
    this.defaultValue = this.value
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
          <textarea
            aria-describedby=${message ? 'message' : nothing}
            aria-invalid=${this.invalid ? 'true' : nothing}
            autocomplete=${this.autocomplete || nothing}
            class="control"
            cols=${this.cols}
            ?disabled=${disabled}
            id="control"
            maxlength=${this.maxLength >= 0 ? this.maxLength : nothing}
            minlength=${this.minLength >= 0 ? this.minLength : nothing}
            part="control"
            placeholder=${this.placeholder}
            ?readonly=${this.readOnly}
            ?required=${this.required}
            rows=${this.rows}
            wrap=${this.wrap}
            .value=${this.value}
            @change=${this.handleChange}
            @input=${this.handleInput}
          ></textarea>
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
    if (!(target instanceof HTMLTextAreaElement)) return
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

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-textarea')
) {
  customElements.define('cad-textarea', CadTextarea)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-textarea': CadTextarea
  }
}
