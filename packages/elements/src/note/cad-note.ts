import { css, html, LitElement } from 'lit'

export type CadNoteTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'paper' | 'pink' | 'violet'

/**
 * A notebook-styled note for grouping supporting content.
 *
 * @slot - Note body content.
 * @slot title - Visible note heading. Falls back to the `heading` attribute.
 * @slot footer - Supporting actions or metadata.
 * @csspart base - Note container.
 * @csspart content - Note body.
 * @csspart footer - Note footer.
 * @csspart tape - Decorative tape.
 * @csspart title - Note heading.
 * @cssprop --cad-note-bg - Per-instance paper color.
 * @cssprop --cad-note-ink - Per-instance foreground color.
 */
export class CadNote extends LitElement {
  static override properties = {
    folded: { reflect: true, type: Boolean },
    heading: { type: String },
    tone: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_note-bg: var(--cad-note-bg, var(--cad-surface-raised, #f7f0dc));
      --_note-ink: var(--cad-note-ink, var(--cad-ink, #25202a));
      display: block;
      width: min(100%, 20rem);
    }

    :host([tone='blue']) {
      --_note-bg: var(--cad-note-bg, var(--cad-post-it-blue-bg, #cfe2ff));
      --_note-ink: var(--cad-note-ink, var(--cad-post-it-blue-ink, #20375d));
    }

    :host([tone='coral']) {
      --_note-bg: var(--cad-note-bg, var(--cad-post-it-coral-bg, #ffd8ce));
      --_note-ink: var(--cad-note-ink, var(--cad-post-it-coral-ink, #633b32));
    }

    :host([tone='lemon']) {
      --_note-bg: var(--cad-note-bg, var(--cad-post-it-lemon-bg, #fff1ac));
      --_note-ink: var(--cad-note-ink, var(--cad-post-it-lemon-ink, #51491f));
    }

    :host([tone='mint']) {
      --_note-bg: var(--cad-note-bg, var(--cad-post-it-mint-bg, #d8ffec));
      --_note-ink: var(--cad-note-ink, var(--cad-post-it-mint-ink, #274f41));
    }

    :host([tone='pink']) {
      --_note-bg: var(--cad-note-bg, var(--cad-post-it-pink-bg, #ffb7d5));
      --_note-ink: var(--cad-note-ink, var(--cad-post-it-pink-ink, #52233a));
    }

    :host([tone='violet']) {
      --_note-bg: var(--cad-note-bg, var(--cad-sticker-violet-bg, #bba0ff));
      --_note-ink: var(--cad-note-ink, var(--cad-sticker-violet-ink, #30205e));
    }

    .base {
      position: relative;
      display: grid;
      gap: 0.45rem;
      padding: 1.5rem;
      overflow: visible;
      color: var(--_note-ink);
      background: color-mix(
        in srgb,
        var(--_note-bg) 90%,
        var(--cad-surface, white)
      );
      border: 0;
      border-radius: 0;
      box-shadow: 0.65rem 0.75rem 0 rgb(var(--cad-shadow-rgb, 0 0 0) / 0.13);
    }

    :host([folded]) .base::after {
      position: absolute;
      right: -0.1rem;
      bottom: -0.1rem;
      width: 2.2rem;
      height: 2.2rem;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--_note-bg) 58%, transparent) 49%,
        color-mix(in srgb, var(--_note-ink) 18%, var(--_note-bg)) 51%
      );
      border-start-start-radius: 0;
      content: '';
    }

    .tape {
      position: absolute;
      top: -0.35rem;
      left: 50%;
      width: 4.5rem;
      height: 1rem;
      background: color-mix(
        in srgb,
        var(--cad-tape-paper-bg, #eee5bf) 72%,
        transparent
      );
      transform: translateX(-50%) rotate(-1.2deg);
    }

    .title {
      margin: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-md, 1.2rem);
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.05;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .content {
      min-width: 0;
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
      line-height: 1.25;
    }

    .footer {
      font-family: var(--cad-font-ui, sans-serif);
      font-size: 0.9em;
    }

    .footer[hidden] {
      display: none;
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

      .tape {
        border: 1px solid CanvasText;
      }
    }
  `

  declare folded: boolean
  declare heading: string
  declare tone: CadNoteTone

  constructor() {
    super()
    this.folded = false
    this.heading = 'Note'
    this.tone = 'lemon'
  }

  override render() {
    return html`
      <section class="base" part="base" role="note">
        <span aria-hidden="true" class="tape" part="tape"></span>
        <div class="title" part="title">
          <slot name="title"><strong>${this.heading}</strong></slot>
        </div>
        <div class="content" part="content"><slot></slot></div>
        <div
          class="footer"
          ?hidden=${!this.querySelector('[slot="footer"]')}
          part="footer"
        >
          <slot name="footer" @slotchange=${this.handleFooterChange}></slot>
        </div>
      </section>
    `
  }

  private handleFooterChange(event: Event): void {
    const slot = event.target as HTMLSlotElement
    slot.parentElement?.toggleAttribute(
      'hidden',
      slot.assignedNodes({ flatten: true }).length === 0,
    )
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-note')) {
  customElements.define('cad-note', CadNote)
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-note': CadNote
  }
}
