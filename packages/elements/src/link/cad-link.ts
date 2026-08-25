import { css, html, LitElement, nothing } from 'lit'

export type CadLinkTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'
export type CadLinkVariant = 'highlight' | 'plain' | 'underline'

/**
 * A notebook link with marker and hand-drawn underline treatments.
 *
 * @slot - Link label.
 * @csspart base - Native anchor.
 * @csspart external - External-link indicator.
 * @cssprop --cad-link-mark - Per-instance marker color.
 * @cssprop --cad-link-ink - Per-instance text color.
 */
export class CadLink extends LitElement {
  static override properties = {
    external: { reflect: true, type: Boolean },
    href: { type: String },
    label: { type: String },
    rel: { type: String },
    target: { type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_link-mark: var(--cad-link-mark, var(--cad-post-it-blue-bg, #b8d5ff));
      --_link-accent: var(--cad-post-it-blue-ink, #18345d);
      display: inline;
    }

    :host([tone='coral']) {
      --_link-mark: var(--cad-link-mark, var(--cad-post-it-coral-bg, #ffb19f));
      --_link-accent: var(--cad-post-it-coral-ink, #55251b);
    }

    :host([tone='lemon']) {
      --_link-mark: var(--cad-link-mark, var(--cad-post-it-lemon-bg, #fff1a8));
      --_link-accent: var(--cad-post-it-lemon-ink, #49370d);
    }

    :host([tone='mint']) {
      --_link-mark: var(--cad-link-mark, var(--cad-post-it-mint-bg, #a9eacb));
      --_link-accent: var(--cad-post-it-mint-ink, #173d2c);
    }

    :host([tone='pink']) {
      --_link-mark: var(--cad-link-mark, var(--cad-post-it-pink-bg, #ffb7d5));
      --_link-accent: var(--cad-post-it-pink-ink, #52233a);
    }

    :host([tone='violet']) {
      --_link-mark: var(--cad-link-mark, var(--cad-sticker-violet-bg, #bba0ff));
      --_link-accent: var(--cad-sticker-violet-ink, #30205e);
    }

    .base {
      padding-inline: 0.12rem;
      color: var(--cad-link-ink, var(--cad-ink, currentColor));
      text-decoration: none;
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: 100% 100%;
      border-radius: 0.15rem;
      box-decoration-break: clone;
      transition: background-size
        var(--cad-motion-duration-feedback, var(--cad-duration-fast, 140ms))
        var(--cad-motion-ease-feedback, var(--cad-transition-smooth, ease));
      -webkit-box-decoration-break: clone;
    }

    :host([variant='highlight']) .base {
      background-image: linear-gradient(
        180deg,
        transparent 68%,
        color-mix(in srgb, var(--_link-mark) 68%, transparent) 69%,
        color-mix(in srgb, var(--_link-mark) 68%, transparent) 92%,
        transparent 93%
      );
    }

    :host([variant='highlight']) .base:hover {
      background-image: linear-gradient(
        180deg,
        transparent 55%,
        color-mix(in srgb, var(--_link-mark) 84%, transparent) 56%,
        color-mix(in srgb, var(--_link-mark) 84%, transparent) 92%,
        transparent 93%
      );
    }

    :host([variant='underline']) .base {
      padding-inline: 0;
      background-image: linear-gradient(
        180deg,
        transparent 92%,
        color-mix(in srgb, var(--_link-accent) 70%, transparent) 93%,
        color-mix(in srgb, var(--_link-accent) 70%, transparent) 96%,
        transparent 97%
      );
    }

    :host([variant='plain']) .base {
      padding-inline: 0;
      color: var(--_link-accent);
      text-decoration: underline;
      text-decoration-style: wavy;
      text-underline-offset: 0.2em;
    }

    :host([variant='plain']) .base:hover {
      text-decoration-thickness: 0.14em;
    }

    .base:focus-visible {
      outline: 2px dashed var(--cad-focus-ring, var(--_link-accent));
      outline-offset: 3px;
    }

    .external {
      display: inline-block;
      margin-inline-start: 0.15rem;
      color: var(--_link-accent);
      font-size: 0.8em;
      line-height: 1;
      vertical-align: super;
    }

    @media (forced-colors: active) {
      .base {
        color: LinkText;
        text-decoration: underline;
      }
    }
  `

  declare external: boolean
  declare href: string
  declare label: string
  declare rel: string
  declare target: string
  declare tone: CadLinkTone
  declare variant: CadLinkVariant

  constructor() {
    super()
    this.external = false
    this.href = ''
    this.label = ''
    this.rel = ''
    this.target = ''
    this.tone = 'blue'
    this.variant = 'highlight'
  }

  override render() {
    const target = this.target || (this.external ? '_blank' : '')
    const rel = this.rel || (this.external ? 'noopener noreferrer' : '')

    return html`
      <a
        aria-label=${this.label || nothing}
        class="base"
        href=${this.href || nothing}
        part="base"
        rel=${rel || nothing}
        target=${target || nothing}
      >
        <slot></slot>
        ${
          this.external
            ? html`<span aria-hidden="true" class="external" part="external"
                >↗</span
              >`
            : nothing
        }
      </a>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-link')) {
  customElements.define('cad-link', CadLink)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-link': CadLink
  }
}
