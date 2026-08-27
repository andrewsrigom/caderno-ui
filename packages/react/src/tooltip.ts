'use client'

import { CadTooltip as CadTooltipElement } from '@caderno-ui/elements/tooltip'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadTooltip = createComponent({
  displayName: 'CadTooltip',
  elementClass: CadTooltipElement,
  react: React,
  tagName: 'cad-tooltip',
})

export type { CadTooltipPosition } from '@caderno-ui/elements/tooltip'
