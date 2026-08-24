import { css, html, LitElement } from 'lit'

import '../icon/cad-icon.js'

export type CadSpinnerSize = 'lg' | 'md' | 'sm'
export type CadSpinnerTone = 'blue' | 'coral' | 'lemon' | 'mint' | 'violet'

/**
 * A compact, named progress indicator for indeterminate work.
 *
 * @slot - Accessible status text shown before the element upgrades.
 * @csspart base - Status container.
 * @csspart icon - Rotating notebook icon.
 * @csspart label - Visually hidden status text.
 * @cssprop --cad-spinner-ink - Per-instance spinner color.
 */
export class CadSpinner extends LitElement {
  static override properties = {
    label: { type: String },
    size: { reflect: true, type: String },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_spinner-ink: var(
        --cad-spinner-ink,
        var(--cad-post-it-blue-ink, #20375d)
      );
      display: inline-grid;
      color: var(--_spinner-ink);
      vertical-align: middle;
    }

    :host([tone='coral']) {
      --_spinner-ink: var(
        --cad-spinner-ink,
        var(--cad-post-it-coral-ink, #633b32)
      );
    }

    :host([tone='lemon']) {
      --_spinner-ink: var(
        --cad-spinner-ink,
        var(--cad-post-it-lemon-ink, #51491f)
      );
    }

    :host([tone='mint']) {
      --_spinner-ink: var(
        --cad-spinner-ink,
        var(--cad-post-it-mint-ink, #274f41)
      );
    }

    :host([tone='violet']) {
      --_spinner-ink: var(
        --cad-spinner-ink,
        var(--cad-sticker-violet-ink, #30205e)
      );
    }

    .base,
    .icon {
      display: inline-grid;
      place-items: center;
    }

    .icon {
      animation: spin 900ms steps(12, end) infinite;
    }

    .label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes spin {
      to {
        transform: rotate(1turn);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .icon {
        animation: none;
      }
    }

    @media (forced-colors: active) {
      :host {
        color: CanvasText;
      }
    }
  `

  declare label: string
  declare size: CadSpinnerSize
  declare tone: CadSpinnerTone

  constructor() {
    super()
    this.label = 'Loading'
    this.size = 'md'
    this.tone = 'blue'
  }

  override render() {
    const iconSize =
      this.size === 'sm' ? '18' : this.size === 'lg' ? '42' : '28'
    return html`
      <span aria-live="polite" class="base" part="base" role="status">
        <span aria-hidden="true" class="icon" part="icon">
          <cad-icon name="reset" size=${iconSize}></cad-icon>
        </span>
        <span class="label" part="label"><slot>${this.label}</slot></span>
      </span>
    `
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-spinner')
) {
  customElements.define('cad-spinner', CadSpinner)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-spinner': CadSpinner
  }
}
