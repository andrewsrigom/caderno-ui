import { css, html, LitElement } from 'lit'

import { renderSystemIcon } from '../internal/system-icon.js'

export type CadBookmarkChangeDetail = {
  active: boolean
  id: string
}

export type CadBookmarkChangeEvent = CustomEvent<CadBookmarkChangeDetail>

/**
 * A persistent, pressed-state bookmark control.
 *
 * @slot fallback - Optional pre-upgrade fallback hidden after definition.
 * @fires cad-bookmark-change - Fired whenever the bookmark state changes.
 * @csspart button - Native bookmark button.
 * @csspart icon - Bookmark icon.
 * @csspart label - Visible button label.
 * @cssprop --cad-bookmark-bg - Bookmark paper color.
 * @cssprop --cad-bookmark-ink - Bookmark foreground color.
 */
export class CadBookmark extends LitElement {
  static override properties = {
    activeLabel: { attribute: 'active-label', type: String },
    bookmarkId: { attribute: 'bookmark-id', type: String },
    bookmarked: { reflect: true, type: Boolean },
    label: { type: String },
    persist: { reflect: true, type: Boolean },
    storagePrefix: { attribute: 'storage-prefix', type: String },
  }

  static override styles = css`
    :host {
      --_bookmark-bg: var(
        --cad-bookmark-bg,
        var(--cad-post-it-blue-bg, #cfe2ff)
      );
      --_bookmark-ink: var(--cad-bookmark-ink, var(--cad-link, #005bac));
      display: inline-flex;
    }

    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      min-height: 2.75rem;
      padding: 0.35rem 0.35rem 0.42rem;
      color: var(--_bookmark-ink);
      background: transparent;
      border: 0;
      border-radius: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-regular, 500);
      line-height: 1.1;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    button::after {
      position: absolute;
      right: 0.2rem;
      bottom: 0.22rem;
      left: 2.2rem;
      height: 2px;
      background: var(--cad-post-it-coral-bg, #ff665c);
      content: '';
      opacity: 0.72;
      pointer-events: none;
      transform: rotate(-0.8deg) scaleX(0.72);
      transform-origin: left center;
      transition: transform var(--cad-duration-fast, 140ms) ease;
    }

    button:hover {
      background: color-mix(in srgb, var(--_bookmark-bg) 22%, transparent);
    }

    button:hover::after,
    button[aria-pressed='true']::after {
      transform: rotate(0.35deg) scaleX(1);
    }

    button[aria-pressed='true'] {
      background: color-mix(in srgb, var(--_bookmark-bg) 38%, transparent);
    }

    button:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }

    .icon {
      position: relative;
      width: 1.35rem;
      height: 1.35rem;
      transition: transform
        var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
        var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    .icon svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: transparent;
    }

    button[aria-pressed='true'] .icon {
      transform: translateY(0.1rem) rotate(-4deg);
    }

    button[aria-pressed='true'] .icon svg {
      fill: currentColor;
    }

    @media (prefers-reduced-motion: reduce) {
      .icon {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      button {
        border-color: ButtonText;
      }
    }

    slot[name='fallback'] {
      display: none;
    }
  `

  declare activeLabel: string
  declare bookmarkId: string
  declare bookmarked: boolean
  declare label: string
  declare persist: boolean
  declare storagePrefix: string

  constructor() {
    super()
    this.activeLabel = 'Remove bookmark'
    this.bookmarkId = ''
    this.bookmarked = false
    this.label = 'Save bookmark'
    this.persist = false
    this.storagePrefix = 'caderno-ui:bookmark'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.restore()
  }

  private get storageKey(): string {
    return `${this.storagePrefix}:${this.bookmarkId}`
  }

  private restore(): void {
    if (!this.persist || !this.bookmarkId) return

    try {
      this.bookmarked = localStorage.getItem(this.storageKey) === 'true'
    } catch {
      // The control remains session-functional when storage is unavailable.
    }
  }

  private toggle(): void {
    this.bookmarked = !this.bookmarked

    if (this.persist && this.bookmarkId) {
      try {
        localStorage.setItem(this.storageKey, String(this.bookmarked))
      } catch {
        // The visible state still changes when storage is unavailable.
      }
    }

    this.dispatchEvent(
      new CustomEvent<CadBookmarkChangeDetail>('cad-bookmark-change', {
        bubbles: true,
        composed: true,
        detail: {
          active: this.bookmarked,
          id: this.bookmarkId,
        },
      }),
    )
  }

  override render() {
    const visibleLabel = this.bookmarked ? this.activeLabel : this.label

    return html`
      <button
        aria-label=${visibleLabel}
        aria-pressed=${String(this.bookmarked)}
        part="button"
        type="button"
        @click=${this.toggle}
      >
        <span aria-hidden="true" class="icon" part="icon">
          ${renderSystemIcon('bookmark')}
        </span>
        <span part="label">${visibleLabel}</span>
      </button>
      <slot name="fallback"></slot>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-bookmark')
) {
  customElements.define('cad-bookmark', CadBookmark)
}

declare global {
  interface HTMLElementEventMap {
    'cad-bookmark-change': CadBookmarkChangeEvent
  }

  interface HTMLElementTagNameMap {
    'cad-bookmark': CadBookmark
  }
}
