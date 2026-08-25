import { gsap } from 'gsap'

import {
  createMotionHandle,
  motionDefaults,
  motionOffset,
  prefersReducedMotion,
  resolveMotionRoot,
  resolveMotionTargets,
  type CadMotionHandle,
  type CadMotionOrigin,
  type CadMotionRoot,
  type CadMotionTarget,
} from './internal.js'

export type {
  CadMotionHandle,
  CadMotionOrigin,
  CadMotionRoot,
  CadMotionTarget,
} from './internal.js'

export { motionDefaults, prefersReducedMotion }

export interface CadMotionTiming {
  delay?: number
  duration?: number
  ease?: string
  stagger?: number
}

export interface CadEnterOptions extends CadMotionTiming {
  distance?: number | string
  from?: CadMotionOrigin
  rotate?: number
  scale?: number
}

export interface CadExitOptions extends CadMotionTiming {
  distance?: number | string
  rotate?: number
  scale?: number
  toward?: CadMotionOrigin
}

export interface CadMotionScope {
  readonly reducedMotion: boolean
  enter(targets: CadMotionTarget, options?: CadEnterOptions): CadMotionHandle
  exit(targets: CadMotionTarget, options?: CadExitOptions): CadMotionHandle
  revert(): void
}

export function createMotionScope(root?: CadMotionRoot): CadMotionScope {
  const resolvedRoot = resolveMotionRoot(root)
  const context = gsap.context(() => undefined)

  const run = (
    targets: CadMotionTarget,
    factory: (elements: Element[]) => gsap.core.Tween,
  ): CadMotionHandle => {
    const elements = resolveMotionTargets(resolvedRoot, targets)
    if (elements.length === 0) return createMotionHandle(null)

    let animation: gsap.core.Tween | null = null
    context.add(() => {
      animation = factory(elements)
    })
    return createMotionHandle(animation)
  }

  return {
    get reducedMotion() {
      return prefersReducedMotion()
    },
    enter(targets, options = {}) {
      return run(targets, (elements) => {
        if (prefersReducedMotion()) {
          return gsap.set(elements, {
            clearProps: 'opacity,transform,visibility',
          })
        }

        const offset = motionOffset(
          options.from ?? 'below',
          options.distance ?? motionDefaults.distance,
        )
        return gsap.from(elements, {
          opacity: 0,
          clearProps: 'opacity,transform,visibility',
          delay: options.delay ?? 0,
          duration: options.duration ?? motionDefaults.enterDuration,
          ease: options.ease ?? motionDefaults.enterEase,
          overwrite: 'auto',
          rotate: options.rotate ?? -0.6,
          scale: options.scale ?? 0.985,
          stagger: options.stagger ?? motionDefaults.stagger,
          ...offset,
        })
      })
    },
    exit(targets, options = {}) {
      return run(targets, (elements) => {
        if (prefersReducedMotion()) {
          return gsap.set(elements, { autoAlpha: 0 })
        }

        const offset = motionOffset(
          options.toward ?? 'above',
          options.distance ?? motionDefaults.exitDistance,
        )
        return gsap.to(elements, {
          autoAlpha: 0,
          delay: options.delay ?? 0,
          duration: options.duration ?? motionDefaults.exitDuration,
          ease: options.ease ?? motionDefaults.exitEase,
          overwrite: 'auto',
          rotate: options.rotate ?? 0.35,
          scale: options.scale ?? 0.985,
          stagger: options.stagger ?? motionDefaults.stagger * 0.5,
          ...offset,
        })
      })
    },
    revert() {
      context.revert()
    },
  }
}
