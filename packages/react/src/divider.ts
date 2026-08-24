import { CadDivider as CadDividerElement } from '@caderno-ui/elements/divider'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadDivider = createComponent({
  displayName: 'CadDivider',
  elementClass: CadDividerElement,
  react: React,
  tagName: 'cad-divider',
})

export type {
  CadDividerDensity,
  CadDividerOrientation,
  CadDividerTone,
  CadDividerVariant,
} from '@caderno-ui/elements/divider'
