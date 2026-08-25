import { CadEmptyState as CadEmptyStateElement } from '@caderno-ui/elements/empty-state'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadEmptyState = createComponent({
  displayName: 'CadEmptyState',
  elementClass: CadEmptyStateElement,
  react: React,
  tagName: 'cad-empty-state',
})

export type { CadEmptyStateVariant } from '@caderno-ui/elements/empty-state'
