'use client'

import {
  CadCodeBlock as CadCodeBlockElement,
  type CadCodeCopyEvent,
} from '@caderno-ui/elements/code-block'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadCodeBlock = createComponent({
  displayName: 'CadCodeBlock',
  elementClass: CadCodeBlockElement,
  events: {
    onCodeCopy: 'cad-code-copy' as EventName<CadCodeCopyEvent>,
  },
  react: React,
  tagName: 'cad-code-block',
})

export type {
  CadCodeBlockTone,
  CadCodeCopyDetail,
  CadCodeCopyEvent,
} from '@caderno-ui/elements/code-block'
