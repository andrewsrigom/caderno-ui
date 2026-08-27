import { css, html, LitElement, nothing } from 'lit'

import { feedbackToneStyles } from '../internal/feedback-tone-styles.js'
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
  danger: { heading: 'Caution', icon: 'error' },
  info: { heading: 'Note', icon: 'info' },
  success: { heading: 'Verified', icon: 'success' },
  tip: { heading: 'Tip', icon: 'tip' },
  warning: { heading: 'Attention', icon: 'warning' },
}

/**
 * A static notebook callout for supporting editorial content.
 *
 * Unlike `cad-alert`, this component does not create a live region.
 *
 * @slot - Callout body.
 * @slot action - Optional supporting link or action.
 * @slot icon - Optional visual that replaces the intrinsic variant mark.
 * @slot title - Visible heading. Falls back to the `heading` attribute.
 * @csspart action - Callout action container.
 * @csspart base - Callout container.
 * @csspart content - Callout body.
 * @csspart icon - Callout icon.
 * @csspart stripe - Margin marker.
 * @csspart title - Callout heading.
 * @cssprop --cad-callout-bg - Per-instance callout paper color.
 * @cssprop --cad-callout-ink - Per-instance callout accent.
 */
export class CadCallout extends LitElement {
  static override properties = {
    heading: { type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = [
    feedbackToneStyles,
    css`
      :host {
        --_callout-accent: var(--cad-callout-ink, var(--_feedback-accent));
        --_callout-bg: var(
          --cad-callout-bg,
          color-mix(
            in srgb,
            var(--cad-surface-raised, #fff) 94%,
            var(--_feedback-tint)
          )
        );
        display: block;
      }

      .base {
        position: relative;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: 0.75rem;
        align-items: start;
        padding: 0.95rem 1.05rem 1rem 1.25rem;
        color: var(--cad-ink, #162033);
        background:
          linear-gradient(
            102deg,
            color-mix(in srgb, var(--_feedback-tint) 18%, transparent),
            transparent 62%
          ),
          var(--_callout-bg);
        border: 1.4px dashed var(--_callout-accent);
        border-radius: 0;
        font-family: var(--cad-font-hand, cursive);
      }

      .stripe {
        position: absolute;
        top: 0.55rem;
        bottom: 0.55rem;
        left: -0.35rem;
        width: 0.45rem;
        background: color-mix(
          in srgb,
          var(--_feedback-tint) 76%,
          var(--cad-surface-raised, #fff)
        );
        border: 1px solid
          color-mix(in srgb, var(--_callout-accent) 24%, transparent);
        transform: rotate(-0.4deg);
      }

      .icon {
        display: inline-grid;
        place-items: center;
        margin-top: 0.03rem;
        color: var(--_callout-accent);
      }

      .icon svg {
        width: 1.75rem;
        height: 1.75rem;
      }

      .body {
        display: grid;
        gap: 0.2rem;
        min-width: 0;
      }

      .title {
        margin: 0;
        color: var(--_callout-accent);
        font-size: var(--cad-hand-md, 1.12rem);
        font-weight: var(--cad-hand-weight-strong, 700);
        line-height: 1.15;
      }

      .title ::slotted(*) {
        margin: 0;
        font: inherit;
      }

      .content {
        font-size: var(--cad-hand-sm, 1rem);
        line-height: 1.45;
      }

      ::slotted(:first-child) {
        margin-top: 0;
      }

      ::slotted(:last-child) {
        margin-bottom: 0;
      }

      .action {
        display: inline-flex;
        align-items: center;
        align-self: center;
        justify-self: end;
      }

      ::slotted([slot='action']) {
        padding: 0.18rem 0.08rem 0.22rem;
        color: var(--cad-link, #005bac);
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: inset 0 -2px var(--cad-link-mark, #ff5c5c);
        font: inherit;
        text-decoration: none;
      }

      ::slotted([slot='action']:focus-visible) {
        outline: var(
          --cad-focus-outline,
          2px dashed var(--cad-focus-ring, #005bac)
        );
        outline-offset: 3px;
      }

      @media (max-width: 36rem) {
        .base {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .action {
          grid-column: 2;
          justify-self: start;
        }
      }

      @media (forced-colors: active) {
        .base,
        .stripe {
          border-color: CanvasText;
        }
      }
    `,
  ]

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
    const hasAction = this.querySelector('[slot="action"]') !== null

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
        ${
          hasAction
            ? html`<div class="action" part="action">
                <slot name="action"></slot>
              </div>`
            : nothing
        }
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
