'use client'

import { CadLink as CadLinkElement } from '@caderno-ui/elements/link'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadLink = createComponent({
  displayName: 'CadLink',
  elementClass: CadLinkElement,
  react: React,
  tagName: 'cad-link',
})

export type {
  CadLinkCurrent,
  CadLinkTone,
  CadLinkVariant,
} from '@caderno-ui/elements/link'
