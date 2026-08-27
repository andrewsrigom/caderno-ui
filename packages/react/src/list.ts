import {
  CadList as CadListElement,
  CadListItem as CadListItemElement,
} from '@caderno-ui/elements/list'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadList = createComponent({
  displayName: 'CadList',
  elementClass: CadListElement,
  react: React,
  tagName: 'cad-list',
})

export const CadListItem = createComponent({
  displayName: 'CadListItem',
  elementClass: CadListItemElement,
  react: React,
  tagName: 'cad-list-item',
})

export type { CadListVariant } from '@caderno-ui/elements/list'
