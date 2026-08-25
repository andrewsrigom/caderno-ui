import { CadButton as CadButtonElement } from '@caderno-ui/elements/button'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadButton = createComponent({
  displayName: 'CadButton',
  elementClass: CadButtonElement,
  react: React,
  tagName: 'cad-button',
})

export type {
  CadButtonSize,
  CadButtonTone,
  CadButtonType,
  CadButtonVariant,
} from '@caderno-ui/elements/button'
