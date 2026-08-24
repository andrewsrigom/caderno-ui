import { CadRadio as CadRadioElement } from '@caderno-ui/elements/radio'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadRadio = createComponent({
  displayName: 'CadRadio',
  elementClass: CadRadioElement,
  react: React,
  tagName: 'cad-radio',
})

export type { CadRadioTone } from '@caderno-ui/elements/radio'
