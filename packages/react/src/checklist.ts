import {
  CadChecklist as CadChecklistElement,
  CadChecklistItem as CadChecklistItemElement,
} from '@caderno-ui/elements/checklist'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadChecklist = createComponent({
  displayName: 'CadChecklist',
  elementClass: CadChecklistElement,
  react: React,
  tagName: 'cad-checklist',
})

export const CadChecklistItem = createComponent({
  displayName: 'CadChecklistItem',
  elementClass: CadChecklistItemElement,
  react: React,
  tagName: 'cad-checklist-item',
})

export type {
  CadChecklistItemKind,
  CadChecklistTone,
  CadChecklistVariant,
} from '@caderno-ui/elements/checklist'
