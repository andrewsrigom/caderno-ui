'use client'

import {
  CadDrawer as CadDrawerElement,
  type CadDrawerCloseEvent,
  type CadDrawerOpenEvent,
} from '@caderno-ui/elements/drawer'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadDrawer = createComponent({
  displayName: 'CadDrawer',
  elementClass: CadDrawerElement,
  events: {
    onDrawerClose: 'cad-drawer-close' as EventName<CadDrawerCloseEvent>,
    onDrawerOpen: 'cad-drawer-open' as EventName<CadDrawerOpenEvent>,
  },
  react: React,
  tagName: 'cad-drawer',
})

export type {
  CadDrawerCloseDetail,
  CadDrawerCloseEvent,
  CadDrawerCloseReason,
  CadDrawerOpenDetail,
  CadDrawerOpenEvent,
  CadDrawerPlacement,
  CadDrawerSize,
} from '@caderno-ui/elements/drawer'
