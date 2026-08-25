import { css, html, LitElement } from 'lit'

export type CadStepsOrientation = 'horizontal' | 'vertical'
export type CadStepTone =
  'blue' | 'coral' | 'lemon' | 'mint' | 'pink' | 'violet'

/**
 * One numbered stage inside `cad-steps`.
 *
 * @slot - Step description or custom content.
 * @slot meta - Supporting duration, owner, or status.
 * @slot title - Visible title. Falls back to `title`.
 * @csspart content - Step content.
 * @csspart item - Accessible list item.
 * @csspart marker - Step marker.
 * @csspart meta - Supporting metadata.
 * @csspart title - Step title.
 */
export class CadStep extends LitElement {
  static override properties = {
    index: { attribute: false, state: true },
    title: { type: String },
    tone: { reflect: true, type: String },
    value: { type: String },
  }

  static override styles = css`
    :host {
      --_step-bg: var(--cad-post-it-blue-bg, #cfe2ff);
      --_step-ink: var(--cad-post-it-blue-ink, #20375d);
      display: block;
      min-width: 0;
    }

    :host([tone='coral']) {
      --_step-bg: var(--cad-post-it-coral-bg, #ffd8ce);
      --_step-ink: var(--cad-post-it-coral-ink, #633b32);
    }

    :host([tone='lemon']) {
      --_step-bg: var(--cad-post-it-lemon-bg, #fff1ac);
      --_step-ink: var(--cad-post-it-lemon-ink, #51491f);
    }

    :host([tone='mint']) {
      --_step-bg: var(--cad-post-it-mint-bg, #d8ffec);
      --_step-ink: var(--cad-post-it-mint-ink, #274f41);
    }

    :host([tone='pink']) {
      --_step-bg: var(--cad-post-it-pink-bg, #ffb7d5);
      --_step-ink: var(--cad-post-it-pink-ink, #52233a);
    }

    :host([tone='violet']) {
      --_step-bg: var(--cad-sticker-violet-bg, #bba0ff);
      --_step-ink: var(--cad-sticker-violet-ink, #30205e);
    }

    .item {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.8rem;
      align-items: start;
      min-width: 0;
    }

    .marker {
      display: inline-grid;
      place-items: center;
      min-width: 2.2rem;
      height: 2.2rem;
      padding-inline: 0.25rem;
      color: var(--_step-ink);
      background: var(--_step-bg);
      border: 1px solid color-mix(in srgb, var(--_step-ink) 42%, transparent);
      border-radius: 50% 47% 52% 46%;
      font-family: var(--cad-font-hand, cursive);
      font-weight: 700;
      transform: rotate(-2deg);
    }

    .content {
      display: grid;
      gap: 0.35rem;
      min-width: 0;
      padding-block: 0.18rem 0.8rem;
    }

    .title {
      color: var(--cad-ink, currentColor);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-lg, 1.55rem);
      font-weight: 700;
      line-height: 1.1;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .body {
      color: var(--cad-ink-muted, currentColor);
      font-family: var(--cad-font-book, serif);
      line-height: 1.55;
    }

    .meta {
      color: var(--_step-ink);
      font-family: var(--cad-font-hand, cursive);
      font-size: var(--cad-hand-sm, 1.05rem);
    }
  `

  declare index: number
  declare title: string
  declare tone: CadStepTone
  declare value: string

  constructor() {
    super()
    this.index = 1
    this.title = ''
    this.tone = 'blue'
    this.value = ''
  }

  override render() {
    return html`
      <div class="item" part="item" role="listitem">
        <span aria-hidden="true" class="marker" part="marker">
          ${this.value || this.index}
        </span>
        <div class="content" part="content">
          <div class="title" part="title">
            <slot name="title"><strong>${this.title}</strong></slot>
          </div>
          <div class="body"><slot></slot></div>
          <div class="meta" part="meta"><slot name="meta"></slot></div>
        </div>
      </div>
    `
  }
}

/**
 * A responsive ordered method, timeline, or preparation sequence.
 *
 * @slot - Direct `cad-step` children.
 * @csspart list - Accessible ordered-list container.
 */
export class CadSteps extends LitElement {
  static override properties = {
    label: { type: String },
    orientation: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
    }

    .list {
      display: grid;
      gap: 0.75rem;
    }

    :host([orientation='horizontal']) .list {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
    }

    @media (width <= 38rem) {
      :host([orientation='horizontal']) .list {
        grid-template-columns: 1fr;
      }
    }
  `

  declare label: string
  declare orientation: CadStepsOrientation

  constructor() {
    super()
    this.label = 'Steps'
    this.orientation = 'vertical'
  }

  override render() {
    return html`
      <div aria-label=${this.label} class="list" part="list" role="list">
        <slot @slotchange=${this.syncSteps}></slot>
      </div>
    `
  }

  private syncSteps = (): void => {
    Array.from(this.querySelectorAll<CadStep>(':scope > cad-step')).forEach(
      (step, index) => {
        step.index = index + 1
      },
    )
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-step'))
    customElements.define('cad-step', CadStep)
  if (!customElements.get('cad-steps')) {
    customElements.define('cad-steps', CadSteps)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cad-step': CadStep
    'cad-steps': CadSteps
  }
}
