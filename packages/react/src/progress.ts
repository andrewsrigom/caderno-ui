import { CadProgress as CadProgressElement } from '@caderno-ui/elements/progress'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadProgress = createComponent({
  displayName: 'CadProgress',
  elementClass: CadProgressElement,
  react: React,
  tagName: 'cad-progress',
})

export type {
  CadProgressSize,
  CadProgressTone,
} from '@caderno-ui/elements/progress'
