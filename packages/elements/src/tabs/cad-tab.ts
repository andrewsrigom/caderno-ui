import { css, html, LitElement, nothing } from 'lit'

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
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      align-items: flex-end;
      padding: 0 0.15rem;
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
      --_tab-bg: var(--cad-post-it-blue-bg, #293f64);
      --_tab-ink: var(--cad-post-it-blue-ink, #deebff);
      display: inline-flex;
    }

    :host([tone='coral']) {
      --_tab-bg: var(--cad-post-it-coral-bg, #633b32);
      --_tab-ink: var(--cad-post-it-coral-ink, #ffe1da);
    }

    :host([tone='mint']) {
      --_tab-bg: var(--cad-post-it-mint-bg, #274f41);
      --_tab-ink: var(--cad-post-it-mint-ink, #d8ffec);
    }

    :host([tone='lemon']) {
      --_tab-bg: var(--cad-post-it-lemon-bg, #51491f);
      --_tab-ink: var(--cad-post-it-lemon-ink, #fff1ac);
    }

    :host([tone='pink']) {
      --_tab-bg: var(--cad-post-it-pink-bg, #5a3449);
      --_tab-ink: var(--cad-post-it-pink-ink, #ffdceb);
    }

    :host([tone='violet']) {
      --_tab-bg: var(--cad-sticker-violet-bg, #58419b);
      --_tab-ink: var(--cad-sticker-violet-ink, #f5efff);
    }

    .tab {
      display: inline-flex;
      gap: 0.4rem;
      align-items: center;
      min-height: 2.75rem;
      padding: 0.55rem 1rem 0.85rem;
      margin: 0;
      color: var(--_tab-ink);
      background: color-mix(
        in srgb,
        var(--_tab-bg) 40%,
        var(--cad-surface, #1f2335)
      );
      border: 1.5px solid color-mix(in srgb, var(--_tab-ink) 32%, transparent);
      border-bottom-width: 0;
      border-radius: 0.7rem 0.95rem 0 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1;
      cursor: pointer;
      transition:
        transform
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease)),
        padding
          var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
          var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    .tab:hover:not(:disabled) {
      background: color-mix(
        in srgb,
        var(--_tab-bg) 55%,
        var(--cad-surface, #1f2335)
      );
      transform: translateY(-1px);
    }

    .tab:active:not(:disabled) {
      transform: translateY(1px) scale(0.98);
    }

    .tab[aria-selected='true'] {
      padding-bottom: 1.05rem;
      background: var(--_tab-bg);
      border-color: color-mix(in srgb, var(--_tab-ink) 55%, transparent);
      box-shadow:
        inset 0 -0.18rem 0.32rem
          color-mix(in srgb, var(--_tab-ink) 22%, transparent),
        inset 0 0.14rem 0 color-mix(in srgb, white 32%, transparent);
      font-weight: 700;
      transform: translateY(2px);
    }

    .tab:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .tab:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
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
    }

    :host(:not([active])) {
      display: none;
    }

    .panel {
      min-width: 0;
      padding: 1.35rem 1.5rem 1.4rem;
      color: var(--cad-ink, currentColor);
      background: var(
        --cad-tabs-panel-bg,
        color-mix(in srgb, var(--cad-surface, #1f2335) 92%, transparent)
      );
      border: 1.5px solid
        color-mix(in srgb, var(--cad-ink-muted, currentColor) 32%, transparent);
      border-radius: 0.35rem 0.85rem 0.85rem 0.85rem;
      font-family: var(--cad-font-book, serif);
      line-height: 1.65;
    }

    :host([active]) .panel {
      animation: cad-tab-panel-enter
        var(--cad-motion-duration-enter, var(--cad-duration-slow, 420ms))
        var(--cad-motion-ease-enter, var(--cad-transition-smooth, ease-out));
      transform-origin: top left;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    @keyframes cad-tab-panel-enter {
      from {
        opacity: 0;
        transform: translateY(var(--cad-motion-distance-sm, 0.35rem))
          rotate(-0.2deg);
      }

      to {
        opacity: 1;
        transform: translateY(0) rotate(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host([active]) .panel {
        animation: none;
      }
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
