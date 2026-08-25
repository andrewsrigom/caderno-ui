const cssTimePattern = /^(-?\d*\.?\d+)\s*(ms|s)$/i

export function prefersReducedMotion(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function readMotionTime(
  element: Element,
  property: string,
  fallback: number,
): number {
  if (typeof globalThis.getComputedStyle !== 'function') return fallback

  const value = globalThis
    .getComputedStyle(element)
    .getPropertyValue(property)
    .trim()
  const match = cssTimePattern.exec(value)
  if (!match) return fallback

  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return fallback
  return Math.max(0, match[2]?.toLowerCase() === 's' ? amount * 1000 : amount)
}

export function readMotionEasing(
  element: Element,
  property: string,
  fallback: string,
): string {
  if (typeof globalThis.getComputedStyle !== 'function') return fallback
  return (
    globalThis.getComputedStyle(element).getPropertyValue(property).trim() ||
    fallback
  )
}
