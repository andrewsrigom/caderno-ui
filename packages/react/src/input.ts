'use client'

import { CadInput as CadInputElement } from '@caderno-ui/elements/input'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadInput = createComponent({
  displayName: 'CadInput',
  elementClass: CadInputElement,
  events: {
    onInput: 'input' as EventName<
      Event & { currentTarget: CadInputElement; target: CadInputElement }
    >,
    onChange: 'change' as EventName<
      Event & { currentTarget: CadInputElement; target: CadInputElement }
    >,
  },
  react: React,
  tagName: 'cad-input',
})

export type {
  CadInputSize,
  CadInputTone,
  CadInputType,
} from '@caderno-ui/elements/input'
