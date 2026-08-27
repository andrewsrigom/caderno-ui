import { css, html, LitElement } from 'lit'

import type {
  CadToast,
  CadToastAction,
  CadToastDismissDetail,
  CadToastId,
  CadToastVariant,
} from './cad-toast.js'

export type CadToastPlacement =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right'

export type CadToastOptions = {
  action?: CadToastAction
  description?: string
  dismissible?: boolean
  duration?: number
  heading?: string
  hostId?: string
  id?: CadToastId
  message?: string
  onAutoClose?: (detail: CadToastDismissDetail) => void
  onDismiss?: (detail: CadToastDismissDetail) => void
  placement?: CadToastPlacement
  title?: string
  variant?: CadToastVariant
}

export type CadToastCallOptions = Omit<
  CadToastOptions,
  'heading' | 'message' | 'title' | 'variant'
>

export type CadToastPromiseMessage<T> = string | ((value: T) => string)

export type CadToastPromiseOptions<T, E = unknown> = CadToastCallOptions & {
  error: CadToastPromiseMessage<E>
  finally?: () => Promise<void> | void
  loading: string
  success: CadToastPromiseMessage<T>
  successDescription?: CadToastPromiseMessage<T>
}

export type CadToastFunction = {
  (message: string, options?: CadToastCallOptions): CadToastId
  accent(message: string, options?: CadToastCallOptions): CadToastId
  danger(message: string, options?: CadToastCallOptions): CadToastId
  dismiss(id?: CadToastId, options?: { hostId?: string }): number
  error(message: string, options?: CadToastCallOptions): CadToastId
  getActive(options?: { hostId?: string }): CadToast[]
  info(message: string, options?: CadToastCallOptions): CadToastId
  loading(message: string, options?: CadToastCallOptions): CadToastId
  neutral(message: string, options?: CadToastCallOptions): CadToastId
  promise<T, E = unknown>(
    promise: Promise<T> | (() => Promise<T>),
    options: CadToastPromiseOptions<T, E>,
  ): CadToastId
  success(message: string, options?: CadToastCallOptions): CadToastId
  update(id: CadToastId, options: CadToastOptions): CadToastId
  warning(message: string, options?: CadToastCallOptions): CadToastId
}

let nextToastId = 0

function createToastId(): number {
  nextToastId += 1
  return nextToastId
}

/**
 * A fixed notification region that creates, updates, and stacks `cad-toast` messages.
 *
 * @slot - Declarative `cad-toast` notifications.
 * @csspart base - Live notification region.
 * @cssprop --cad-toast-host-z-index - Notification region stacking level.
 * @cssprop --cad-toast-host-offset - Distance from the viewport edge.
 * @cssprop --cad-toast-host-mobile-offset - Distance from the viewport edge on small screens.
 */
export class CadToastHost extends LitElement {
  static override properties = {
    duration: { type: Number },
    label: { type: String },
    maxVisible: { attribute: 'max-visible', reflect: true, type: Number },
    placement: { reflect: true, type: String },
  }

  static override styles = css`
    :host {
      --_toast-offset: var(--cad-toast-host-offset, 1rem);
      position: fixed;
      z-index: var(--cad-toast-host-z-index, 60);
      top: var(--_toast-offset);
      right: var(--_toast-offset);
      display: block;
      width: min(30rem, calc(100vw - (var(--_toast-offset) * 2)));
      pointer-events: none;
    }

    :host([placement='top-left']) {
      right: auto;
      left: var(--_toast-offset);
    }

    :host([placement='top-center']) {
      right: auto;
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement^='bottom']) {
      top: auto;
      bottom: var(--_toast-offset);
    }

    :host([placement='bottom-left']) {
      right: auto;
      left: var(--_toast-offset);
    }

    :host([placement='bottom-center']) {
      right: auto;
      left: 50%;
      transform: translateX(-50%);
    }

    .base {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    :host([placement^='bottom']) .base {
      flex-direction: column-reverse;
    }

    ::slotted(cad-toast) {
      pointer-events: auto;
    }

    @media (max-width: 36rem) {
      :host,
      :host([placement]) {
        --_toast-offset: var(--cad-toast-host-mobile-offset, 0.75rem);
        right: var(--_toast-offset);
        left: var(--_toast-offset);
        width: auto;
        transform: none;
      }
    }
  `

