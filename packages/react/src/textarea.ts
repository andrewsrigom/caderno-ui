'use client'

import { CadTextarea as CadTextareaElement } from '@caderno-ui/elements/textarea'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadTextarea = createComponent({
  displayName: 'CadTextarea',
  elementClass: CadTextareaElement,
  events: {
    onInput: 'input' as EventName<
      Event & { currentTarget: CadTextareaElement; target: CadTextareaElement }
    >,
    onChange: 'change' as EventName<
      Event & { currentTarget: CadTextareaElement; target: CadTextareaElement }
    >,
  },
  react: React,
  tagName: 'cad-textarea',
})

export type {
  CadTextareaResize,
  CadTextareaTone,
} from '@caderno-ui/elements/textarea'
