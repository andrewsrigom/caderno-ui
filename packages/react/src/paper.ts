import { CadPaper as CadPaperElement } from '@caderno-ui/elements/paper'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadPaper = createComponent({
  displayName: 'CadPaper',
  elementClass: CadPaperElement,
  react: React,
  tagName: 'cad-paper',
})

export type {
  CadPaperElevation,
  CadPaperPattern,
  CadPaperSpacing,
  CadPaperTone,
} from '@caderno-ui/elements/paper'
