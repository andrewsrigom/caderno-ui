import { CadTape as CadTapeElement } from '@caderno-ui/elements/tape'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadTape = createComponent({
  displayName: 'CadTape',
  elementClass: CadTapeElement,
  react: React,
  tagName: 'cad-tape',
})

export type { CadTapeSize, CadTapeTone } from '@caderno-ui/elements/tape'
