import { CadNote as CadNoteElement } from '@caderno-ui/elements/note'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadNote = createComponent({
  displayName: 'CadNote',
  elementClass: CadNoteElement,
  react: React,
  tagName: 'cad-note',
})

export type { CadNoteTone } from '@caderno-ui/elements/note'
