import { css, html, LitElement, type PropertyValues } from 'lit'

export type CadHeaderVariant =
  'bold' | 'elevated' | 'glass' | 'minimal' | 'surface'

export type CadHeaderMenuToggleDetail = {
  expanded: boolean
}

export type CadHeaderMenuToggleEvent = CustomEvent<CadHeaderMenuToggleDetail>

let headerId = 0

/**
 * A responsive site banner that composes brand, primary navigation, search,
 * actions, and account controls without owning product-specific behavior.
 *
 * @slot - Primary navigation links.
 * @slot actions - Persistent product actions and notifications.
 * @slot brand - Product identity linked to the home page.
 * @slot context - Optional workspace or product-suite context above navigation.
 * @slot search - Search input or compact search trigger.
 * @slot user - Account trigger or user-menu composition.
 * @fires cad-header-menu-toggle - Fired when compact navigation opens or closes.
 * @csspart actions - Product actions region.
 * @csspart bar - Responsive header layout.
 * @csspart brand - Brand region.
 * @csspart context - Optional navigation context.
 * @csspart menu-toggle - Compact navigation toggle.
 * @csspart navigation - Primary navigation landmark.
 * @csspart search - Search region.
 * @csspart surface - Semantic banner landmark and visual surface.
 * @csspart user - Account region.
 * @cssprop --cad-header-accent - Per-instance ink and border accent.
 * @cssprop --cad-header-border - Per-instance border color.
 * @cssprop --cad-header-ink - Per-instance text color.
 * @cssprop --cad-header-sticky-offset - Offset from the viewport edge when sticky.
 * @cssprop --cad-header-surface - Per-instance surface color.
 * @cssprop --cad-header-z-index - Stacking level used when sticky.
 */
export class CadHeader extends LitElement {
  static override properties = {
    closeMenuLabel: { attribute: 'close-menu-label', type: String },
    label: { type: String },
    menuLabel: { attribute: 'menu-label', type: String },
    navigationLabel: { attribute: 'navigation-label', type: String },
    open: { reflect: true, type: Boolean },
    sticky: { reflect: true, type: Boolean },
    variant: { reflect: true, type: String },
    compact: { attribute: false, state: true },
  }

