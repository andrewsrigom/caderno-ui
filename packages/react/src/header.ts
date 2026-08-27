'use client'

import {
  CadHeader as CadHeaderElement,
  type CadHeaderMenuToggleEvent,
} from '@caderno-ui/elements/header'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadHeader = createComponent({
  displayName: 'CadHeader',
  elementClass: CadHeaderElement,
  events: {
    onHeaderMenuToggle:
      'cad-header-menu-toggle' as EventName<CadHeaderMenuToggleEvent>,
  },
  react: React,
  tagName: 'cad-header',
})

export type {
  CadHeaderMenuToggleDetail,
  CadHeaderMenuToggleEvent,
  CadHeaderVariant,
} from '@caderno-ui/elements/header'
