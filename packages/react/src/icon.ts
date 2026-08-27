'use client'

import { CadIcon as CadIconElement } from '@caderno-ui/elements/icon'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadIcon = createComponent({
  displayName: 'CadIcon',
  elementClass: CadIconElement,
  react: React,
  tagName: 'cad-icon',
})
