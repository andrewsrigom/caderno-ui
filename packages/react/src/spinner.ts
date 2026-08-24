import { CadSpinner as CadSpinnerElement } from '@caderno-ui/elements/spinner'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadSpinner = createComponent({
  displayName: 'CadSpinner',
  elementClass: CadSpinnerElement,
  react: React,
  tagName: 'cad-spinner',
})

export type {
  CadSpinnerSize,
  CadSpinnerTone,
} from '@caderno-ui/elements/spinner'
