import {
  CadAlert as CadAlertElement,
  type CadDismissEvent,
} from '@caderno-ui/elements/alert'
import {
  CadBookmark as CadBookmarkElement,
  type CadBookmarkChangeEvent,
} from '@caderno-ui/elements/bookmark'
import { CadIcon as CadIconElement } from '@caderno-ui/elements/icon'
import {
  CadTab as CadTabElement,
  CadTabs as CadTabsElement,
  type CadTabChangeEvent,
} from '@caderno-ui/elements/tabs'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadAlert = createComponent({
  displayName: 'CadAlert',
  elementClass: CadAlertElement,
  events: {
    onDismiss: 'cad-dismiss' as EventName<CadDismissEvent>,
  },
  react: React,
  tagName: 'cad-alert',
})

export const CadBookmark = createComponent({
  displayName: 'CadBookmark',
  elementClass: CadBookmarkElement,
  events: {
    onBookmarkChange:
      'cad-bookmark-change' as EventName<CadBookmarkChangeEvent>,
  },
  react: React,
  tagName: 'cad-bookmark',
})

export const CadIcon = createComponent({
  displayName: 'CadIcon',
  elementClass: CadIconElement,
  react: React,
  tagName: 'cad-icon',
})

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
  CadAlertVariant,
  CadBookmarkChangeDetail,
  CadBookmarkChangeEvent,
  CadDismissDetail,
  CadDismissEvent,
  CadTabChangeDetail,
  CadTabChangeEvent,
  CadTabTone,
} from '@caderno-ui/elements'
