import { CadInput as CadInputElement } from '@caderno-ui/elements/input'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadInput = createComponent({
  displayName: 'CadInput',
  elementClass: CadInputElement,
  react: React,
  tagName: 'cad-input',
})

export type {
  CadInputSize,
  CadInputTone,
  CadInputType,
} from '@caderno-ui/elements/input'
