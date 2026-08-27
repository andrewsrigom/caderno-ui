import { css, html, LitElement, type PropertyValues } from 'lit'

import type {
  CadTabContent,
  CadTabRequestEvent,
  CadTabTrigger,
  CadTabsList,
} from './cad-tab.js'

export type CadTabChangeDetail = {
  previousValue: string
  value: string
}

export type CadTabChangeEvent = CustomEvent<CadTabChangeDetail>

let tabsInstance = 0

/**
 * Coordinates compound tab-list, trigger, and content primitives.
 *
 * @slot - One `cad-tabs-list` and matching `cad-tab-content` children.
 * @fires cad-tab-change - Fired after an interactive value change.
 */
export class CadTabs extends LitElement {
  static override properties = {
    defaultValue: { attribute: 'default-value', type: String },
    value: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }
  `

  declare defaultValue: string
  declare value: string

  private observer?: MutationObserver
  private syncing = false
  private readonly instanceId = `cad-tabs-${++tabsInstance}`

  constructor() {
    super()
    this.defaultValue = ''
    this.value = ''
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('cad-tab-request', this.handleRequest)
    this.observer = new MutationObserver(() => this.sync())
    this.observer.observe(this, {
      attributeFilter: ['disabled', 'label', 'value'],
      attributes: true,
      childList: true,
      subtree: true,
    })
  }

  override disconnectedCallback(): void {
    this.removeEventListener('cad-tab-request', this.handleRequest)
    this.observer?.disconnect()
    super.disconnectedCallback()
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('defaultValue') || changed.has('value')) this.sync()
  }

  override render() {
    return html`<slot @slotchange=${this.sync}></slot>`
  }

  private get list(): CadTabsList | null {
    return this.querySelector(':scope > cad-tabs-list')
  }

  private get triggers(): CadTabTrigger[] {
    return Array.from(
      this.list?.querySelectorAll(':scope > cad-tab-trigger') ?? [],
    )
  }

  private get contents(): CadTabContent[] {
    return Array.from(this.querySelectorAll(':scope > cad-tab-content'))
  }

  private sync = (): void => {
    if (this.syncing) return
    this.syncing = true

    const triggers = this.triggers
    const contents = this.contents
    const triggerValues = triggers
      .map((trigger) => trigger.value)
      .filter(Boolean)
    const contentValues = contents
      .map((content) => content.value)
      .filter(Boolean)
    const invalid =
      !this.list ||
      triggerValues.length !== triggers.length ||
      contentValues.length !== contents.length ||
      new Set(triggerValues).size !== triggerValues.length ||
      new Set(contentValues).size !== contentValues.length ||
      triggerValues.length !== contentValues.length ||
      triggerValues.some((value) => !contentValues.includes(value))

    if (invalid) {
      this.dataset.invalid = 'true'
      triggers.forEach((trigger) => {
        trigger.active = false
      })
      contents.forEach((content) => {
        content.active = true
      })
      this.syncing = false
      return
    }

    delete this.dataset.invalid
    const enabled = triggers.filter((trigger) => !trigger.disabled)
    const requested = this.value || this.defaultValue
    const next =
      enabled.find((trigger) => trigger.value === requested)?.value ??
      enabled[0]?.value ??
      ''

    if (this.value !== next) this.value = next
    triggers.forEach((trigger) => {
      trigger.active = trigger.value === next
      trigger.controls = this.panelId(trigger.value)
      const content = contents.find(
        (candidate) => candidate.value === trigger.value,
      )
      if (content) {
        void trigger.updateComplete.then(() =>
          trigger.setControlledPanel(content),
        )
      }
    })
    contents.forEach((content) => {
      const trigger = triggers.find(
        (candidate) => candidate.value === content.value,
      )
      content.active = content.value === next
      content.label =
        trigger?.label || trigger?.textContent?.trim() || content.value
      content.id = this.panelId(content.value)
      content.role = 'tabpanel'
      content.tabIndex = 0
      content.setAttribute('aria-label', content.label)
    })
    this.syncing = false
  }

  private panelId(value: string): string {
    return `${this.id || this.instanceId}-panel-${value}`
  }

  private handleRequest = (event: CadTabRequestEvent): void => {
    const source = event.target
    if (
      !(source instanceof HTMLElement) ||
      source.tagName !== 'CAD-TAB-TRIGGER'
    ) {
      return
    }
    const triggers = this.triggers.filter((trigger) => !trigger.disabled)
    const currentIndex = triggers.indexOf(source as CadTabTrigger)
    if (currentIndex < 0) return

    const key = event.detail.key
    let target = source as CadTabTrigger
    if (key === 'ArrowRight')
      target = triggers[(currentIndex + 1) % triggers.length]!
    if (key === 'ArrowLeft') {
      target = triggers[(currentIndex - 1 + triggers.length) % triggers.length]!
    }
    if (key === 'Home') target = triggers[0]!
    if (key === 'End') target = triggers.at(-1)!
    this.activate(target.value, target)
  }

  private activate(value: string, focusTarget: CadTabTrigger): void {
    const previousValue = this.value
    this.value = value
    this.sync()
    void this.updateComplete.then(() => focusTarget.focusControl())

    if (previousValue === value) return
    this.dispatchEvent(
      new CustomEvent<CadTabChangeDetail>('cad-tab-change', {
        bubbles: true,
        composed: true,
        detail: { previousValue, value },
      }),
    )
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('cad-tabs')) {
  customElements.define('cad-tabs', CadTabs)
}

declare global {
  interface HTMLElementEventMap {
    'cad-tab-change': CadTabChangeEvent
  }

  interface HTMLElementTagNameMap {
    'cad-tabs': CadTabs
  }
}
