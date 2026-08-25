import { CadBlockquote as CadBlockquoteElement } from '@caderno-ui/elements/blockquote'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadBlockquote = createComponent({
  displayName: 'CadBlockquote',
  elementClass: CadBlockquoteElement,
  react: React,
  tagName: 'cad-blockquote',
})

export type { CadBlockquoteTone } from '@caderno-ui/elements/blockquote'
