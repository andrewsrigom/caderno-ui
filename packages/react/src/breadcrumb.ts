import {
  CadBreadcrumb as CadBreadcrumbElement,
  CadBreadcrumbItem as CadBreadcrumbItemElement,
} from '@caderno-ui/elements/breadcrumb'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadBreadcrumb = createComponent({
  displayName: 'CadBreadcrumb',
  elementClass: CadBreadcrumbElement,
  react: React,
  tagName: 'cad-breadcrumb',
})

export const CadBreadcrumbItem = createComponent({
  displayName: 'CadBreadcrumbItem',
  elementClass: CadBreadcrumbItemElement,
  react: React,
  tagName: 'cad-breadcrumb-item',
})
