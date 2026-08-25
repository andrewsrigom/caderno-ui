import { CadSkeleton as CadSkeletonElement } from '@caderno-ui/elements/skeleton'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadSkeleton = createComponent({
  displayName: 'CadSkeleton',
  elementClass: CadSkeletonElement,
  react: React,
  tagName: 'cad-skeleton',
})

export type {
  CadSkeletonAnimation,
  CadSkeletonShape,
} from '@caderno-ui/elements/skeleton'
