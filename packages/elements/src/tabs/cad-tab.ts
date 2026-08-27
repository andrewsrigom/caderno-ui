import { css, html, LitElement, nothing } from 'lit'

/** @deprecated Tabs use one neutral/blue palette. Tone values are ignored. */
export type CadTabTone =
  'accent' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

export type CadTabRequestDetail = {
  key?: 'ArrowLeft' | 'ArrowRight' | 'End' | 'Home'
  value: string
}

export type CadTabRequestEvent = CustomEvent<CadTabRequestDetail>

/**
 * A semantic tab list composed inside `cad-tabs`.
 *
 * @slot - `cad-tab-trigger` children.
 * @csspart list - Native tab-list container.
 */
export class CadTabsList extends LitElement {
  static override properties = {
    label: { type: String },
  }

  static override styles = css`
    :host {
      position: relative;
      z-index: 1;
      display: block;
      min-width: 0;
      max-width: 100%;
    }

    .list {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.4rem;
      align-items: flex-end;
      padding: 0 0.75rem;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
      scrollbar-width: none;
    }

    .list::-webkit-scrollbar {
      display: none;
    }
  `

  declare label: string

  constructor() {
    super()
    this.label = 'Tabs'
  }

  override render() {
    return html`<div
      aria-label=${this.label}
      class="list"
      part="list"
      role="tablist"
      tabindex="-1"
    >
      <slot></slot>
    </div>`
  }
}

/**
 * A native tab button controlled by its nearest `cad-tabs`.
 *
 * @slot - Visible tab label. Falls back to the `label` attribute.
 * @slot end - Optional trailing content.
 * @slot start - Optional leading content.
 * @fires cad-tab-request - Requests activation or keyboard navigation from `cad-tabs`.
 * @csspart tab - Native tab button.
 */
