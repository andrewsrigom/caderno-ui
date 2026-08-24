import {
  CadModal as CadModalElement,
  type CadModalCloseEvent,
  type CadModalOpenEvent,
} from '@caderno-ui/elements/modal'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadModal = createComponent({
  displayName: 'CadModal',
  elementClass: CadModalElement,
  events: {
    onModalClose: 'cad-modal-close' as EventName<CadModalCloseEvent>,
    onModalOpen: 'cad-modal-open' as EventName<CadModalOpenEvent>,
  },
  react: React,
  tagName: 'cad-modal',
})

export type {
  CadModalCloseDetail,
  CadModalCloseEvent,
  CadModalOpenEvent,
  CadModalSize,
} from '@caderno-ui/elements/modal'
