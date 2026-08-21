import {
  CadTab as CadTabElement,
  CadTabs as CadTabsElement,
  type CadTabChangeEvent,
} from '@caderno-ui/elements/tabs'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadTab = createComponent({
  displayName: 'CadTab',
  elementClass: CadTabElement,
  react: React,
  tagName: 'cad-tab',
})

export const CadTabs = createComponent({
  displayName: 'CadTabs',
  elementClass: CadTabsElement,
  events: {
    onTabChange: 'cad-tab-change' as EventName<CadTabChangeEvent>,
  },
  react: React,
  tagName: 'cad-tabs',
})

export type {
  CadTabChangeDetail,
  CadTabChangeEvent,
  CadTabTone,
} from '@caderno-ui/elements/tabs'
