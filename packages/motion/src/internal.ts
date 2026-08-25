export type CadMotionOrigin = 'above' | 'below' | 'left' | 'none' | 'right'

export type CadMotionRoot = ParentNode

export type CadMotionTarget =
  string | Element | Iterable<Element> | ArrayLike<Element>

export interface CadMotionHandle {
  cancel(): void
  pause(): void
  play(): void
  restart(): void
  reverse(): void
}

interface MotionAnimation {
  pause(): unknown
  play(): unknown
  restart(): unknown
  reverse(): unknown
  revert(): unknown
}

export const motionDefaults = {
  distance: '0.85rem',
  enterDuration: 0.42,
  enterEase: 'power3.out',
  exitDistance: '0.35rem',
  exitDuration: 0.22,
  exitEase: 'power2.in',
  stagger: 0.06,
} as const

export function prefersReducedMotion(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function resolveMotionRoot(
  root: CadMotionRoot | undefined,
): CadMotionRoot | null {
  if (root) return root
  return typeof document === 'undefined' ? null : document
}

export function resolveMotionTargets(
  root: CadMotionRoot | null,
  targets: CadMotionTarget,
): Element[] {
  if (typeof targets === 'string') {
    return root ? [...root.querySelectorAll(targets)] : []
  }

  if (typeof Element !== 'undefined' && targets instanceof Element) {
    return [targets]
  }

  return Array.from(targets as Iterable<Element> | ArrayLike<Element>)
}

const negativeDistance = (distance: number | string): number | string => {
  if (typeof distance === 'number') return -distance
  return `calc(${distance} * -1)`
}

export function motionOffset(
  origin: CadMotionOrigin,
  distance: number | string,
): { x: number | string; y: number | string } {
  switch (origin) {
    case 'above':
      return { x: 0, y: negativeDistance(distance) }
    case 'below':
      return { x: 0, y: distance }
    case 'left':
      return { x: negativeDistance(distance), y: 0 }
    case 'right':
      return { x: distance, y: 0 }
    case 'none':
      return { x: 0, y: 0 }
  }
}

export function createMotionHandle(
  animation: MotionAnimation | null,
  onCancel?: () => void,
): CadMotionHandle {
  return {
    cancel() {
      if (onCancel) {
        onCancel()
        return
      }
      animation?.revert()
    },
    pause() {
      animation?.pause()
    },
    play() {
      animation?.play()
    },
    restart() {
      animation?.restart()
    },
    reverse() {
      animation?.reverse()
    },
  }
}
