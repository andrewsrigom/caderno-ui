import { CadTextarea as CadTextareaElement } from '@caderno-ui/elements/textarea'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadTextarea = createComponent({
  displayName: 'CadTextarea',
  elementClass: CadTextareaElement,
  react: React,
  tagName: 'cad-textarea',
})

export type {
  CadTextareaResize,
  CadTextareaTone,
} from '@caderno-ui/elements/textarea'
