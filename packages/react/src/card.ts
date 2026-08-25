import {
  CadCard as CadCardElement,
  CadCardHeader as CadCardHeaderElement,
  CadCardKicker as CadCardKickerElement,
  CadCardTitle as CadCardTitleElement,
  CadCardContent as CadCardContentElement,
  CadCardFooter as CadCardFooterElement,
} from '@caderno-ui/elements/card'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadCard = createComponent({
  displayName: 'CadCard',
  elementClass: CadCardElement,
  react: React,
  tagName: 'cad-card',
})

export const CadCardHeader = createComponent({
  displayName: 'CadCardHeader',
  elementClass: CadCardHeaderElement,
  react: React,
  tagName: 'cad-card-header',
})

export const CadCardKicker = createComponent({
  displayName: 'CadCardKicker',
  elementClass: CadCardKickerElement,
  react: React,
  tagName: 'cad-card-kicker',
})

export const CadCardTitle = createComponent({
  displayName: 'CadCardTitle',
  elementClass: CadCardTitleElement,
  react: React,
  tagName: 'cad-card-title',
})

export const CadCardContent = createComponent({
  displayName: 'CadCardContent',
  elementClass: CadCardContentElement,
  react: React,
  tagName: 'cad-card-content',
})

export const CadCardFooter = createComponent({
  displayName: 'CadCardFooter',
  elementClass: CadCardFooterElement,
  react: React,
  tagName: 'cad-card-footer',
})

export type { CadCardTone, CadCardVariant } from '@caderno-ui/elements/card'
