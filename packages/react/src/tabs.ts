import {
  CadTabs as CadTabsElement,
  CadTabsList as CadTabsListElement,
  CadTabTrigger as CadTabTriggerElement,
  CadTabContent as CadTabContentElement,
  type CadTabChangeEvent,
} from '@caderno-ui/elements/tabs'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadTabs = createComponent({
  displayName: 'CadTabs',
  elementClass: CadTabsElement,
  events: {
    onTabChange: 'cad-tab-change' as EventName<CadTabChangeEvent>,
  },
  react: React,
  tagName: 'cad-tabs',
})

export const CadTabsList = createComponent({
  displayName: 'CadTabsList',
  elementClass: CadTabsListElement,
  react: React,
  tagName: 'cad-tabs-list',
})

export const CadTabTrigger = createComponent({
  displayName: 'CadTabTrigger',
  elementClass: CadTabTriggerElement,
  react: React,
  tagName: 'cad-tab-trigger',
})

export const CadTabContent = createComponent({
  displayName: 'CadTabContent',
  elementClass: CadTabContentElement,
  react: React,
  tagName: 'cad-tab-content',
})

export type {
  CadTabChangeDetail,
  CadTabChangeEvent,
  CadTabTone,
} from '@caderno-ui/elements/tabs'