  static override styles = css`
    :host {
      --_header-accent: var(
        --cad-header-accent,
        var(--cad-link, var(--cad-color-day-link, #005bac))
      );
      --_header-border: var(--cad-header-border, var(--_header-accent));
      --_header-ink: var(
        --cad-header-ink,
        var(--cad-ink, var(--cad-color-day-ink, #162033))
      );
      --_header-surface: var(
        --cad-header-surface,
        var(--cad-surface, var(--cad-color-day-surface, #fff))
      );
      --cad-focus-ring: var(--_header-accent);
      --cad-link-ink: var(--_header-accent);
      container-type: inline-size;
      display: block;
      min-width: 0;
      color: var(--_header-ink);
    }

    :host([sticky]) {
      position: sticky;
      z-index: var(--cad-header-z-index, 40);
      top: var(--cad-header-sticky-offset, 0);
    }

    :host([variant='bold']) {
      --_header-accent: var(
        --cad-header-accent,
        var(--cad-color-night-link, #a8b8ff)
      );
      --_header-border: var(--cad-header-border, var(--_header-accent));
      --_header-ink: var(--cad-header-ink, var(--cad-color-night-ink, #e0e0ff));
      --_header-surface: var(
        --cad-header-surface,
        var(--cad-color-night-surface, #1f2335)
      );
      --cad-ink: var(--_header-ink);
      --cad-link: var(--_header-accent);
      --cad-surface: var(--_header-surface);
      --cad-button-bg: color-mix(
        in srgb,
        var(--_header-accent) 18%,
        var(--_header-surface)
      );
      --cad-button-ink: var(--_header-ink);
    }

    .surface {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      color: var(--_header-ink);
      background: var(--_header-surface);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_header-border);
      border-radius: 0;
      font-family: var(--cad-font-book, serif);
      isolation: isolate;
    }

    .surface::after {
      content: none;
    }

    :host([variant='glass']) .surface {
      background: color-mix(in srgb, var(--_header-surface) 82%, transparent);
      backdrop-filter: blur(0.65rem) saturate(125%);
    }

    :host([variant='elevated']) .surface {
      box-shadow: 0.32rem 0.38rem 0
        color-mix(in srgb, var(--_header-accent) 12%, transparent);
    }

    :host([variant='minimal']) .surface {
      background: transparent;
      border-inline: 0;
      border-block-start: 0;
    }

    :host([variant='minimal']) .surface::after {
      display: none;
    }

    .bar {
      box-sizing: border-box;
      display: flex;
      gap: clamp(0.65rem, 1.7vw, 1.35rem);
      align-items: center;
      min-height: 4.75rem;
      padding: 0.7rem clamp(0.85rem, 2vw, 1.35rem);
    }

    .brand,
    .navigation-stack,
    .navigation,
    .search,
    .actions,
    .user {
      min-width: 0;
    }

    .brand {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      white-space: nowrap;
    }

    .navigation-stack {
      display: grid;
      flex: 1 1 auto;
      gap: 0.18rem;
      align-items: center;
    }

    .context {
      color: color-mix(in srgb, var(--_header-ink) 72%, transparent);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-xs, 0.76rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.1;
      text-transform: uppercase;
    }

    .navigation {
      display: flex;
      gap: clamp(0.65rem, 1.6vw, 1.2rem);
      align-items: center;
    }

    .navigation slot {
      display: contents;
    }

    .search,
    .actions,
    .user {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .actions {
      justify-content: flex-end;
      margin-inline-start: auto;
    }

    .search {
      flex: 0 1 18rem;
    }

    .menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      min-width: 2.75rem;
      min-height: 2.75rem;
      padding: 0.55rem;
      color: inherit;
      background: transparent;
      border: 1.2px solid var(--_header-border);
      border-radius: 0;
      cursor: pointer;
      font: inherit;
    }

    .menu-icon,
    .menu-icon::before,
    .menu-icon::after {
      display: block;
      width: 1.15rem;
      height: 1.5px;
      background: currentColor;
      content: '';
      transition:
        transform var(--cad-duration-fast, 140ms) ease,
        opacity var(--cad-duration-fast, 140ms) ease;
    }

    .menu-icon {
      position: relative;
    }

    .menu-icon::before,
    .menu-icon::after {
      position: absolute;
      inset-inline-start: 0;
    }

    .menu-icon::before {
      transform: translateY(-0.36rem) rotate(-1deg);
    }

    .menu-icon::after {
      transform: translateY(0.36rem) rotate(1deg);
    }

    :host([open]) .menu-icon {
      background: transparent;
    }

    :host([open]) .menu-icon::before {
      transform: rotate(45deg);
    }

    :host([open]) .menu-icon::after {
      transform: rotate(-45deg);
    }

    .menu-toggle:focus-visible {
      outline: 1.5px dashed var(--cad-focus-ring, var(--_header-accent));
      outline-offset: 3px;
    }

    .surface [hidden] {
      display: none;
    }

    ::slotted([slot='brand']),
    ::slotted([slot='context']),
    ::slotted([slot='search']),
    ::slotted([slot='actions']),
    ::slotted([slot='user']) {
      min-width: 0;
      margin: 0;
    }

    ::slotted([slot='brand']) {
      white-space: nowrap;
    }

    ::slotted(a),
    ::slotted(cad-link) {
      flex: none;
    }

    @container (width <= 64rem) {
      .bar {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto auto auto;
        padding: 0.65rem 0.75rem;
      }

      .menu-toggle:not([hidden]) {
        display: inline-flex;
        grid-column: 1;
        grid-row: 1;
      }

      .brand {
        grid-column: 2;
        grid-row: 1;
      }

      .menu-toggle[hidden] + .brand {
        grid-column: 1 / 3;
      }

      .search {
        grid-column: 3;
        grid-row: 1;
      }

      .actions {
        grid-column: 4;
        grid-row: 1;
      }

      .user {
        grid-column: 5;
        grid-row: 1;
      }

      .navigation-stack {
        grid-column: 1 / -1;
        grid-row: 2;
        padding: 0.8rem 0.15rem 0.3rem;
        border-top: 1px dashed
          color-mix(in srgb, var(--_header-border) 42%, transparent);
      }

      .navigation {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
        gap: 0.25rem 1rem;
        align-items: start;
      }

      ::slotted(a),
      ::slotted(cad-link) {
        box-sizing: border-box;
        width: 100%;
        min-height: 2.75rem;
        justify-content: flex-start;
      }
    }

    @container (width <= 36rem) {
      .bar {
        grid-template-columns: auto minmax(2.75rem, 1fr) auto auto auto;
        gap: 0.4rem;
      }

      .search {
        grid-column: 3;
      }

      .actions {
        grid-column: 4;
      }

      .user {
        grid-column: 5;
        grid-row: 1;
      }

      .navigation-stack {
        grid-row: 2;
      }

      .navigation {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .menu-icon,
      .menu-icon::before,
      .menu-icon::after {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .surface {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }

      .menu-toggle {
        border-color: ButtonText;
      }
    }
  `

  declare closeMenuLabel: string
  declare label: string
  declare menuLabel: string
  declare navigationLabel: string
  declare open: boolean
  declare sticky: boolean
  declare variant: CadHeaderVariant
  declare private compact: boolean

  private readonly navigationId = `cad-header-navigation-${++headerId}`
  private hasActions = false
  private hasBrand = false
  private hasContext = false
  private hasNavigation = false
  private hasSearch = false
  private hasUser = false
  private menuButton: HTMLButtonElement | null = null
  private resizeFrame = 0
  private resizeObserver: ResizeObserver | undefined

