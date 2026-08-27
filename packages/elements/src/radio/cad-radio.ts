import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadRadioTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * A form-associated notebook radio with cross-shadow grouping and arrow keys.
 *
 * @slot label - Visible control label. Falls back to the `label` attribute.
 * @slot hint - Supporting text. Falls back to the `hint` attribute.
 * @csspart base - Native label wrapping the control.
 * @csspart control - Native radio input.
 * @csspart dot - Selected indicator.
 * @csspart hint - Supporting text.
 * @csspart label - Visible label.
 * @csspart ring - Hand-drawn radio frame.
 * @fires input - Fired when the user selects the radio.
 * @fires change - Fired after the selected state changes.
 * @cssprop --cad-radio-bg - Per-instance selected background.
 * @cssprop --cad-radio-ink - Per-instance control color.
 */
export class CadRadio extends LitElement {
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
    tone: { reflect: true, type: String },
    value: { type: String },
  }

  static override styles = css`
    :host {
      --_radio-bg: var(--cad-radio-bg, var(--cad-post-it-blue-bg, #cfe2ff));
      --_radio-ink: var(--cad-radio-ink, var(--cad-link, #005bac));
      display: inline-block;
      max-width: 100%;
      color: var(--cad-ink, #25202a);
    }

    :host([tone='coral']) {
      --_radio-bg: var(--cad-radio-bg, var(--cad-post-it-coral-bg, #ffd8ce));
      --_radio-ink: var(--cad-radio-ink, var(--cad-post-it-coral-ink, #633b32));
    }

    :host([tone='lemon']) {
      --_radio-bg: var(--cad-radio-bg, var(--cad-post-it-lemon-bg, #fff1ac));
      --_radio-ink: var(--cad-radio-ink, var(--cad-post-it-lemon-ink, #51491f));
    }

    :host([tone='mint']) {
      --_radio-bg: var(--cad-radio-bg, var(--cad-post-it-mint-bg, #d8ffec));
      --_radio-ink: var(--cad-radio-ink, var(--cad-post-it-mint-ink, #274f41));
    }

    :host([tone='pink']) {
      --_radio-bg: var(--cad-radio-bg, var(--cad-post-it-pink-bg, #ffb7d5));
      --_radio-ink: var(--cad-radio-ink, var(--cad-post-it-pink-ink, #52233a));
    }

    :host([tone='violet']) {
      --_radio-bg: var(--cad-radio-bg, var(--cad-sticker-violet-bg, #bba0ff));
      --_radio-ink: var(
        --cad-radio-ink,
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

    .ring {
      position: relative;
      display: inline-grid;
      place-items: center;
      box-sizing: border-box;
      width: 1.5rem;
      height: 1.5rem;
      margin-top: 0.1rem;
      color: var(--_radio-ink);
      background: transparent;
      border: 1.5px solid color-mix(in srgb, var(--_radio-ink) 88%, transparent);
      border-radius: 53% 47% 51% 49%;
      transition: transform
        var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
        var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
      transform: rotate(-2deg);
    }

    .ring::after {
      position: absolute;
      inset: 0.12rem -0.1rem -0.08rem 0.08rem;
      border: 1px solid color-mix(in srgb, var(--_radio-ink) 54%, transparent);
      border-radius: 47% 53% 49% 51%;
      content: '';
      opacity: 0;
      pointer-events: none;
      transform: rotate(5deg);
    }

    .dot {
      display: block;
      width: 0.72rem;
      height: 0.72rem;
      background: var(--_radio-ink);
      border-radius: 48% 52% 46% 54%;
      box-shadow: 0.08rem 0.04rem 0
        color-mix(in srgb, var(--_radio-ink) 35%, transparent);
      opacity: 0;
      transition:
        opacity
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease),
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, ease);
      transform: scale(0.5);
    }

    .control:checked + .ring {
      background: color-mix(in srgb, var(--_radio-bg) 32%, transparent);
      border-color: var(--_radio-ink);
    }

    .control:checked + .ring::after {
      opacity: 1;
    }

    .control:checked + .ring .dot {
      opacity: 1;
      transform: scale(1);
    }

    .control:focus-visible + .ring {
      outline: 2px dashed var(--cad-focus-ring, var(--_radio-ink));
      outline-offset: 3px;
    }

    .base:hover .ring {
      transform: rotate(-2deg) translateY(-1px);
    }

    :host([disabled]) .base:hover .ring {
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
      .dot,
      .ring {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .ring {
        border-color: CanvasText;
      }
    }
  `

  declare checked: boolean
  declare disabled: boolean
  declare hint: string
  declare label: string
  declare name: string
  declare required: boolean
  declare tone: CadRadioTone
  declare value: string

  private readonly internals: ElementInternals
  private customValidityMessage = ''
  private defaultChecked = false
  private formDisabled = false
  private syncingGroup = false

  constructor() {
    super()
    this.internals = this.attachInternals()
    this.checked = false
    this.disabled = false
    this.hint = ''
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

  private get group(): CadRadio[] {
    if (!this.name) return [this]
    return [...this.ownerDocument.querySelectorAll('cad-radio')].filter(
      (radio) => radio.name === this.name && radio.form === this.form,
    )
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
    this.defaultChecked = this.checked
    if (this.checked) this.uncheckPeers()
    this.refreshGroup()
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('checked') && this.checked && !this.syncingGroup) {
      this.uncheckPeers()
    }
    if (
      changed.has('checked') ||
      changed.has('disabled') ||
      changed.has('name') ||
      changed.has('required') ||
      changed.has('value')
    ) {
      this.refreshGroup()
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
          part="control"
          ?required=${this.required}
          type="radio"
          @change=${this.handleChange}
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />
        <span aria-hidden="true" class="ring" part="ring">
          <span class="dot" part="dot"></span>
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
    if (!(control instanceof HTMLInputElement) || !control.checked) return
    this.selectFromUser()
  }

  private handleInput(event: Event): void {
    event.stopPropagation()
  }

  private handleKeydown(event: KeyboardEvent): void {
    const offset =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? -1
        : event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : 0
    if (!offset) return

    const enabled = this.group.filter(
      (radio) => !radio.disabled && !radio.formDisabled,
    )
    const index = enabled.indexOf(this)
    if (index < 0 || enabled.length < 2) return
    event.preventDefault()
    const next = enabled[(index + offset + enabled.length) % enabled.length]
    if (!next) return
    next.focus()
    next.selectFromUser()
  }

  private selectFromUser(): void {
    if (this.disabled || this.formDisabled) return
    this.checked = true
    this.uncheckPeers()
    this.refreshGroup()
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

  private uncheckPeers(): void {
    if (!this.name) return
    for (const radio of this.group) {
      if (radio === this || !radio.checked) continue
      radio.syncingGroup = true
      radio.checked = false
      radio.syncingGroup = false
    }
  }

  private refreshGroup(): void {
    for (const radio of this.group) radio.syncFormState()
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

    const groupMissing =
      this.group.some((radio) => radio.required) &&
      !this.group.some((radio) => radio.checked)
    const message =
      this.customValidityMessage ||
      (groupMissing ? 'Select one of these options.' : '')
    control.setCustomValidity(message)
    this.internals.setValidity(
      control.validity,
      control.validationMessage,
      control,
    )
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-radio')) {
  customElements.define('cad-radio', CadRadio)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-radio': CadRadio
  }
}
