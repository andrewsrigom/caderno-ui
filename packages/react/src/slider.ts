'use client'

import {
  CadSlider as CadSliderElement,
  type CadSliderInputEvent,
  type CadSliderChangeEvent,
} from '@caderno-ui/elements/slider'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadSlider = createComponent({
  displayName: 'CadSlider',
  elementClass: CadSliderElement,
  events: {
    onInput: 'input' as EventName<
      Event & { currentTarget: CadSliderElement; target: CadSliderElement }
    >,
    onChange: 'change' as EventName<
      Event & { currentTarget: CadSliderElement; target: CadSliderElement }
    >,
    onSliderInput: 'cad-slider-input' as EventName<CadSliderInputEvent>,
    onSliderChange: 'cad-slider-change' as EventName<CadSliderChangeEvent>,
  },
  react: React,
  tagName: 'cad-slider',
})

export type {
  CadSliderChangeDetail,
  CadSliderChangeEvent,
  CadSliderInputEvent,
  CadSliderThumb,
  CadSliderTone,
} from '@caderno-ui/elements/slider'