  constructor() {
    super()
    this.closeMenuLabel = 'Close menu'
    this.compact = false
    this.label = 'Site header'
    this.menuLabel = 'Open menu'
    this.navigationLabel = 'Primary navigation'
    this.open = false
    this.sticky = false
    this.variant = 'surface'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (typeof window === 'undefined') return
    this.resizeFrame = window.requestAnimationFrame(() => {
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(this.handleResize)
        this.resizeObserver.observe(this)
      }
      this.syncResponsiveState(this.getBoundingClientRect().width)
    })
  }

  override disconnectedCallback(): void {
    if (typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.resizeFrame)
    }
    this.resizeObserver?.disconnect()
    super.disconnectedCallback()
  }

  toggle(force?: boolean): void {
    const next = force ?? !this.open
    if (next === this.open) return
    this.open = next
    this.dispatchEvent(
      new CustomEvent<CadHeaderMenuToggleDetail>('cad-header-menu-toggle', {
        bubbles: true,
        composed: true,
        detail: { expanded: this.open },
      }),
    )
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('variant')) {
      const variants: CadHeaderVariant[] = [
        'bold',
        'elevated',
        'glass',
        'minimal',
        'surface',
      ]
      if (!variants.includes(this.variant)) this.variant = 'surface'
    }
  }

  override render() {
    const navigationHidden =
      (!this.hasNavigation && !this.hasContext) || (this.compact && !this.open)

    return html`
      <header
        aria-label=${this.label}
        class="surface"
        part="surface"
        @keydown=${this.handleKeydown}
      >
        <div class="bar" part="bar">
          <button
            aria-controls=${this.navigationId}
            aria-expanded=${this.open ? 'true' : 'false'}
            aria-label=${this.open ? this.closeMenuLabel : this.menuLabel}
            class="menu-toggle"
            ?hidden=${!this.hasNavigation && !this.hasContext}
            part="menu-toggle"
            type="button"
            @click=${this.handleMenuToggle}
          >
            <span aria-hidden="true" class="menu-icon"></span>
          </button>
          <div class="brand" ?hidden=${!this.hasBrand} part="brand">
            <slot name="brand" @slotchange=${this.handleSlotChange}></slot>
          </div>
          <div
            class="navigation-stack"
            id=${this.navigationId}
            ?hidden=${navigationHidden}
          >
            <div class="context" ?hidden=${!this.hasContext} part="context">
              <slot name="context" @slotchange=${this.handleSlotChange}></slot>
            </div>
            <nav
              aria-label=${this.navigationLabel}
              class="navigation"
              ?hidden=${!this.hasNavigation}
              part="navigation"
            >
              <slot
                @click=${this.handleNavigationClick}
                @keydown=${this.handleNavigationKeydown}
                @slotchange=${this.handleSlotChange}
              ></slot>
            </nav>
          </div>
          <div class="search" ?hidden=${!this.hasSearch} part="search">
            <slot name="search" @slotchange=${this.handleSlotChange}></slot>
          </div>
          <div class="actions" ?hidden=${!this.hasActions} part="actions">
            <slot name="actions" @slotchange=${this.handleSlotChange}></slot>
          </div>
          <div class="user" ?hidden=${!this.hasUser} part="user">
            <slot name="user" @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
      </header>
    `
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.open) return
    event.preventDefault()
    this.toggle(false)
    void this.updateComplete.then(() => this.menuButton?.focus())
  }

  private handleMenuToggle(event: Event): void {
    this.menuButton = event.currentTarget as HTMLButtonElement
    this.toggle()
  }

  private handleNavigationClick(event: Event): void {
    if (!this.compact || !this.open) return
    const navigated = event
      .composedPath()
      .some(
        (node) =>
          node instanceof HTMLAnchorElement ||
          (node instanceof HTMLElement && node.localName === 'cad-link'),
      )
    if (navigated) this.toggle(false)
  }

  private handleNavigationKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.handleNavigationClick(event)
  }

  private handleResize = (entries: ResizeObserverEntry[]): void => {
    const entry = entries[0]
    if (entry) this.syncResponsiveState(entry.contentRect.width)
  }

  private handleSlotChange(event: Event): void {
    const slot = event.currentTarget
    if (!(slot instanceof HTMLSlotElement)) return
    const hasContent = slot
      .assignedNodes({ flatten: true })
      .some((node) =>
        node.nodeType === Node.TEXT_NODE
          ? Boolean(node.textContent?.trim())
          : node.nodeType === Node.ELEMENT_NODE,
      )

    switch (slot.name) {
      case '':
        this.hasNavigation = hasContent
        break
      case 'actions':
        this.hasActions = hasContent
        break
      case 'brand':
        this.hasBrand = hasContent
        break
      case 'context':
        this.hasContext = hasContent
        break
      case 'search':
        this.hasSearch = hasContent
        break
      case 'user':
        this.hasUser = hasContent
        break
      default:
        return
    }
    this.requestUpdate()
  }

  private syncResponsiveState(width: number): void {
    const wasCompact = this.compact
    if (width > 0) {
      this.compact = width <= 64 * 16
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      this.compact = window.matchMedia('(width <= 64rem)').matches
    }
    if (wasCompact && !this.compact && this.open) this.open = false
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-header')
) {
  customElements.define('cad-header', CadHeader)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-header': CadHeader
  }
}
