let lockedDialogCount = 0
let previousDocumentOverflow = ''

export function lockDocumentScroll(): void {
  if (typeof document === 'undefined') return
  if (lockedDialogCount === 0) {
    previousDocumentOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
  }
  lockedDialogCount += 1
}

export function unlockDocumentScroll(): void {
  if (typeof document === 'undefined' || lockedDialogCount === 0) return
  lockedDialogCount -= 1
  if (lockedDialogCount === 0) {
    document.documentElement.style.overflow = previousDocumentOverflow
  }
}

export function deepActiveElement(): HTMLElement | undefined {
  if (typeof document === 'undefined') return
  let active: Element | null = document.activeElement
  while (active instanceof HTMLElement && active.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement
  }
  return active instanceof HTMLElement ? active : undefined
}

export function focusTargetFromEvent(event: Event): HTMLElement | undefined {
  const path = event.composedPath()
  return (
    path.find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        node.matches(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
    ) ??
    path.find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.slot === 'trigger',
    )
  )
}

export function focusElement(element: HTMLElement): void {
  let target = element
  let nested = target.shadowRoot?.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  while (nested) {
    target = nested
    nested = target.shadowRoot?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
  }
  target.focus({ preventScroll: true })
}

/** Keep Tab within a modal's composed tree, including controls in named slots. */
export function trapDialogFocus(event: KeyboardEvent): void {
  const dialog = event.currentTarget
  if (
    event.key !== 'Tab' ||
    event.defaultPrevented ||
    !(dialog instanceof HTMLDialogElement)
  )
    return
  const focusable: HTMLElement[] = []
  const visit = (node: Element): void => {
    if (node instanceof HTMLSlotElement) {
      const assigned = node.assignedElements({ flatten: true })
      for (const child of assigned.length
        ? assigned
        : Array.from(node.children))
        visit(child)
      return
    }
    if (node instanceof HTMLElement && (node.hidden || node.inert)) return
    if (node instanceof HTMLElement && node.shadowRoot) {
      for (const child of node.shadowRoot.children) visit(child)
      return
    }
    if (
      node instanceof HTMLElement &&
      node.matches(
        'button, a[href], input:not([type="hidden"]), select, textarea, [tabindex]',
      ) &&
      node.tabIndex >= 0 &&
      !node.matches(':disabled') &&
      node.getClientRects().length &&
      getComputedStyle(node).visibility !== 'hidden'
    ) {
      focusable.push(node)
    }
    for (const child of node.children) visit(child)
  }
  for (const child of dialog.children) visit(child)
  const first = focusable[0]
  const last = focusable.at(-1)
  const active = deepActiveElement()
  if (!first || !last) {
    event.preventDefault()
    return
  }
  if (event.shiftKey && (active === first || !focusable.includes(active!))) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
