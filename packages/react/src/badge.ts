'use client'

import { CadBadge as CadBadgeElement } from '@caderno-ui/elements/badge'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadBadge = createComponent({
  displayName: 'CadBadge',
  elementClass: CadBadgeElement,
  react: React,
  tagName: 'cad-badge',
})

export type { CadBadgeTone, CadBadgeVariant } from '@caderno-ui/elements/badge'
