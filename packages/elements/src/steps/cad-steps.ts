import { css, html, LitElement, nothing, type PropertyValues } from 'lit'

export type CadStepsOrientation = 'horizontal' | 'vertical'
export type CadStepStatus =
  'complete' | 'current' | 'disabled' | 'error' | 'pending' | 'warning'

const defaultStatusLabels: Record<CadStepStatus, string> = {
  complete: 'Complete',
  current: 'Current',
  disabled: 'Disabled',
  error: 'Error',
  pending: 'Pending',
  warning: 'Needs attention',
}

/**
 * One stateful stage inside `cad-steps`.
 *
 * @slot - Step description or custom content.
 * @slot marker - Optional marker override.
 * @slot meta - Supporting duration, owner, or timing.
 * @slot status - Optional visible status label.
 * @slot title - Visible title. Falls back to `title`.
 * @csspart content - Step content.
 * @csspart connector - Decorative line to the next step.
 * @csspart item - Accessible list item.
 * @csspart marker - Status and order marker.
 * @csspart meta - Supporting metadata.
 * @csspart status - Visible status label container.
 * @csspart title - Step title.
 * @cssprop --cad-step-accent - Per-instance state color.
 * @cssprop --cad-step-track - Per-instance connector color.
 */
export class CadStep extends LitElement {
  static override properties = {
    index: { attribute: false, state: true },
    setSize: { attribute: false, state: true },
    status: { reflect: true, type: String },
    statusLabel: { attribute: 'status-label', type: String },
    title: { type: String },
    value: { type: String },
  }

  static override styles = css`
    :host {
      --_step-accent: var(--cad-step-accent, var(--cad-ink-muted, #7d879a));
      --_step-track: var(
        --cad-step-track,
        color-mix(in srgb, var(--_step-accent) 55%, transparent)
      );
      display: block;
      min-width: 0;
      color: var(--_step-accent);
    }

    :host([status='complete']) {
      --_step-accent: var(--cad-step-accent, var(--cad-success-ink, #07875f));
    }

    :host([status='current']) {
      --_step-accent: var(--cad-step-accent, var(--cad-link, #005bac));
    }

    :host([status='warning']) {
      --_step-accent: var(--cad-step-accent, var(--cad-warning-ink, #e98212));
    }

    :host([status='error']) {
      --_step-accent: var(--cad-step-accent, var(--cad-danger-ink, #f03c4f));
    }

    :host([status='disabled']) {
      --_step-accent: var(--cad-step-accent, #9aa3b1);
      opacity: 0.58;
    }

    .item {
      position: relative;
      display: grid;
      grid-template-columns: 2.25rem minmax(0, 1fr);
      gap: 0.85rem;
      align-items: start;
      min-width: 0;
    }

    .marker {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      display: inline-grid;
      place-items: center;
      justify-self: start;
      width: 2.15rem;
      height: 2.15rem;
      color: var(--_step-accent);
      background: color-mix(
        in srgb,
        var(--_step-accent) 7%,
        var(--cad-surface-raised, #fff)
      );
      border: 1.5px solid currentColor;
      border-radius: 51% 48% 52% 47%;
      font-family: var(--cad-font-hand, cursive);
      font-size: 1rem;
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1;
      transform: rotate(-1.3deg);
    }

    :host([status='complete']) .marker,
    :host([status='current']) .marker {
      box-shadow: inset 0 0 0 1px
        color-mix(in srgb, currentColor 18%, transparent);
    }

    :host([status='disabled']) .marker {
      border-style: dashed;
    }

    .marker ::slotted(*) {
      width: 1.15rem;
      height: 1.15rem;
      color: inherit;
    }

    .connector {
      position: absolute;
      z-index: 0;
      top: 2.12rem;
      bottom: -0.2rem;
      left: 1.04rem;
      width: 2px;
      background: repeating-linear-gradient(
        to bottom,
        var(--_step-track) 0 0.35rem,
        transparent 0.35rem 0.58rem
      );
      transform: rotate(-0.35deg);
    }

    :host([status='complete']) .connector,
    :host([status='current']) .connector {
      background: var(--_step-track);
    }

    :host([data-last-step]) .connector {
      display: none;
    }

    .content {
      display: grid;
      gap: 0.35rem;
      min-width: 0;
      padding: 0.15rem 0 1.25rem;
      border-bottom: 1px solid var(--cad-line, #d7deea);
    }

    :host([data-last-step]) .content {
      padding-bottom: 0.15rem;
      border-bottom: 0;
    }

    .heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.75rem;
      align-items: start;
    }

    .title {
      color: var(--cad-link, #005bac);
      font-family: var(--cad-font-hand, cursive);
      font-size: 1.05rem;
      font-weight: var(--cad-hand-weight-strong, 700);
      line-height: 1.2;
    }

    .title ::slotted(*) {
      margin: 0;
      font: inherit;
    }

    .status {
      color: var(--_step-accent);
      font-family: var(--cad-font-hand, cursive);
      font-size: 0.72rem;
      line-height: 1;
    }

    .status ::slotted(*) {
      display: inline-flex;
      align-items: center;
      min-height: 1.4rem;
      padding: 0.12rem 0.5rem 0.16rem;
      color: inherit;
      border: 1px solid currentColor;
      border-radius: 0;
      font: inherit;
      white-space: nowrap;
    }

    .body {
      color: var(--cad-ink, #162033);
      font-family: var(--cad-font-book, serif);
      font-size: 0.92rem;
      line-height: 1.5;
    }

    .meta {
      color: var(--cad-ink-muted, #68738c);
      font-family: var(--cad-font-hand, cursive);
      font-size: 0.78rem;
      line-height: 1.3;
    }

    .state-label {
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

    :host([data-orientation='horizontal']) .item {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    :host([data-orientation='horizontal']) .connector {
      top: 1.04rem;
      right: -1.5rem;
      bottom: auto;
      left: 2.12rem;
      width: auto;
      height: 2px;
      background: repeating-linear-gradient(
        to right,
        var(--_step-track) 0 0.42rem,
        transparent 0.42rem 0.68rem
      );
      transform: rotate(0.2deg);
    }

    :host([data-orientation='horizontal'][status='complete']) .connector,
    :host([data-orientation='horizontal'][status='current']) .connector {
      background: var(--_step-track);
    }

    :host([data-orientation='horizontal']) .content {
      padding-bottom: 0;
      border-bottom: 0;
    }

    @media (forced-colors: active) {
      :host {
        --_step-accent: CanvasText;
        --_step-track: CanvasText;
        forced-color-adjust: none;
      }
    }
  `

