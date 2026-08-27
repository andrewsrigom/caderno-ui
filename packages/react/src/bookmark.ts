'use client'

import {
  CadBookmark as CadBookmarkElement,
  type CadBookmarkChangeEvent,
} from '@caderno-ui/elements/bookmark'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

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

export type {
  CadBookmarkChangeDetail,
  CadBookmarkChangeEvent,
} from '@caderno-ui/elements/bookmark'
