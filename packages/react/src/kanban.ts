import {
  CadKanban as CadKanbanElement,
  CadKanbanColumn as CadKanbanColumnElement,
  CadKanbanCard as CadKanbanCardElement,
} from '@caderno-ui/elements/kanban'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadKanban = createComponent({
  displayName: 'CadKanban',
  elementClass: CadKanbanElement,
  react: React,
  tagName: 'cad-kanban',
})

export const CadKanbanColumn = createComponent({
  displayName: 'CadKanbanColumn',
  elementClass: CadKanbanColumnElement,
  react: React,
  tagName: 'cad-kanban-column',
})

export const CadKanbanCard = createComponent({
  displayName: 'CadKanbanCard',
  elementClass: CadKanbanCardElement,
  react: React,
  tagName: 'cad-kanban-card',
})

export type { CadKanbanCardTone } from '@caderno-ui/elements/kanban'
