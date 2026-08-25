import { css, html, LitElement } from 'lit'

export type CadAvatarSize = 'lg' | 'md' | 'sm'
export type CadAvatarStatus = 'away' | 'offline' | 'online'

/**
 * A compact identity with initials or a decorative portrait and optional status.
 *
 * @slot image - Custom portrait content.
 * @slot name - Visible name. Falls back to the `name` attribute.
 * @slot description - Supporting text. Falls back to the `description` attribute.
 * @csspart base - Identity container.
 * @csspart copy - Name and description stack.
 * @csspart description - Supporting text.
 * @csspart image - Portrait surface.
 * @csspart name - Visible name.
 * @csspart status - Presence indicator.
 */
export class CadAvatar extends LitElement {
  static override properties = {
    description: { type: String },
    name: { type: String },
    size: { reflect: true, type: String },
    src: { type: String },
    status: { reflect: true, type: String },
    statusLabel: { attribute: 'status-label', type: String },
  }

  static override styles = css`
    :host {
      --_avatar-size: 3rem;
      display: inline-flex;
      max-width: 100%;
    }
    :host([size='sm']) {
      --_avatar-size: 2.25rem;
    }
    :host([size='lg']) {
      --_avatar-size: 4.25rem;
    }
    .base {
      display: inline-flex;
      gap: 0.75rem;
      align-items: center;
      min-width: 0;
      max-width: 100%;
      color: var(--cad-ink, currentColor);
    }
    .image {
      position: relative;
      display: inline-grid;
      flex: 0 0 auto;
      place-items: center;
      width: var(--_avatar-size);
      height: var(--_avatar-size);
      color: var(--cad-post-it-blue-ink, #20375d);
      overflow: visible;
      background: var(--cad-post-it-blue-bg, #cfe2ff);
      border: 2px solid color-mix(in srgb, currentColor 42%, transparent);
      border-radius: 52% 48% 54% 46%;
      font-family: var(--cad-font-hand, cursive);
      font-size: calc(var(--_avatar-size) * 0.4);
      font-weight: var(--cad-hand-weight-strong, 700);
    }
    img,
    ::slotted(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    .status {
      position: absolute;
      right: -0.05rem;
      bottom: -0.05rem;
      width: calc(var(--_avatar-size) * 0.27);
      height: calc(var(--_avatar-size) * 0.27);
      background: var(--cad-ink-muted, #777);
      border: 2px solid var(--cad-surface, #fff);
      border-radius: 50%;
    }
    :host([status='online']) .status {
      background: var(--cad-post-it-mint-bg, #a9eacb);
    }
    :host([status='away']) .status {
      background: var(--cad-post-it-lemon-bg, #fff1a8);
    }
    .copy {
      display: grid;
      min-width: 0;
    }
    .name,
    .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name {
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.05;
    }
    .description {
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-ui, sans-serif);
      font-size: 0.78rem;
    }
    @media (forced-colors: active) {
      .image,
      .status {
        border-color: CanvasText;
      }
    }
  `

  declare description: string
  declare name: string
  declare size: CadAvatarSize
  declare src: string
  declare status: CadAvatarStatus | ''
  declare statusLabel: string

  constructor() {
    super()
    this.description = ''
    this.name = ''
    this.size = 'md'
    this.src = ''
    this.status = ''
    this.statusLabel = ''
  }

  override render() {
    const initials = this.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
    return html`
      <span class="base" part="base">
        <span class="image" part="image"
          ><slot name="image"
            >${this.src ? html`<img alt="" src=${this.src} />` : initials}</slot
          >${this.status ? html`<span aria-label=${this.statusLabel || this.status} class="status" part="status" role="img"></span>` : null}</span
        >
        <span class="copy" part="copy"
          ><strong class="name" part="name"
            ><slot name="name">${this.name}</slot></strong
          >${this.description ? html`<small class="description" part="description"><slot name="description">${this.description}</slot></small>` : html`<slot name="description"></slot>`}</span
        >
      </span>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-avatar'))
  customElements.define('cad-avatar', CadAvatar)

declare global {
  interface HTMLElementTagNameMap {
    'cad-avatar': CadAvatar
  }
}
