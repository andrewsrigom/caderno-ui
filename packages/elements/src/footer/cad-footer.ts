import { css, html, LitElement, type PropertyValues } from 'lit'

export type CadFooterVariant = 'dark' | 'elevated' | 'light' | 'minimal'

export type CadFooterGroupToggleDetail = {
  expanded: boolean
  heading: string
}

export type CadFooterGroupToggleEvent = CustomEvent<CadFooterGroupToggleDetail>

let footerGroupId = 0

/**
 * A site-wide contentinfo landmark with composable brand, navigation, social,
 * supporting, and utility regions.
 *
 * @slot - Direct `cad-footer-group` navigation groups.
 * @slot aside - Optional supporting content beside navigation.
 * @slot back-to-top - Optional back-to-top action.
 * @slot bottom - Copyright, locale, status, and policy utilities.
 * @slot brand - Product identity, description, and optional newsletter form.
 * @slot social - Social profile links.
 * @csspart aside - Supporting content region.
 * @csspart bottom - Bottom utility bar.
 * @csspart brand - Brand and product context region.
 * @csspart groups - Primary footer navigation.
 * @csspart social - Social navigation.
 * @csspart surface - Semantic footer landmark and visual surface.
 * @csspart top - Main responsive grid.
 * @cssprop --cad-footer-accent - Per-instance ink and border accent.
 * @cssprop --cad-footer-border - Per-instance border color.
 * @cssprop --cad-footer-ink - Per-instance text color.
 * @cssprop --cad-footer-surface - Per-instance surface color.
 */
