'use client'

import {
  CadAccordion as CadAccordionElement,
  CadAccordionItem as CadAccordionItemElement,
  type CadAccordionToggleEvent,
} from '@caderno-ui/elements/accordion'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadAccordion = createComponent({
  displayName: 'CadAccordion',
  elementClass: CadAccordionElement,
  react: React,
  tagName: 'cad-accordion',
})

export const CadAccordionItem = createComponent({
  displayName: 'CadAccordionItem',
  elementClass: CadAccordionItemElement,
  events: {
    onAccordionToggle:
      'cad-accordion-toggle' as EventName<CadAccordionToggleEvent>,
  },
  react: React,
  tagName: 'cad-accordion-item',
})

export type {
  CadAccordionAnimation,
  CadAccordionMode,
  CadAccordionToggleDetail,
  CadAccordionToggleEvent,
  CadAccordionTone,
} from '@caderno-ui/elements/accordion'
