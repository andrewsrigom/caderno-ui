import { CadHighlight as CadHighlightElement } from '@caderno-ui/elements/highlight'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadHighlight = createComponent({
  displayName: 'CadHighlight',
  elementClass: CadHighlightElement,
  react: React,
  tagName: 'cad-highlight',
})

export type {
  CadHighlightTone,
  CadHighlightVariant,
} from '@caderno-ui/elements/highlight'
