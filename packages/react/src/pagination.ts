import { CadPagination as CadPaginationElement } from '@caderno-ui/elements/pagination'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadPagination = createComponent({
  displayName: 'CadPagination',
  elementClass: CadPaginationElement,
  react: React,
  tagName: 'cad-pagination',
})

export type { CadPaginationVariant } from '@caderno-ui/elements/pagination'
