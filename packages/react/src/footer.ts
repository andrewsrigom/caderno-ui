import {
  CadFooter as CadFooterElement,
  CadFooterGroup as CadFooterGroupElement,
  type CadFooterGroupToggleEvent,
} from '@caderno-ui/elements/footer'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadFooter = createComponent({
  displayName: 'CadFooter',
  elementClass: CadFooterElement,
  react: React,
  tagName: 'cad-footer',
})

export const CadFooterGroup = createComponent({
  displayName: 'CadFooterGroup',
  elementClass: CadFooterGroupElement,
  events: {
    onFooterGroupToggle:
      'cad-footer-group-toggle' as EventName<CadFooterGroupToggleEvent>,
  },
  react: React,
  tagName: 'cad-footer-group',
})

export type {
  CadFooterGroupToggleDetail,
  CadFooterGroupToggleEvent,
  CadFooterVariant,
} from '@caderno-ui/elements/footer'
