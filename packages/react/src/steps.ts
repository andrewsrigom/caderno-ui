import {
  CadSteps as CadStepsElement,
  CadStep as CadStepElement,
} from '@caderno-ui/elements/steps'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadSteps = createComponent({
  displayName: 'CadSteps',
  elementClass: CadStepsElement,
  react: React,
  tagName: 'cad-steps',
})

export const CadStep = createComponent({
  displayName: 'CadStep',
  elementClass: CadStepElement,
  react: React,
  tagName: 'cad-step',
})

export type {
  CadStepTone,
  CadStepsOrientation,
} from '@caderno-ui/elements/steps'