export class CadTabTrigger extends LitElement {
  static override properties = {
    active: { reflect: true, type: Boolean },
    controls: { attribute: false },
    disabled: { reflect: true, type: Boolean },
    label: { type: String },
    tone: { reflect: true, type: String },
    value: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_tab-bg: var(--cad-surface, #fff);
      --_tab-border: var(--cad-link, #005bac);
      --_tab-ink: var(--cad-link, #005bac);
      display: inline-flex;
      flex: 0 0 auto;
    }

    .tab {
      display: inline-flex;
      gap: 0.4rem;
      align-items: center;
      min-height: 2.75rem;
      padding: 0.72rem 1rem 0.78rem;
      margin: 0;
      color: var(--_tab-ink);
      background: var(--_tab-bg);
      border: 1.5px solid
        color-mix(in srgb, var(--_tab-border) 72%, transparent);
      border-bottom-width: 0;
      border-radius: 0.4rem 0.55rem 0 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1;
      cursor: pointer;
      transform: rotate(-0.15deg);
      transition: background-color
        var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
        var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    .tab:hover:not(:disabled, [aria-selected='true']) {
      background: color-mix(in srgb, var(--_tab-ink) 6%, var(--_tab-bg));
    }

    .tab[aria-selected='true'] {
      position: relative;
      z-index: 2;
      padding-bottom: 0.9rem;
      color: var(--_tab-bg);
      background: var(--_tab-ink);
      border-color: var(--_tab-border);
      box-shadow: 0 3px 0 var(--_tab-ink);
      font-weight: 700;
      transform: translateY(1.5px) rotate(0.12deg);
    }

    .tab:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .tab:focus-visible {
      outline: var(--cad-focus-outline, 2px dashed var(--_tab-ink));
      outline-offset: -4px;
    }

    .tab[aria-selected='true']:focus-visible {
      outline-color: var(--_tab-bg);
    }

    @media (prefers-reduced-motion: reduce) {
      .tab {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .tab {
        border-color: CanvasText;
      }

      .tab[aria-selected='true'] {
        outline: 2px solid Highlight;
        outline-offset: -4px;
      }
    }
  `

  declare active: boolean
  declare controls: string
  declare disabled: boolean
  declare label: string
  /** @deprecated Tabs use one neutral/blue palette. This value is ignored. */
  declare tone: CadTabTone
  declare value: string

  constructor() {
    super()
    this.active = false
    this.controls = ''
    this.disabled = false
    this.label = ''
    this.tone = 'accent'
    this.value = ''
  }

  focusControl(options?: FocusOptions): void {
    this.renderRoot.querySelector('button')?.focus(options)
  }

  setControlledPanel(panel: HTMLElement): void {
    const button = this.renderRoot.querySelector('button')
    if (button && 'ariaControlsElements' in button) {
      button.ariaControlsElements = [panel]
    }
  }

  override render() {
    return html`
      <button
        aria-controls=${this.controls || nothing}
        aria-selected=${String(this.active)}
        class="tab"
        ?disabled=${this.disabled}
        part="tab"
        role="tab"
        tabindex=${this.active ? 0 : -1}
        type="button"
        @click=${this.requestActivation}
        @keydown=${this.requestNavigation}
      >
        <slot name="start"></slot>
        <span><slot>${this.label}</slot></span>
        <slot name="end"></slot>
      </button>
    `
  }

  private requestActivation(): void {
    if (!this.disabled) this.dispatchRequest()
  }

  private requestNavigation(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'End', 'Home'].includes(event.key)) return
    event.preventDefault()
    this.dispatchRequest(event.key as CadTabRequestDetail['key'])
  }

  private dispatchRequest(key?: CadTabRequestDetail['key']): void {
    this.dispatchEvent(
      new CustomEvent<CadTabRequestDetail>('cad-tab-request', {
        bubbles: true,
        composed: true,
        detail: key ? { key, value: this.value } : { value: this.value },
      }),
    )
  }
}

/**
 * A tab panel controlled by the matching `cad-tab-trigger` value.
 *
 * @slot - Panel content.
 * @csspart panel - Native tab panel.
 * @cssprop --cad-tabs-panel-bg - Panel surface.
 */
export class CadTabContent extends LitElement {
  static override properties = {
    active: { reflect: true, type: Boolean },
    label: { type: String },
    value: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      max-width: 100%;
    }

    :host(:not([active])) {
      display: none;
    }

    .panel {
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      padding: 1.5rem 1.65rem 1.6rem;
      margin-top: -1.5px;
      color: var(--cad-link, #005bac);
      background: var(--cad-tabs-panel-bg, var(--cad-surface, #fff));
      border: 1.5px solid
        color-mix(in srgb, var(--cad-link, #005bac) 82%, transparent);
      border-radius: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      line-height: 1.65;
      transform: rotate(-0.04deg);
    }

    ::slotted(h2),
    ::slotted(h3) {
      color: inherit;
      font-family: inherit;
      font-size: var(--cad-hand-lg, 1.55rem);
      line-height: 1.2;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    @media (forced-colors: active) {
      .panel {
        border-color: CanvasText;
      }
    }
  `

  declare active: boolean
  declare label: string
  declare value: string

  constructor() {
    super()
    this.active = false
    this.label = ''
    this.value = ''
  }

  override render() {
    return html`
      <div class="panel" part="panel">
        <slot></slot>
      </div>
    `
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-tabs-list')) {
    customElements.define('cad-tabs-list', CadTabsList)
  }
  if (!customElements.get('cad-tab-trigger')) {
    customElements.define('cad-tab-trigger', CadTabTrigger)
  }
  if (!customElements.get('cad-tab-content')) {
    customElements.define('cad-tab-content', CadTabContent)
  }
}

declare global {
  interface HTMLElementEventMap {
    'cad-tab-request': CadTabRequestEvent
  }

  interface HTMLElementTagNameMap {
    'cad-tab-content': CadTabContent
    'cad-tab-trigger': CadTabTrigger
    'cad-tabs-list': CadTabsList
  }
}
