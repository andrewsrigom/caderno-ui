import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadTextareaResize = 'both' | 'horizontal' | 'none' | 'vertical'
export type CadTextareaTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * A form-associated ruled textarea with native validation and reset behavior.
 *
 * @slot label - Visible control label. Falls back to the `label` attribute.
 * @csspart base - Field container.
 * @csspart control - Native textarea.
 * @csspart hint - Hint or error message.
 * @csspart label - Visible label.
 * @fires input - Fired while the user edits the value.
 * @fires change - Fired when the user commits a value change.
 * @cssprop --cad-textarea-focus - Per-instance focus and label color.
 * @cssprop --cad-textarea-line - Per-instance ruled line color.
 */
export class CadTextarea extends LitElement {
  static formAssociated = true

  static override shadowRootOptions = {
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
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-post-it-blue-ink, #18345d)
      );
      --_textarea-line: var(
        --cad-textarea-line,
        color-mix(in srgb, var(--_textarea-focus) 32%, transparent)
      );
      display: block;
      color: var(--cad-ink, #25202a);
    }

    :host([tone='coral']),
    :host([invalid]) {
      --_textarea-focus: var(
        --cad-textarea-focus,
        var(--cad-post-it-coral-ink, #633b32)
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
      gap: 0.35rem;
    }

    .label {
      color: var(--_textarea-focus);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      letter-spacing: 0.02em;
    }

    .required {
      margin-inline-start: 0.15rem;
      color: var(--cad-post-it-coral-ink, #633b32);
    }

    .control {
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: 0.4rem 0.75rem 0.55rem;
      color: inherit;
      background-color: transparent;
      background-image: repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent calc(var(--cad-hand-lg, 1.55rem) - 1px),
        var(--_textarea-line) calc(var(--cad-hand-lg, 1.55rem) - 1px),
        var(--_textarea-line) var(--cad-hand-lg, 1.55rem)
      );
      background-attachment: local;
      background-position: 0 0.15rem;
      border: 1.5px dashed
        color-mix(in srgb, var(--_textarea-focus) 30%, transparent);
      border-radius: 0.5rem 0.65rem 0.5rem 0.6rem;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      line-height: var(--cad-hand-lg, 1.55rem);
      resize: vertical;
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
      font-style: italic;
    }

    .control:focus {
      border-color: var(--_textarea-focus);
      border-style: solid;
      outline: none;
    }

    .control:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, var(--_textarea-focus));
      outline-offset: 3px;
    }

    .control:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .hint {
      margin: 0;
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      line-height: 1.3;
    }

    :host([invalid]) .hint {
      color: var(--cad-post-it-coral-ink, #633b32);
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
