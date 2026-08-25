import { css, html, LitElement } from 'lit'

export type CadPaperElevation = 'flat' | 'raised'
export type CadPaperPattern = 'blank' | 'dotted' | 'grid' | 'ruled'
export type CadPaperSpacing = 'compact' | 'regular' | 'spacious'
export type CadPaperTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'paper' | 'pink' | 'violet'

/**
 * A neutral notebook surface for composing application-owned content.
 *
 * @slot - Paper content. Use native landmarks and headings when they are meaningful.
 * @csspart base - Paper surface.
 * @csspart content - Content wrapper.
 * @csspart margin-line - Decorative notebook margin.
 * @cssprop --cad-paper-bg - Per-instance paper color.
 * @cssprop --cad-paper-ink - Per-instance foreground color.
 * @cssprop --cad-paper-line - Pattern line or dot color.
 * @cssprop --cad-paper-margin - Margin rule color.
 * @cssprop --cad-paper-step - Distance between pattern lines or dots.
 */
export class CadPaper extends LitElement {
  static override properties = {
    elevation: { reflect: true, type: String },
    margin: { reflect: true, type: Boolean },
    pattern: { reflect: true, type: String },
    spacing: { reflect: true, type: String },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_paper-bg: var(--cad-paper-bg, var(--cad-surface-raised, #fffdf7));
      --_paper-ink: var(--cad-paper-ink, var(--cad-ink, #25202a));
      --_paper-line: var(
        --cad-paper-line,
        color-mix(in srgb, var(--_paper-ink) 14%, transparent)
      );
      --_paper-margin: var(
        --cad-paper-margin,
        color-mix(
          in srgb,
          var(--cad-post-it-coral-ink, #633b32) 38%,
          transparent
        )
      );
      --_paper-step: var(--cad-paper-step, 1.75rem);
      --_paper-padding-block: 1.25rem;
      --_paper-padding-inline: 1.35rem;
      display: block;
    }

    :host([spacing='compact']) {
      --_paper-padding-block: 0.85rem;
      --_paper-padding-inline: 1rem;
    }

    :host([spacing='spacious']) {
      --_paper-padding-block: 1.85rem;
      --_paper-padding-inline: 2rem;
    }

    :host([tone='blue']) {
      --_paper-bg: var(
        --cad-paper-bg,
        color-mix(
          in srgb,
          var(--cad-post-it-blue-bg, #cfe2ff) 46%,
          var(--cad-surface-raised, white)
        )
      );
      --_paper-ink: var(--cad-paper-ink, var(--cad-post-it-blue-ink, #20375d));
    }

    :host([tone='coral']) {
      --_paper-bg: var(
        --cad-paper-bg,
        color-mix(
          in srgb,
          var(--cad-post-it-coral-bg, #ffd8ce) 45%,
          var(--cad-surface-raised, white)
        )
      );
      --_paper-ink: var(--cad-paper-ink, var(--cad-post-it-coral-ink, #633b32));
    }

    :host([tone='lemon']) {
      --_paper-bg: var(
        --cad-paper-bg,
        color-mix(
          in srgb,
          var(--cad-post-it-lemon-bg, #fff1ac) 48%,
          var(--cad-surface-raised, white)
        )
      );
      --_paper-ink: var(--cad-paper-ink, var(--cad-post-it-lemon-ink, #51491f));
    }

    :host([tone='mint']) {
      --_paper-bg: var(
        --cad-paper-bg,
        color-mix(
          in srgb,
          var(--cad-post-it-mint-bg, #d8ffec) 44%,
          var(--cad-surface-raised, white)
        )
      );
      --_paper-ink: var(--cad-paper-ink, var(--cad-post-it-mint-ink, #274f41));
    }

    :host([tone='pink']) {
      --_paper-bg: var(
        --cad-paper-bg,
        color-mix(
          in srgb,
          var(--cad-post-it-pink-bg, #ffb7d5) 37%,
          var(--cad-surface-raised, white)
        )
      );
      --_paper-ink: var(--cad-paper-ink, var(--cad-post-it-pink-ink, #52233a));
    }

    :host([tone='violet']) {
      --_paper-bg: var(
        --cad-paper-bg,
        color-mix(
          in srgb,
          var(--cad-sticker-violet-bg, #bba0ff) 32%,
          var(--cad-surface-raised, white)
        )
      );
      --_paper-ink: var(
        --cad-paper-ink,
        var(--cad-sticker-violet-ink, #30205e)
      );
    }

    .base {
      position: relative;
      min-height: 100%;
      overflow: hidden;
      color: var(--_paper-ink);
      background-color: var(--_paper-bg);
      border: 1px solid color-mix(in srgb, var(--_paper-ink) 18%, transparent);
      border-radius: 0.3rem 0.65rem 0.45rem 0.55rem;
    }

    :host([elevation='raised']) .base {
      box-shadow:
        0 0.9rem 1.8rem rgb(var(--cad-shadow-rgb, 0 0 0) / 0.1),
        0.2rem 0.18rem 0 color-mix(in srgb, var(--_paper-ink) 8%, transparent);
      transform: rotate(-0.12deg);
    }

    :host([pattern='ruled']) .base {
      background-image: repeating-linear-gradient(
        to bottom,
        transparent 0 calc(var(--_paper-step) - 1px),
        var(--_paper-line) calc(var(--_paper-step) - 1px) var(--_paper-step)
      );
    }

    :host([pattern='grid']) .base {
      background-image:
        repeating-linear-gradient(
          to bottom,
          transparent 0 calc(var(--_paper-step) - 1px),
          var(--_paper-line) calc(var(--_paper-step) - 1px) var(--_paper-step)
        ),
        repeating-linear-gradient(
          to right,
          transparent 0 calc(var(--_paper-step) - 1px),
          var(--_paper-line) calc(var(--_paper-step) - 1px) var(--_paper-step)
        );
    }

    :host([pattern='dotted']) .base {
      background-image: radial-gradient(
        circle,
        var(--_paper-line) 1.15px,
        transparent 1.35px
      );
      background-position: calc(var(--_paper-step) / 2)
        calc(var(--_paper-step) / 2);
      background-size: var(--_paper-step) var(--_paper-step);
    }

    .content {
      position: relative;
      z-index: 1;
      min-width: 0;
      padding: var(--_paper-padding-block) var(--_paper-padding-inline);
      font-family: var(--cad-font-book, serif);
      line-height: var(--_paper-step);
    }

    :host([margin]) .content {
      padding-inline-start: calc(var(--_paper-padding-inline) + 2rem);
    }

    .margin-line {
      position: absolute;
      z-index: 0;
      inset-block: 0;
      inset-inline-start: calc(var(--_paper-padding-inline) + 0.75rem);
      display: none;
      width: 1px;
      background: var(--_paper-margin);
      box-shadow: 3px 0 0
        color-mix(in srgb, var(--_paper-margin) 42%, transparent);
    }

    :host([margin]) .margin-line {
      display: block;
    }

    ::slotted(:first-child) {
      margin-top: 0;
    }

    ::slotted(:last-child) {
      margin-bottom: 0;
    }

    @media (forced-colors: active) {
      .base {
        border-color: CanvasText;
      }

      .margin-line {
        background: CanvasText;
      }
    }
  `

  declare elevation: CadPaperElevation
  declare margin: boolean
  declare pattern: CadPaperPattern
  declare spacing: CadPaperSpacing
  declare tone: CadPaperTone

  constructor() {
    super()
    this.elevation = 'flat'
    this.margin = false
    this.pattern = 'ruled'
    this.spacing = 'regular'
    this.tone = 'paper'
  }

  override render() {
    return html`
      <div class="base" part="base">
        <span aria-hidden="true" class="margin-line" part="margin-line"></span>
        <div class="content" part="content"><slot></slot></div>
      </div>
    `
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-paper')) {
  customElements.define('cad-paper', CadPaper)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-paper': CadPaper
  }
}
