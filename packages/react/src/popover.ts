import {
  CadPopover as CadPopoverElement,
  type CadPopoverCloseEvent,
  type CadPopoverOpenEvent,
} from '@caderno-ui/elements/popover'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadPopover = createComponent({
  displayName: 'CadPopover',
  elementClass: CadPopoverElement,
  events: {
    onPopoverClose: 'cad-popover-close' as EventName<CadPopoverCloseEvent>,
    onPopoverOpen: 'cad-popover-open' as EventName<CadPopoverOpenEvent>,
  },
  react: React,
  tagName: 'cad-popover',
})

export type {
  CadPopoverCloseDetail,
  CadPopoverCloseEvent,
  CadPopoverCloseReason,
  CadPopoverOpenDetail,
  CadPopoverOpenEvent,
  CadPopoverPlacement,
  CadPopoverSize,
} from '@caderno-ui/elements/popover'
