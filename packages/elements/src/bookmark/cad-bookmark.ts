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
        var(--cad-post-it-blue-bg, #293f64)
      );
      --_bookmark-ink: var(
        --cad-bookmark-ink,
        var(--cad-post-it-blue-ink, #deebff)
      );
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      min-height: 2.75rem;
      padding: 0.45rem 0.75rem 0.5rem 0.55rem;
      color: var(--_bookmark-ink);
      background: color-mix(
        in srgb,
        var(--_bookmark-bg) 32%,
        var(--cad-surface, #1f2335)
      );
      border: 1.5px dashed
        color-mix(in srgb, var(--_bookmark-ink) 45%, transparent);
      border-radius: 0.45rem 0.6rem 0.45rem 0.55rem;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
      font-weight: var(--cad-hand-weight-strong, 700);
    }

    button[aria-pressed='true'] {
      background: var(--_bookmark-bg);
      border-style: solid;
    }

    button:hover {
      background: color-mix(
        in srgb,
        var(--_bookmark-bg) 66%,
        var(--cad-surface, #1f2335)
      );
    }

    button:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, currentColor);
      outline-offset: 3px;
    }

    .icon {
      width: 1.35rem;
      height: 1.35rem;
      transition: transform
        var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
        var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
    }

    button[aria-pressed='true'] .icon {
      transform: translateY(0.15rem);
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