  declare duration: number
  declare label: string
  declare maxVisible: number
  declare placement: CadToastPlacement

  constructor() {
    super()
    this.duration = 4000
    this.label = 'Notifications'
    this.maxVisible = 3
    this.placement = 'top-right'
    this.addEventListener('cad-toast-dismiss', this.handleToastDismiss)
  }

  get activeToasts(): CadToast[] {
    return Array.from(this.querySelectorAll<CadToast>('cad-toast')).filter(
      (item) => item.open,
    )
  }

  dismiss(id?: CadToastId): number {
    const matches = this.managedToasts.filter(
      (item) =>
        item.open && (id === undefined || String(item.toastId) === String(id)),
    )
    for (const item of matches) item.dismiss('programmatic')
    return matches.length
  }

  show(options: CadToastOptions): CadToast {
    const id = options.id ?? createToastId()
    let item = this.managedToasts.find(
      (candidate) => String(candidate.toastId) === String(id),
    )
    const isNew = item === undefined
    const previousVariant = item?.variant

    if (!item) {
      item = document.createElement('cad-toast')
      item.dataset.cadToastManaged = ''
      item.dataset.toastId = String(id)
      item.toastId = id
      item.dismissible = true
      item.variant = 'info'
    }

    const hasExplicitTitle =
      options.title !== undefined || options.heading !== undefined
    const title =
      options.title ??
      options.heading ??
      (!hasExplicitTitle && options.description === undefined
        ? options.message
        : undefined)
    const description =
      options.description ?? (hasExplicitTitle ? options.message : undefined)

    if (title !== undefined) item.heading = title
    if (description !== undefined) item.description = description
    if (options.variant !== undefined) item.variant = options.variant
    if (options.action !== undefined || isNew) item.action = options.action
    if (options.dismissible !== undefined) {
      item.dismissible = options.dismissible
    }
    if (options.onAutoClose !== undefined || isNew) {
      item.onAutoClose = options.onAutoClose
    }
    if (options.onDismiss !== undefined || isNew) {
      item.onDismiss = options.onDismiss
    }

    if (options.duration !== undefined) {
      item.duration = options.duration
    } else if (isNew || previousVariant === 'loading') {
      item.duration = item.variant === 'loading' ? Infinity : this.duration
    }

    item.open = true
    if (isNew) this.prepend(item)
    this.enforceVisibleLimit()
    return item
  }

  override render() {
    return html`
      <div aria-label=${this.label} class="base" part="base" role="region">
        <slot></slot>
      </div>
    `
  }

  private get managedToasts(): CadToast[] {
    return Array.from(
      this.querySelectorAll<CadToast>('cad-toast[data-cad-toast-managed]'),
    )
  }

  private enforceVisibleLimit(): void {
    if (!Number.isFinite(this.maxVisible) || this.maxVisible <= 0) return
    const visible = this.managedToasts.filter((item) => item.open)
    for (const item of visible.slice(this.maxVisible)) {
      item.dismiss('overflow')
    }
  }

  private readonly handleToastDismiss = (event: Event): void => {
    const item = event.target
    if (!(item instanceof HTMLElement) || item.localName !== 'cad-toast') return
    if (!item.hasAttribute('data-cad-toast-managed')) return
    queueMicrotask(() => item.remove())
  }
}

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('cad-toast-host')
) {
  customElements.define('cad-toast-host', CadToastHost)
}

function allHosts(): CadToastHost[] {
  if (typeof document === 'undefined') return []
  return Array.from(document.querySelectorAll<CadToastHost>('cad-toast-host'))
}

