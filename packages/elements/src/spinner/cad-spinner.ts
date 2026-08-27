import { css, html, LitElement } from 'lit'

export type CadSpinnerSize = 'lg' | 'md' | 'sm' | 'xs'
export type CadSpinnerTone = 'amber' | 'blue' | 'mint' | 'neutral' | 'red'
export type CadSpinnerVariant =
  'bounce' | 'dashed' | 'dots' | 'gradient' | 'pulse' | 'ring' | 'segmented'

/**
 * A named, indeterminate status indicator with pen-drawn treatments.
 *
 * @slot - Accessible status text shown before the element upgrades.
 * @csspart base - Live status container.
 * @csspart icon - Animated visual indicator.
 * @csspart label - Visually hidden status text.
 * @cssprop --cad-spinner-ink - Per-instance active color.
 * @cssprop --cad-spinner-track - Per-instance track color.
 */
export class CadSpinner extends LitElement {
  static override properties = {
    label: { type: String },
    size: { reflect: true, type: String },
    tone: { reflect: true, type: String },
    variant: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_spinner-ink: var(--cad-spinner-ink, var(--cad-link, #005bac));
      --_spinner-track: var(
        --cad-spinner-track,
        color-mix(in srgb, var(--_spinner-ink) 22%, transparent)
      );
      --_spinner-size: 1.75rem;
      --_spinner-stroke: 2px;
      display: inline-flex;
      color: var(--_spinner-ink);
      vertical-align: middle;
    }

    :host([tone='mint']) {
      --_spinner-ink: var(--cad-spinner-ink, var(--cad-success-ink, #07875f));
    }

    :host([tone='amber']) {
      --_spinner-ink: var(--cad-spinner-ink, var(--cad-warning-ink, #e98212));
    }

    :host([tone='red']) {
      --_spinner-ink: var(--cad-spinner-ink, var(--cad-danger-ink, #f03c4f));
    }

    :host([tone='neutral']) {
      --_spinner-ink: var(--cad-spinner-ink, var(--cad-ink-muted, #6d7d9f));
    }

    :host([size='xs']) {
      --_spinner-size: 1rem;
      --_spinner-stroke: 1.5px;
    }

    :host([size='sm']) {
      --_spinner-size: 1.25rem;
      --_spinner-stroke: 1.75px;
    }

    :host([size='lg']) {
      --_spinner-size: 2.5rem;
      --_spinner-stroke: 3px;
    }

    .base {
      position: relative;
      display: inline-grid;
      place-items: center;
    }

    .visual {
      position: relative;
      box-sizing: border-box;
      display: inline-block;
      width: var(--_spinner-size);
      height: var(--_spinner-size);
      color: var(--_spinner-ink);
    }

    .visual::before,
    .visual::after {
      position: absolute;
      box-sizing: border-box;
      content: '';
    }

    :host([variant='ring']) .visual::before {
      inset: 0;
      background: repeating-conic-gradient(
        from -12deg,
        var(--_spinner-track) 0 5deg,
        color-mix(in srgb, var(--_spinner-track) 58%, transparent) 5deg 9deg
      );
      border-radius: 50% 47% 52% 48%;
      mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--_spinner-stroke) - 1px),
        #000 0
      );
      transform: rotate(-4deg);
    }

    :host([variant='ring']) .visual::after {
      inset: 0;
      border: var(--_spinner-stroke) solid transparent;
      border-top-color: currentColor;
      border-radius: 48% 52% 47% 53%;
      filter: drop-shadow(0.4px 0 currentColor);
      animation: spinner-turn 860ms steps(12, end) infinite;
    }

    :host([variant='dashed']) .visual {
      border: var(--_spinner-stroke) dashed currentColor;
      border-right-color: var(--_spinner-track);
      border-radius: 49% 52% 48% 51%;
      animation: spinner-turn 950ms linear infinite;
    }

    :host([variant='segmented']) .visual::before {
      inset: 0;
      background: repeating-conic-gradient(
        from -6deg,
        currentColor 0 12deg,
        transparent 12deg 45deg
      );
      border-radius: 50%;
      mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--_spinner-stroke) - 1px),
        #000 0
      );
      animation: spinner-turn 1s steps(8, end) infinite;
    }

    :host([variant='gradient']) .visual::before {
      inset: 0;
      border: var(--_spinner-stroke) solid var(--_spinner-track);
      border-radius: 51% 48% 52% 49%;
    }

    :host([variant='gradient']) .visual::after {
      inset: 0;
      background: conic-gradient(
        from -45deg,
        transparent 0 8%,
        color-mix(in srgb, currentColor 28%, transparent) 28%,
        currentColor 76%,
        transparent 78% 100%
      );
      border-radius: 50%;
      mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--_spinner-stroke) - 1px),
        #000 0
      );
      animation: spinner-turn 900ms linear infinite;
    }

    :host([variant='pulse']) .visual::before {
      inset: 34%;
      background: currentColor;
      border-radius: 47% 53% 49% 51%;
    }

    :host([variant='pulse']) .visual::after {
      inset: 9%;
      border: var(--_spinner-stroke) solid currentColor;
      border-radius: 52% 48% 51% 49%;
      animation: spinner-pulse 1.25s ease-out infinite;
    }

    .dot {
      display: none;
    }

    :host([variant='dots']) .visual,
    :host([variant='bounce']) .visual {
      display: flex;
      gap: 10%;
      align-items: center;
      justify-content: center;
      width: calc(var(--_spinner-size) + var(--_spinner-size));
    }

    :host([variant='dots']) .dot,
    :host([variant='bounce']) .dot {
      display: block;
      flex: 0 0 15%;
      aspect-ratio: 1;
      background: currentColor;
      border-radius: 46% 54% 48% 52%;
    }

    :host([variant='dots']) .dot {
      animation: spinner-dot 1.1s ease-in-out infinite;
    }

    :host([variant='dots']) .dot:nth-child(2),
    :host([variant='bounce']) .dot:nth-child(2) {
      animation-delay: 120ms;
    }

    :host([variant='dots']) .dot:nth-child(3),
    :host([variant='bounce']) .dot:nth-child(3) {
      animation-delay: 240ms;
    }

    :host([variant='dots']) .dot:nth-child(4) {
      animation-delay: 360ms;
    }

    :host([variant='bounce']) .dot {
      flex-basis: 18%;
      animation: spinner-bounce 850ms ease-in-out infinite alternate;
    }

    :host([variant='bounce']) .dot:nth-child(4) {
      display: none;
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

    @keyframes spinner-turn {
      to {
        transform: rotate(1turn);
      }
    }

    @keyframes spinner-dot {
      0%,
      100% {
        opacity: 0.24;
        transform: scale(0.78);
      }

      45% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes spinner-pulse {
      0% {
        opacity: 0.9;
        transform: scale(0.45);
      }

      100% {
        opacity: 0;
        transform: scale(1.18);
      }
    }

    @keyframes spinner-bounce {
      from {
        opacity: 0.45;
        transform: translateY(22%);
      }

      to {
        opacity: 1;
        transform: translateY(-22%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .visual,
      .visual::before,
      .visual::after,
      .dot {
        animation: none !important;
      }

      :host([variant='dots']) .dot,
      :host([variant='bounce']) .dot {
        opacity: 0.72;
        transform: none;
      }
    }

    @media (forced-colors: active) {
      :host {
        --_spinner-ink: CanvasText;
        --_spinner-track: GrayText;
        forced-color-adjust: none;
      }
    }
  `

  declare label: string
  declare size: CadSpinnerSize
  declare tone: CadSpinnerTone
  declare variant: CadSpinnerVariant

  constructor() {
    super()
    this.label = 'Loading'
    this.size = 'md'
    this.tone = 'blue'
    this.variant = 'ring'
  }

  override render() {
    return html`
      <span aria-live="polite" class="base" part="base" role="status">
        <span aria-hidden="true" class="visual" part="icon">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
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
