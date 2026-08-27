'use client'

import { CadRadio as CadRadioElement } from '@caderno-ui/elements/radio'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadRadio = createComponent({
  displayName: 'CadRadio',
  elementClass: CadRadioElement,
  events: {
    onInput: 'input' as EventName<
      Event & { currentTarget: CadRadioElement; target: CadRadioElement }
    >,
    onChange: 'change' as EventName<
      Event & { currentTarget: CadRadioElement; target: CadRadioElement }
    >,
  },
  react: React,
  tagName: 'cad-radio',
})

export type { CadRadioTone } from '@caderno-ui/elements/radio'