function resolveHost(options: {
  create?: boolean
  hostId?: string
  placement?: CadToastPlacement
}): CadToastHost | undefined {
  const hosts = allHosts()
  if (options.hostId) {
    const exact = hosts.find((host) => host.id === options.hostId)
    if (exact) return exact
  } else if (options.placement) {
    const exact = hosts.find(
      (host) => host.placement === options.placement && !host.id,
    )
    if (exact) return exact
  } else if (hosts[0]) {
    return hosts[0]
  }

  if (options.create === false || typeof document === 'undefined') return
  const host = document.createElement('cad-toast-host')
  if (options.hostId) host.id = options.hostId
  if (options.placement) host.placement = options.placement
  host.dataset.cadToastAuto = ''
  document.body.append(host)
  return host
}

function callToast(
  message: string,
  options: CadToastCallOptions = {},
  variant: CadToastVariant = 'info',
): CadToastId {
  const id = options.id ?? createToastId()
  resolveHost({
    create: true,
    ...(options.hostId === undefined ? {} : { hostId: options.hostId }),
    ...(options.placement === undefined
      ? {}
      : { placement: options.placement }),
  })?.show({
    ...options,
    id,
    title: message,
    variant,
  })
  return id
}

const baseToast = ((message: string, options?: CadToastCallOptions) =>
  callToast(message, options, 'info')) as CadToastFunction

baseToast.accent = (message, options) => callToast(message, options, 'accent')
baseToast.danger = (message, options) => callToast(message, options, 'danger')
baseToast.error = (message, options) => callToast(message, options, 'error')
baseToast.info = (message, options) => callToast(message, options, 'info')
baseToast.loading = (message, options = {}) =>
  callToast(message, { ...options, duration: Infinity }, 'loading')
baseToast.neutral = (message, options) => callToast(message, options, 'neutral')
baseToast.success = (message, options) => callToast(message, options, 'success')
baseToast.warning = (message, options) => callToast(message, options, 'warning')

baseToast.update = (id, options) => {
  const host = resolveHost({
    create: true,
    ...(options.hostId === undefined ? {} : { hostId: options.hostId }),
    ...(options.placement === undefined
      ? {}
      : { placement: options.placement }),
  })
  host?.show({ ...options, id })
  return id
}

baseToast.dismiss = (id, options = {}) => {
  const hosts = options.hostId
    ? allHosts().filter((host) => host.id === options.hostId)
    : allHosts()
  return hosts.reduce((total, host) => total + host.dismiss(id), 0)
}

baseToast.getActive = (options = {}) => {
  const hosts = options.hostId
    ? allHosts().filter((host) => host.id === options.hostId)
    : allHosts()
  return hosts.flatMap((host) => host.activeToasts)
}

baseToast.promise = <T, E = unknown>(
  source: Promise<T> | (() => Promise<T>),
  options: CadToastPromiseOptions<T, E>,
): CadToastId => {
  const {
    error: errorMessage,
    finally: onFinally,
    loading,
    success: successMessage,
    successDescription,
    ...callOptions
  } = options
  const id = baseToast.loading(loading, callOptions)
  let pending: Promise<T>

  try {
    pending = typeof source === 'function' ? source() : source
  } catch (error) {
    const message =
      typeof errorMessage === 'function'
        ? errorMessage(error as E)
        : errorMessage
    baseToast.error(message, { ...callOptions, id })
    void onFinally?.()
    return id
  }

  void pending
    .then(
      (value) => {
        const message =
          typeof successMessage === 'function'
            ? successMessage(value)
            : successMessage
        const description =
          typeof successDescription === 'function'
            ? successDescription(value)
            : successDescription
        baseToast.success(message, {
          ...callOptions,
          ...(description === undefined ? {} : { description }),
          id,
        })
      },
      (error: E) => {
        const message =
          typeof errorMessage === 'function'
            ? errorMessage(error)
            : errorMessage
        baseToast.error(message, { ...callOptions, id })
      },
    )
    .finally(onFinally)

  return id
}

export const toast = baseToast

declare global {
  interface HTMLElementTagNameMap {
    'cad-toast-host': CadToastHost
  }
}
