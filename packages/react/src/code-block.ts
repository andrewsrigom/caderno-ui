import { CadCodeBlock as CadCodeBlockElement } from '@caderno-ui/elements/code-block'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadCodeBlock = createComponent({
  displayName: 'CadCodeBlock',
  elementClass: CadCodeBlockElement,
  react: React,
  tagName: 'cad-code-block',
})

export type { CadCodeBlockTone } from '@caderno-ui/elements/code-block'
