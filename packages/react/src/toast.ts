import {
  CadToast as CadToastElement,
  CadToastHost as CadToastHostElement,
  type CadToastDismissEvent,
} from '@caderno-ui/elements/toast'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadToast = createComponent({
  displayName: 'CadToast',
  elementClass: CadToastElement,
  events: {
    onToastDismiss: 'cad-toast-dismiss' as EventName<CadToastDismissEvent>,
  },
  react: React,
  tagName: 'cad-toast',
})

export const CadToastHost = createComponent({
  displayName: 'CadToastHost',
  elementClass: CadToastHostElement,
  react: React,
  tagName: 'cad-toast-host',
})

export type {
  CadToastAction,
  CadToastCallOptions,
  CadToastDismissDetail,
  CadToastDismissEvent,
  CadToastDismissReason,
  CadToastFunction,
  CadToastId,
  CadToastOptions,
  CadToastPlacement,
  CadToastPromiseMessage,
  CadToastPromiseOptions,
  CadToastVariant,
} from '@caderno-ui/elements/toast'

export { toast } from '@caderno-ui/elements/toast'
