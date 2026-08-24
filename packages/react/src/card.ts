import { CadCard as CadCardElement } from '@caderno-ui/elements/card'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadCard = createComponent({
  displayName: 'CadCard',
  elementClass: CadCardElement,
  react: React,
  tagName: 'cad-card',
})

export type { CadCardTone, CadCardVariant } from '@caderno-ui/elements/card'
