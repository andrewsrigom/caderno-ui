import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

export interface CadScrollRevealOptions {
  delay?: number
  distance?: number | string
  duration?: number
  ease?: string
  from?: CadMotionOrigin
  once?: boolean
  root?: CadMotionRoot
  rotate?: number
  scale?: number
  stagger?: number
  start?: string
  trigger?: Element | string
}

export interface CadScrollRevealHandle extends CadMotionHandle {
  refresh(): void
  revert(): void
}

export function createScrollReveal(
  targets: CadMotionTarget,
  options: CadScrollRevealOptions = {},
): CadScrollRevealHandle {
  gsap.registerPlugin(ScrollTrigger)

  const root = resolveMotionRoot(options.root)
  const elements = resolveMotionTargets(root, targets)
  const trigger = options.trigger
    ? resolveMotionTargets(root, options.trigger)[0]
    : elements[0]
  const context = gsap.context(() => undefined)
  let animation: gsap.core.Tween | null = null

  if (elements.length > 0) {
    context.add(() => {
      if (prefersReducedMotion()) {
        animation = gsap.set(elements, {
          clearProps: 'opacity,transform,visibility',
        })
        return
      }

      const offset = motionOffset(
        options.from ?? 'below',
        options.distance ?? motionDefaults.distance,
      )
      const scrollTriggerTarget = trigger ?? elements[0]!
      animation = gsap.from(elements, {
        immediateRender: false,
        opacity: 0,
        clearProps: 'opacity,transform,visibility',
        delay: options.delay ?? 0,
        duration: options.duration ?? motionDefaults.enterDuration,
        ease: options.ease ?? motionDefaults.enterEase,
        overwrite: 'auto',
        rotate: options.rotate ?? -0.6,
        scale: options.scale ?? 0.985,
        scrollTrigger: {
          invalidateOnRefresh: true,
          once: options.once ?? true,
          start: options.start ?? 'top 82%',
          trigger: scrollTriggerTarget,
        },
        stagger: options.stagger ?? motionDefaults.stagger,
        ...offset,
      })
    })
  }

  const handle = createMotionHandle(animation, () => context.revert())
  return {
    ...handle,
    refresh() {
      ScrollTrigger.refresh()
    },
    revert() {
      context.revert()
    },
  }
}