export class CadFooter extends LitElement {
  static override properties = {
    label: { type: String },
    linksLabel: { attribute: 'links-label', type: String },
    socialLabel: { attribute: 'social-label', type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_footer-accent: var(
        --cad-footer-accent,
        var(--cad-color-day-link, #005bac)
      );
      --_footer-border: var(--cad-footer-border, var(--_footer-accent));
      --_footer-ink: var(--cad-footer-ink, var(--cad-color-day-ink, #162033));
      --_footer-surface: var(
        --cad-footer-surface,
        var(--cad-color-day-surface, #fff)
      );
      --cad-focus-ring: var(--_footer-accent);
      --cad-ink: var(--_footer-ink);
      --cad-link: var(--_footer-accent);
      --cad-link-ink: var(--_footer-accent);
      --cad-surface: var(--_footer-surface);
      container-type: inline-size;
      display: block;
      min-width: 0;
      color: var(--_footer-ink);
    }

    :host([variant='dark']) {
      --_footer-accent: var(
        --cad-footer-accent,
        var(--cad-color-night-link, #a8b8ff)
      );
      --_footer-ink: var(--cad-footer-ink, var(--cad-color-night-ink, #e0e0ff));
      --_footer-surface: var(
        --cad-footer-surface,
        var(--cad-color-night-surface, #1f2335)
      );
      --cad-button-bg: color-mix(
        in srgb,
        var(--_footer-accent) 20%,
        var(--_footer-surface)
      );
      --cad-button-ink: var(--_footer-ink);
    }

    .surface {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      overflow: clip;
      color: var(--_footer-ink);
      background: var(--_footer-surface);
      border: var(--cad-border-width, 1.5px) var(--cad-border-style, dashed)
        var(--_footer-border);
      border-radius: 0;
      font-family: var(--cad-font-book, serif);
    }

    .surface::before {
      content: none;
    }

    .surface::after {
      position: absolute;
      z-index: 3;
      top: -1px;
      right: -1px;
      width: 3.35rem;
      height: 3.35rem;
      background: linear-gradient(
        225deg,
        transparent 0 48%,
        color-mix(in srgb, var(--_footer-accent) 20%, var(--_footer-surface))
          49% 69%,
        var(--_footer-surface) 70%
      );
      border-inline-start: 1px solid
        color-mix(in srgb, var(--_footer-border) 75%, transparent);
      border-block-end: 1px solid
        color-mix(in srgb, var(--_footer-border) 75%, transparent);
      clip-path: polygon(0 0, 100% 100%, 0 100%);
      content: '';
      pointer-events: none;
      transform: rotate(-1deg);
      transform-origin: top right;
    }

    :host([variant='elevated']) .surface {
      box-shadow: 0.45rem 0.5rem 0
        color-mix(in srgb, var(--_footer-accent) 10%, transparent);
    }

    :host([variant='minimal']) .surface {
      background: transparent;
      border-inline: 0;
    }

    :host([variant='minimal']) {
      --cad-ink: inherit;
      --cad-link: inherit;
      --cad-surface: inherit;
      --_footer-accent: var(--cad-footer-accent, var(--cad-link, #005bac));
      --_footer-ink: var(--cad-footer-ink, var(--cad-ink, #162033));
      --_footer-surface: var(--cad-footer-surface, var(--cad-surface, #fff));
    }

    :host([variant='minimal']) .surface::before,
    :host([variant='minimal']) .surface::after {
      display: none;
    }

    .top {
      display: grid;
      grid-template-columns:
        minmax(13rem, 1.15fr) minmax(20rem, 3fr)
        minmax(9rem, 0.8fr);
      gap: clamp(1.5rem, 4vw, 3.5rem);
      align-items: start;
      padding: clamp(1.5rem, 4vw, 2.75rem);
      padding-inline-end: clamp(3.8rem, 7vw, 5rem);
    }

    .top.no-aside {
      grid-template-columns: minmax(13rem, 1fr) minmax(20rem, 3fr);
    }

    .top.no-brand {
      grid-template-columns: minmax(20rem, 3fr) minmax(9rem, 0.8fr);
    }

    .top.no-brand.no-aside {
      grid-template-columns: minmax(0, 1fr);
    }

    .brand,
    .groups,
    .aside,
    .social {
      min-width: 0;
    }

    .groups {
      display: block;
    }

    .groups slot {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
      gap: clamp(1.25rem, 2.5vw, 2.5rem);
    }

    .aside {
      display: grid;
      gap: 1.5rem;
    }

    .social {
      min-width: 0;
    }

    .bottom {
      position: relative;
      display: flex;
      gap: 1rem 1.5rem;
      align-items: center;
      justify-content: space-between;
      min-width: 0;
      padding: 1rem clamp(1.5rem, 4vw, 2.75rem);
      border-top: 1px solid
        color-mix(in srgb, var(--_footer-border) 32%, transparent);
    }

    .bottom-main {
      min-width: 0;
    }

    .back-to-top {
      flex: none;
    }

    .surface [hidden] {
      display: none !important;
    }

    .top[hidden] + .bottom {
      border-top: 0;
    }

    ::slotted(cad-footer-group) {
      min-width: 0;
    }

    ::slotted([slot='brand']),
    ::slotted([slot='aside']),
    ::slotted([slot='social']),
    ::slotted([slot='bottom']) {
      min-width: 0;
      margin: 0;
    }

    @container (width <= 70rem) {
      .top,
      .top.no-aside,
      .top.no-brand {
        grid-template-columns: minmax(12rem, 1fr) minmax(20rem, 2.2fr);
      }

      .top.no-brand.no-aside {
        grid-template-columns: minmax(0, 1fr);
      }

      .aside {
        grid-column: 1 / -1;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
      }
    }

    @container (width <= 48rem) {
      .surface::after {
        width: 2.5rem;
        height: 2.5rem;
      }

      .top,
      .top.no-aside,
      .top.no-brand,
      .top.no-brand.no-aside {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1.35rem;
        padding: 1.4rem 1rem;
        padding-inline-end: 2.7rem;
      }

      .groups slot {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0;
      }

      .aside {
        display: grid;
        grid-column: auto;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
      }

      .bottom {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        padding: 0.9rem 1rem;
      }
    }

    @media (forced-colors: active) {
      .surface {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
      }

      .surface::after {
        display: none;
      }
    }
  `

  declare label: string
  declare linksLabel: string
  declare socialLabel: string
  declare variant: CadFooterVariant

  private hasAside = false
  private hasBackToTop = false
  private hasBottom = false
  private hasBrand = false
  private hasGroups = false
  private hasSocial = false

  constructor() {
    super()
    this.label = 'Site footer'
    this.linksLabel = 'Footer links'
    this.socialLabel = 'Social links'
    this.variant = 'light'
  }

  override render() {
    const showBottom = this.hasBottom || this.hasBackToTop
    const topClasses = [
      'top',
      this.hasAside || this.hasSocial ? '' : 'no-aside',
      this.hasBrand ? '' : 'no-brand',
    ]
      .filter(Boolean)
      .join(' ')

    return html`
      <footer aria-label=${this.label} class="surface" part="surface">
        <div
          class=${topClasses}
          ?hidden=${!this.hasBrand && !this.hasGroups && !this.hasAside && !this.hasSocial}
          part="top"
        >
          <div class="brand" ?hidden=${!this.hasBrand} part="brand">
            <slot name="brand" @slotchange=${this.handleNamedSlotChange}></slot>
          </div>
          <nav
            aria-label=${this.linksLabel}
            class="groups"
            ?hidden=${!this.hasGroups}
            part="groups"
          >
            <slot @slotchange=${this.handleNamedSlotChange}></slot>
          </nav>
          <div
            class="aside"
            ?hidden=${!this.hasAside && !this.hasSocial}
            part="aside"
          >
            <nav
              aria-label=${this.socialLabel}
              class="social"
              ?hidden=${!this.hasSocial}
              part="social"
            >
              <slot
                name="social"
                @slotchange=${this.handleNamedSlotChange}
              ></slot>
            </nav>
            <slot name="aside" @slotchange=${this.handleNamedSlotChange}></slot>
          </div>
        </div>
        <div class="bottom" ?hidden=${!showBottom} part="bottom">
          <div class="bottom-main">
            <slot
              name="bottom"
              @slotchange=${this.handleNamedSlotChange}
            ></slot>
          </div>
          <span class="back-to-top">
            <slot
              name="back-to-top"
              @slotchange=${this.handleNamedSlotChange}
            ></slot>
          </span>
        </div>
      </footer>
    `
  }

  private handleNamedSlotChange(event: Event): void {
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
        this.hasGroups = hasContent
        break
      case 'aside':
        this.hasAside = hasContent
        break
      case 'back-to-top':
        this.hasBackToTop = hasContent
        break
      case 'bottom':
        this.hasBottom = hasContent
        break
      case 'brand':
        this.hasBrand = hasContent
        break
      case 'social':
        this.hasSocial = hasContent
        break
      default:
        return
    }
    this.requestUpdate()
  }
}

/**
 * A named footer navigation group that becomes a disclosure on small screens.
 *
 * @slot - Links or other compact navigation content.
 * @slot heading - Optional rich heading. Falls back to the `heading` attribute.
 * @fires cad-footer-group-toggle - Fired when the mobile disclosure changes.
 * @csspart content - Collapsible group content.
 * @csspart heading - Group heading.
 * @csspart toggle - Mobile disclosure button.
 */
export class CadFooterGroup extends LitElement {
  static override properties = {
    heading: { type: String },
    mobile: { attribute: false, state: true },
    open: { reflect: true, type: Boolean },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      color: inherit;
    }

    .heading {
      margin: 0 0 0.8rem;
      color: var(--cad-link, #005bac);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.2;
      text-transform: uppercase;
    }

    .heading::after {
      display: block;
      width: min(3rem, 72%);
      height: 2px;
      margin-top: 0.28rem;
      background: var(--cad-post-it-coral-bg, #ff8d79);
      content: '';
      transform: rotate(-1.2deg);
      transform-origin: left center;
    }

    .heading span,
    .toggle {
      color: inherit;
      font: inherit;
      text-transform: inherit;
    }

    .toggle {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      width: 100%;
      min-height: 2.75rem;
      padding: 0.65rem 0;
      text-align: start;
      background: transparent;
      border: 0;
      border-radius: 0;
      cursor: pointer;
    }

    .toggle::after {
      flex: none;
      width: 0.75rem;
      height: 0.75rem;
      border-inline-end: 1.5px solid currentColor;
      border-block-end: 1.5px solid currentColor;
      content: '';
      transform: translateY(-0.15rem) rotate(45deg);
      transition: transform var(--cad-duration-fast, 140ms) ease;
    }

    :host([open]) .toggle::after {
      transform: translateY(0.2rem) rotate(225deg);
    }

    .toggle:focus-visible {
      outline: 1.5px dashed var(--cad-focus-ring, var(--cad-link, #005bac));
      outline-offset: 3px;
    }

    .content {
      display: grid;
      gap: 0.55rem;
      min-width: 0;
      font-family: var(--cad-font-book, serif);
      font-size: var(--cad-book-sm, 0.95rem);
      line-height: 1.4;
    }

    .content[hidden] {
      display: none;
    }

    ::slotted(a),
    ::slotted(cad-link) {
      display: block;
      width: fit-content;
      max-width: 100%;
    }

    .mobile {
      border-bottom: 1px solid
        color-mix(in srgb, var(--cad-link, #005bac) 25%, transparent);
    }

    .mobile .heading {
      margin: 0;
      font-size: var(--cad-hand-md, 1.2rem);
      text-transform: none;
    }

    .mobile .heading::after {
      display: none;
    }

    .mobile .content {
      padding: 0.2rem 0 0.9rem;
    }

    @media (forced-colors: active) {
      .heading,
      .toggle {
        color: CanvasText;
      }
    }
  `

  declare heading: string
  declare open: boolean
  declare private mobile: boolean

  private readonly contentId = `cad-footer-group-${++footerGroupId}`
  private resizeFrame = 0
  private resizeObserver: ResizeObserver | undefined

  constructor() {
    super()
    this.heading = 'Links'
    this.mobile = false
    this.open = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (typeof window === 'undefined') return
    this.resizeFrame = window.requestAnimationFrame(() => {
      const target = this.closest('cad-footer') ?? this
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(this.handleResize)
        this.resizeObserver.observe(target)
      }
      this.syncResponsiveState(target.getBoundingClientRect().width)
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
      new CustomEvent<CadFooterGroupToggleDetail>('cad-footer-group-toggle', {
        bubbles: true,
        composed: true,
        detail: { expanded: this.open, heading: this.heading },
      }),
    )
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('heading') && !this.heading.trim()) this.heading = 'Links'
  }

  override render() {
    const contentHidden = this.mobile && !this.open

    return html`
      <section class=${this.mobile ? 'mobile' : ''}>
        <h2 class="heading" part="heading">
          ${
            this.mobile
              ? html`<button
                  aria-controls=${this.contentId}
                  aria-expanded=${this.open ? 'true' : 'false'}
                  class="toggle"
                  part="toggle"
                  type="button"
                  @click=${this.handleToggle}
                >
                  <slot name="heading">${this.heading}</slot>
                </button>`
              : html`<span><slot name="heading">${this.heading}</slot></span>`
          }
        </h2>
        <div
          class="content"
          id=${this.contentId}
          ?hidden=${contentHidden}
          part="content"
        >
          <slot></slot>
        </div>
      </section>
    `
  }

  private handleResize = (entries: ResizeObserverEntry[]): void => {
    const entry = entries[0]
    if (entry) this.syncResponsiveState(entry.contentRect.width)
  }

  private syncResponsiveState(width: number): void {
    if (width > 0) {
      this.mobile = width <= 48 * 16
      return
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mobile = window.matchMedia('(width <= 48rem)').matches
    }
  }

  private handleToggle(): void {
    this.toggle()
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-footer')) {
    customElements.define('cad-footer', CadFooter)
  }
  if (!customElements.get('cad-footer-group')) {
    customElements.define('cad-footer-group', CadFooterGroup)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-footer': CadFooter
    'cad-footer-group': CadFooterGroup
  }
}
