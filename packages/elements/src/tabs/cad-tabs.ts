import { css, html, LitElement, type PropertyValues } from 'lit'

import '../icon/cad-icon.js'
import type { CadTab } from './cad-tab.js'

export type CadTabChangeDetail = {
  activeTab: string
  previousTab: string
}

export type CadTabChangeEvent = CustomEvent<CadTabChangeDetail>

let tabsInstance = 0

/**
 * An accessible tabs controller for declarative `cad-tab` children.
 *
 * @slot - Direct `cad-tab` children.
 * @fires cad-tab-change - Fired after the active panel changes.
 * @csspart list - Tab list.
 * @csspart panels - Panel container.
 * @csspart tab - Every native tab button.
 * @cssprop --cad-tabs-panel-bg - Panel surface.
 */
export class CadTabs extends LitElement {
  static override properties = {
    activeTab: { attribute: 'active-tab', reflect: true, type: String },
    defaultTab: { attribute: 'default-tab', type: String },
    label: { type: String },
  }

  static override styles = css`
    :host {
      display: grid;
      gap: 0;
    }

    .list {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 0.35rem;
      padding: 0 0.15rem;
    }

    .tab {
      --_tab-bg: var(--cad-post-it-blue-bg, #293f64);
      --_tab-ink: var(--cad-post-it-blue-ink, #deebff);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
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
      transition:
        transform var(--cad-duration-fast, 140ms)
          var(--cad-transition-smooth, ease),
        padding var(--cad-duration-fast, 140ms)
          var(--cad-transition-smooth, ease);
      transform: translateY(0);
    }

    .tab:hover {
      background: color-mix(
        in srgb,
        var(--_tab-bg) 55%,
        var(--cad-surface, #1f2335)
      );
      transform: translateY(-1px);
    }

    .tab[aria-selected='true'] {
      padding-bottom: 1.05rem;
      color: var(--_tab-ink);
      background: var(--_tab-bg);
      border-color: color-mix(in srgb, var(--_tab-ink) 55%, transparent);
      box-shadow:
        inset 0 -0.18rem 0.32rem
          color-mix(in srgb, var(--_tab-ink) 22%, transparent),
        inset 0 0.14rem 0 color-mix(in srgb, white 32%, transparent);
      font-weight: 700;
      transform: translateY(2px);
    }

    .tab:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }

    .tab[data-tone='coral'] {
      --_tab-bg: var(--cad-post-it-coral-bg, #633b32);
      --_tab-ink: var(--cad-post-it-coral-ink, #ffe1da);
    }

    .tab[data-tone='mint'] {
      --_tab-bg: var(--cad-post-it-mint-bg, #274f41);
      --_tab-ink: var(--cad-post-it-mint-ink, #d8ffec);
    }

    .tab[data-tone='lemon'] {
      --_tab-bg: var(--cad-post-it-lemon-bg, #51491f);
      --_tab-ink: var(--cad-post-it-lemon-ink, #fff1ac);
    }

    .tab[data-tone='pink'] {
      --_tab-bg: var(--cad-post-it-pink-bg, #5a3449);
      --_tab-ink: var(--cad-post-it-pink-ink, #ffdceb);
    }

    .tab[data-tone='violet'] {
      --_tab-bg: var(--cad-sticker-violet-bg, #58419b);
      --_tab-ink: var(--cad-sticker-violet-ink, #f5efff);
    }

    .tab-icon {
      display: inline-grid;
      place-items: center;
      transform: rotate(-4deg);
    }

    .panels {
      position: relative;
      padding: 1.35rem 1.5rem 1.4rem;
      color: var(--cad-ink, currentColor);
      background: var(
        --cad-tabs-panel-bg,
        color-mix(in srgb, var(--cad-surface, #1f2335) 92%, transparent)
      );
      border: 1.5px solid
        color-mix(in srgb, var(--cad-ink-muted, currentColor) 32%, transparent);
      border-radius: 0.35rem 0.85rem 0.85rem 0.85rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .tab {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .panels,
      .tab {
        border-color: CanvasText;
      }

      .tab[aria-selected='true'] {
        outline: 2px solid Highlight;
        outline-offset: -4px;
      }
    }
  `

  declare activeTab: string
  declare defaultTab: string
  declare label: string
  declare private items: CadTab[]

  private readonly instanceId = `cad-tabs-${++tabsInstance}`
  private observer?: MutationObserver

  constructor() {
    super()
    this.activeTab = ''
    this.defaultTab = ''
    this.items = []
    this.label = 'Tabs'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.observer = new MutationObserver(() => this.syncItems())
    this.observer.observe(this, {
      attributeFilter: [
        'data-icon',
        'data-label',
        'data-name',
        'data-tone',
        'icon',
        'label',
        'name',
        'tone',
      ],
      attributes: true,
      childList: true,
      subtree: true,
    })
  }

