import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadCheckboxTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * A form-associated notebook checkbox with native validation semantics.
 *
 * @slot label - Visible control label. Falls back to the `label` attribute.
 * @slot hint - Supporting text. Falls back to the `hint` attribute.
 * @csspart base - Native label wrapping the control.
 * @csspart box - Hand-drawn checkbox frame.
 * @csspart control - Native checkbox input.
 * @csspart hint - Supporting text.
 * @csspart label - Visible label.
 * @csspart mark - Check mark.
 * @fires input - Fired when the user toggles the checked state.
 * @fires change - Fired after the checked state changes.
 * @cssprop --cad-checkbox-bg - Per-instance selected background.
 * @cssprop --cad-checkbox-ink - Per-instance control color.
 */
export class CadCheckbox extends LitElement {
  static formAssociated = true

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  }

  static override properties = {
    checked: { reflect: true, type: Boolean },
    disabled: { reflect: true, type: Boolean },
    hint: { type: String },
    indeterminate: { type: Boolean },
    label: { type: String },
    name: { reflect: true, type: String },
    required: { reflect: true, type: Boolean },
    tone: { reflect: true, type: String },
    value: { type: String },
  }

  static override styles = css`
    :host {
      --_check-bg: var(--cad-checkbox-bg, var(--cad-post-it-blue-bg, #cfe2ff));
      --_check-ink: var(--cad-checkbox-ink, var(--cad-link, #005bac));
      display: inline-block;
      max-width: 100%;
      color: var(--_check-ink);
    }

    :host([tone='coral']) {
      --_check-bg: var(--cad-checkbox-bg, var(--cad-post-it-coral-bg, #ffd8ce));
      --_check-ink: var(
        --cad-checkbox-ink,
        var(--cad-post-it-coral-ink, #633b32)
      );
    }

    :host([tone='lemon']) {
      --_check-bg: var(--cad-checkbox-bg, var(--cad-post-it-lemon-bg, #fff1ac));
      --_check-ink: var(
        --cad-checkbox-ink,
        var(--cad-post-it-lemon-ink, #51491f)
      );
    }

    :host([tone='mint']) {
      --_check-bg: var(--cad-checkbox-bg, var(--cad-post-it-mint-bg, #d8ffec));
      --_check-ink: var(
        --cad-checkbox-ink,
        var(--cad-post-it-mint-ink, #274f41)
      );
    }

    :host([tone='pink']) {
      --_check-bg: var(--cad-checkbox-bg, var(--cad-post-it-pink-bg, #ffb7d5));
      --_check-ink: var(
        --cad-checkbox-ink,
        var(--cad-post-it-pink-ink, #52233a)
      );
    }

    :host([tone='violet']) {
      --_check-bg: var(
        --cad-checkbox-bg,
        var(--cad-sticker-violet-bg, #bba0ff)
      );
      --_check-ink: var(
        --cad-checkbox-ink,
        var(--cad-sticker-violet-ink, #30205e)
      );
    }

    .base {
      display: inline-grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 1rem;
      align-items: start;
      max-width: 100%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) .base {
      cursor: not-allowed;
      opacity: 0.55;
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

    .box {
      position: relative;
      display: inline-grid;
      place-items: center;
      box-sizing: border-box;
      width: 1.5rem;
      height: 1.5rem;
      margin-top: 0.1rem;
      color: var(--_check-ink);
      background: transparent;
      border: 1.5px solid color-mix(in srgb, var(--_check-ink) 88%, transparent);
      border-radius: 0;
      transition:
        background-color
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
      transform: rotate(-2deg);
    }

    .mark {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      opacity: 0;
      transition:
        opacity
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease);
      transform: scale(0.6) rotate(-6deg);
    }

    .mark::before {
      display: block;
      width: 0.52rem;
      height: 1.15rem;
      border-block-end: 2px solid currentColor;
      border-inline-end: 2px solid currentColor;
      content: '';
      transform: translate(0.28rem, -0.48rem) rotate(40deg);
    }

    .control:checked + .box,
    .control:indeterminate + .box {
      background: color-mix(in srgb, var(--_check-bg) 32%, transparent);
      border-color: var(--_check-ink);
    }

    .control:checked + .box .mark,
    .control:indeterminate + .box .mark {
      opacity: 1;
      transform: scale(1) rotate(-6deg);
    }

    .control:indeterminate + .box .mark::before {
      width: 0.85rem;
      height: 0;
      border-block-end: 2px solid currentColor;
      border-inline-end: 0;
      transform: rotate(-2deg) translateY(0);
    }

    .control:focus-visible + .box {
      outline: 2px dashed var(--cad-focus-ring, var(--_check-ink));
      outline-offset: 3px;
    }

    .base:hover .box {
      transform: rotate(-2deg) translateY(-1px);
    }

    :host([disabled]) .base:hover .box {
      transform: rotate(-2deg);
    }

    .body {
      display: inline-grid;
      gap: 0.15rem;
      min-width: 0;
      padding-top: 0.1rem;
    }

    .label {
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.25rem);
      line-height: 1.25;
    }

    .hint {
      color: var(--cad-ink-muted, #6f6a64);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      line-height: 1.3;
    }

    @media (prefers-reduced-motion: reduce) {
      .box,
      .mark {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .box {
        border-color: CanvasText;
      }
    }
  `

  declare checked: boolean
  declare disabled: boolean
  declare hint: string
  declare indeterminate: boolean
  declare label: string
  declare name: string
  declare required: boolean
  declare tone: CadCheckboxTone
  declare value: string

  private readonly internals: ElementInternals
  private customValidityMessage = ''
  private defaultChecked = false
  private formDisabled = false

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.checked = false
    this.disabled = false
    this.hint = ''
    this.indeterminate = false
    this.label = ''
    this.name = ''
    this.required = false
    this.tone = 'blue'
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
    this.indeterminate = false
  }

  formStateRestoreCallback(state: File | FormData | string | null): void {
    this.checked = state === 'checked'
  }

  protected override firstUpdated(): void {
    this.defaultChecked = this.checked
    this.syncFormState()
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (
      changed.has('checked') ||
      changed.has('disabled') ||
      changed.has('indeterminate') ||
      changed.has('required') ||
      changed.has('value')
    ) {
      this.syncFormState()
    }
  }

  override render() {
    const disabled = this.disabled || this.formDisabled

    return html`
      <label class="base" part="base">
        <input
          class="control"
          .checked=${this.checked}
          ?disabled=${disabled}
          .indeterminate=${this.indeterminate}
          part="control"
          ?required=${this.required}
          type="checkbox"
          @change=${this.handleChange}
          @input=${this.handleInput}
        />
        <span aria-hidden="true" class="box" part="box">
          <span class="mark" part="mark"></span>
        </span>
        <span class="body">
          <span class="label" part="label">
            <slot name="label">${this.label}</slot>
            ${
              this.required ? html`<span aria-hidden="true"> *</span>` : nothing
            }
          </span>
          ${
            this.hint || this.querySelector('[slot="hint"]')
              ? html`<span class="hint" part="hint">
                  <slot name="hint">${this.hint}</slot>
                </span>`
              : nothing
          }
        </span>
      </label>
    `
  }

  private handleChange(event: Event): void {
    event.stopPropagation()
    const control = event.currentTarget
    if (!(control instanceof HTMLInputElement)) return
    this.checked = control.checked
    this.indeterminate = control.indeterminate
    this.syncFormState()
    // A checkbox edit is also its commit. Deliver both notifications together,
    // before a controlled consumer can render between the native events.
    this.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    )
    this.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      }),
    )
  }

  private handleInput(event: Event): void {
    event.stopPropagation()
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
  !customElements.get('cad-checkbox')
) {
  customElements.define('cad-checkbox', CadCheckbox)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-checkbox': CadCheckbox
  }
}
