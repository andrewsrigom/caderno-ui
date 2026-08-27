'use client'

import { CadSwitch as CadSwitchElement } from '@caderno-ui/elements/switch'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadSwitch = createComponent({
  displayName: 'CadSwitch',
  elementClass: CadSwitchElement,
  events: {
    onInput: 'input' as EventName<
      Event & { currentTarget: CadSwitchElement; target: CadSwitchElement }
    >,
    onChange: 'change' as EventName<
      Event & { currentTarget: CadSwitchElement; target: CadSwitchElement }
    >,
  },
  react: React,
  tagName: 'cad-switch',
})

export type { CadSwitchSize } from '@caderno-ui/elements/switch'
