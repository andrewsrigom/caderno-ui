import {
  CadAlert as CadAlertElement,
  type CadDismissEvent,
} from '@caderno-ui/elements/alert'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadAlert = createComponent({
  displayName: 'CadAlert',
  elementClass: CadAlertElement,
  events: {
    onDismiss: 'cad-dismiss' as EventName<CadDismissEvent>,
  },
  react: React,
  tagName: 'cad-alert',
})

export type {
  CadAlertSize,
  CadAlertVariant,
  CadDismissDetail,
  CadDismissEvent,
} from '@caderno-ui/elements/alert'
