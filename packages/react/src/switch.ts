import { CadSwitch as CadSwitchElement } from '@caderno-ui/elements/switch'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadSwitch = createComponent({
  displayName: 'CadSwitch',
  elementClass: CadSwitchElement,
  react: React,
  tagName: 'cad-switch',
})

export type { CadSwitchSize } from '@caderno-ui/elements/switch'