  override disconnectedCallback(): void {
    this.observer?.disconnect()
    super.disconnectedCallback()
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('activeTab')) {
      this.applyPanelState()
    }
    this.applyAriaRelationships()
  }

  private get directItems(): CadTab[] {
    return Array.from(this.children).filter(
      (child): child is CadTab => child.tagName.toLowerCase() === 'cad-tab',
    )
  }

  private get definitions(): Map<string, HTMLElement> {
    const definitions = Array.from(
      this.querySelectorAll<HTMLElement>(':scope > [data-cad-tab-definition]'),
    )

    return new Map(
      definitions.flatMap((definition) => {
        const name = definition.dataset.name
        return name ? [[name, definition]] : []
      }),
    )
  }

  private syncItems(): void {
    const items = this.directItems
    const definitions = this.definitions

    items.forEach((item) => {
      const definition = definitions.get(item.name)
      if (!definition) return
      item.label = definition.dataset.label ?? item.label
      item.icon = definition.dataset.icon ?? item.icon
      item.tone =
        (definition.dataset.tone as CadTab['tone'] | undefined) ?? item.tone
    })

    const names = items.map((item) => item.name).filter(Boolean)

    if (items.length === 0) {
      this.items = []
      this.activeTab = ''
      delete this.dataset.invalid
      this.requestUpdate()
      return
    }

    if (names.length !== items.length || new Set(names).size !== names.length) {
      this.dataset.invalid = 'true'
      this.items = []
      this.activeTab = ''
      items.forEach((item) => {
        item.hidden = false
      })
      this.requestUpdate()
      return
    }

    delete this.dataset.invalid
    this.items = items

    const requested = this.activeTab || this.defaultTab
    this.activeTab = names.includes(requested) ? requested : (names[0] ?? '')
    this.applyPanelState()
    this.requestUpdate()
  }

  private applyPanelState(): void {
    this.items.forEach((item) => {
      const active = item.name === this.activeTab
      item.hidden = !active
      item.id = this.panelId(item.name)
      item.role = 'tabpanel'
      item.tabIndex = 0
      item.setAttribute('aria-label', item.label)
    })
  }

  private applyAriaRelationships(): void {
    this.items.forEach((item) => {
      const button = this.shadowRoot?.querySelector<HTMLButtonElement>(
        `#${this.tabId(item.name)}`,
      )
      if (!button || !('ariaControlsElements' in button)) return
      button.ariaControlsElements = [item]
    })
  }

  private panelId(name: string): string {
    return `${this.id || this.instanceId}-panel-${name}`
  }

  private tabId(name: string): string {
    return `${this.id || this.instanceId}-tab-${name}`
  }

  private activate(index: number, focus: boolean): void {
    const item = this.items[index]
    if (!item) return

    const previousTab = this.activeTab
    this.activeTab = item.name

    if (previousTab !== this.activeTab) {
      this.dispatchEvent(
        new CustomEvent<CadTabChangeDetail>('cad-tab-change', {
          bubbles: true,
          composed: true,
          detail: {
            activeTab: this.activeTab,
            previousTab,
          },
        }),
      )
    }

    if (focus) {
      void this.updateComplete.then(() => {
        this.shadowRoot
          ?.querySelector<HTMLButtonElement>(`#${this.tabId(item.name)}`)
          ?.focus()
      })
    }
  }

  private handleKeydown(event: KeyboardEvent, index: number): void {
    let nextIndex: number

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % this.items.length
    else if (event.key === 'ArrowLeft')
      nextIndex = (index - 1 + this.items.length) % this.items.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = this.items.length - 1
    else return

    event.preventDefault()
    this.activate(nextIndex, true)
  }

  override render() {
    return html`
      <div aria-label=${this.label} class="list" part="list" role="tablist">
        ${this.items.map((item, index) => {
          const active = item.name === this.activeTab
          return html`
            <button
              aria-selected=${String(active)}
              class="tab"
              data-tone=${item.tone}
              id=${this.tabId(item.name)}
              part="tab"
              role="tab"
              tabindex=${active ? 0 : -1}
              type="button"
              @click=${() => this.activate(index, true)}
              @keydown=${(event: KeyboardEvent) => this.handleKeydown(event, index)}
            >
              ${
                item.icon
                  ? html`
                      <span aria-hidden="true" class="tab-icon">
                        <cad-icon name=${item.icon} size="16"></cad-icon>
                      </span>
                    `
                  : null
              }
              <span>${item.label}</span>
            </button>
          `
        })}
      </div>
      <div class="panels" part="panels">
        <slot @slotchange=${this.syncItems}></slot>
      </div>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-tabs')) {
  customElements.define('cad-tabs', CadTabs)
}

declare global {
  interface HTMLElementEventMap {
    'cad-tab-change': CadTabChangeEvent
  }

  interface HTMLElementTagNameMap {
    'cad-tabs': CadTabs
  }
}
