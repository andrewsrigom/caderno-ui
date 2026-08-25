import { css, html, LitElement } from 'lit'

import {
  renderSystemIcon,
  type CadSystemIconName,
} from '../internal/system-icon.js'

export type CadCalloutVariant =
  'danger' | 'info' | 'success' | 'tip' | 'warning'

const defaults: Record<
  CadCalloutVariant,
  { heading: string; icon: CadSystemIconName }
> = {
  danger: { heading: 'Caution', icon: 'danger' },
  info: { heading: 'Note', icon: 'info' },
  success: { heading: 'Verified', icon: 'check' },
  tip: { heading: 'Tip', icon: 'tip' },
  warning: { heading: 'Attention', icon: 'warning' },
}

/**
 * A static notebook callout for supporting editorial content.
 *
 * Unlike `cad-alert`, this component does not create a live region.
 *
 * @slot - Callout body.
 * @slot icon - Optional visual that replaces the intrinsic variant mark.
 * @slot title - Visible heading. Falls back to the `heading` attribute.
 * @csspart base - Callout container.
 * @csspart content - Callout body.
 * @csspart icon - Callout icon.
 * @csspart stripe - Marker stripe.
 * @csspart title - Callout heading.
 * @cssprop --cad-callout-bg - Per-instance callout color.
 * @cssprop --cad-callout-ink - Per-instance foreground color.
 */
export class CadCallout extends LitElement {
  static override properties = {
    heading: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_callout-bg: var(--cad-callout-bg, var(--cad-post-it-blue-bg, #b8d5ff));
      --_callout-ink: var(
        --cad-callout-ink,
        var(--cad-post-it-blue-ink, #18345d)
      );
      display: block;
    }

    :host([variant='tip']) {
      --_callout-bg: var(
        --cad-callout-bg,
        var(--cad-post-it-lemon-bg, #fff1a8)
      );
      --_callout-ink: var(
        --cad-callout-ink,
        var(--cad-post-it-lemon-ink, #49370d)
      );
    }

    :host([variant='success']) {
      --_callout-bg: var(--cad-callout-bg, var(--cad-post-it-mint-bg, #a9eacb));
      --_callout-ink: var(
        --cad-callout-ink,
        var(--cad-post-it-mint-ink, #173d2c)
      );
    }

    :host([variant='warning']) {
      --_callout-bg: var(
        --cad-callout-bg,
        var(--cad-post-it-coral-bg, #ffb19f)
      );
      --_callout-ink: var(
        --cad-callout-ink,
        var(--cad-post-it-coral-ink, #55251b)
      );
    }

    :host([variant='danger']) {
      --_callout-bg: var(--cad-callout-bg, var(--cad-post-it-pink-bg, #ffb7d5));
      --_callout-ink: var(
        --cad-callout-ink,
        var(--cad-post-it-pink-ink, #52233a)
      );
    }

    .base {
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.85rem;
      padding: 1rem 1.15rem 1.1rem 1.35rem;
      color: var(--cad-ink, currentColor);
      background: color-mix(
        in srgb,
        var(--_callout-bg) 22%,
        var(--cad-surface-raised, white)
      );
      border: 1.5px dashed
        color-mix(in srgb, var(--_callout-ink) 38%, transparent);
      border-radius: 0.65rem 0.9rem 0.65rem 0.85rem;
    }

    .stripe {
      position: absolute;
      top: 0.7rem;
      bottom: 0.7rem;
      left: 0.5rem;
      width: 0.35rem;
      background: color-mix(in srgb, var(--_callout-bg) 82%, transparent);
      border-radius: 0.2rem;
      transform: rotate(-0.6deg);
    }

    .icon {
      display: inline-grid;
      place-items: center;
      width: 2.2rem;
      height: 2.2rem;
      margin-top: 0.15rem;
      color: var(--_callout-ink);
      background: color-mix(in srgb, var(--_callout-bg) 58%, transparent);
      border-radius: 52% 48% 55% 45%;
      transform: rotate(-4deg);
    }

    .icon svg {
      width: 1.35rem;
      height: 1.35rem;
    }

    .body {
      display: grid;
      gap: 0.35rem;
      min-width: 0;
    }

    .title {
      margin: 0;
      color: var(--_callout-ink);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.1;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .content {
      font-family: var(--cad-font-book, serif);
      line-height: 1.6;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    @media (forced-colors: active) {
      .base,
      .icon {
        border-color: CanvasText;
      }
    }
  `

  declare heading: string
  declare variant: CadCalloutVariant

  constructor() {
    super()
    this.heading = ''
    this.variant = 'info'
  }

  override render() {
    const definition = defaults[this.variant] ?? defaults.info
    const heading = this.heading || definition.heading

    return html`
      <aside class="base" part="base">
        <span aria-hidden="true" class="stripe" part="stripe"></span>
        <span aria-hidden="true" class="icon" part="icon">
          <slot name="icon">${renderSystemIcon(definition.icon)}</slot>
        </span>
        <div class="body">
          <div class="title" part="title">
            <slot name="title"><strong>${heading}</strong></slot>
          </div>
          <div class="content" part="content"><slot></slot></div>
        </div>
      </aside>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-callout')
) {
  customElements.define('cad-callout', CadCallout)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-callout': CadCallout
  }
}