  declare index: number
  declare setSize: number
  declare status: CadStepStatus
  declare statusLabel: string
  declare title: string
  declare value: string

  constructor() {
    super()
    this.index = 1
    this.setSize = 1
    this.status = 'pending'
    this.statusLabel = ''
    this.title = ''
    this.value = ''
  }

  override render() {
    const marker =
      this.value ||
      (this.status === 'complete'
        ? '✓'
        : this.status === 'warning'
          ? '!'
          : this.status === 'error'
            ? '×'
            : this.index)
    const statusText = this.statusLabel || defaultStatusLabels[this.status]

    return html`
      <div
        aria-current=${this.status === 'current' ? 'step' : nothing}
        aria-posinset=${this.index}
        aria-setsize=${this.setSize}
        class="item"
        part="item"
        role="listitem"
      >
        <span aria-hidden="true" class="connector" part="connector"></span>
        <span aria-hidden="true" class="marker" part="marker">
          <slot name="marker">${marker}</slot>
        </span>
        <div class="content" part="content">
          <span class="state-label">${statusText}</span>
          <div class="heading">
            <div class="title" part="title">
              <slot name="title"><strong>${this.title}</strong></slot>
            </div>
            <div class="status" part="status"><slot name="status"></slot></div>
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
 * @csspart list - Accessible list container.
 */
export class CadSteps extends LitElement {
  static override properties = {
    label: { type: String },
    orientation: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
    }

    .list {
      display: grid;
      gap: 0;
    }

    :host([data-layout='horizontal']) .list {
      grid-auto-columns: minmax(0, 1fr);
      grid-auto-flow: column;
      gap: 1.4rem;
    }
  `

  declare label: string
  declare orientation: CadStepsOrientation

  private resizeObserver?: ResizeObserver

  constructor() {
    super()
    this.label = 'Steps'
    this.orientation = 'vertical'
  }

  override connectedCallback() {
    super.connectedCallback()
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.syncSteps())
      this.resizeObserver.observe(this)
    }
  }

  override disconnectedCallback() {
    this.resizeObserver?.disconnect()
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <div aria-label=${this.label} class="list" part="list" role="list">
        <slot @slotchange=${this.syncSteps}></slot>
      </div>
    `
  }

  private syncSteps = (): void => {
    const steps = Array.from(
      this.querySelectorAll<CadStep>(':scope > cad-step'),
    )
    // One measured layout keeps the list and its separate shadow roots aligned,
    // including browsers that cannot resolve a container query across them.
    const rem =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16
    const minimumWidth =
      Math.max(48, steps.length * 10 + Math.max(0, steps.length - 1) * 1.4) *
      rem
    const layout =
      this.orientation === 'horizontal' &&
      this.getBoundingClientRect().width > minimumWidth
        ? 'horizontal'
        : 'vertical'
    this.dataset.layout = layout
    steps.forEach((step, index) => {
      step.index = index + 1
      step.setSize = steps.length
      step.dataset.orientation = layout
      step.toggleAttribute('data-last-step', index === steps.length - 1)
    })
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('orientation')) this.syncSteps()
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('cad-step')) {
    customElements.define('cad-step', CadStep)
  }
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
