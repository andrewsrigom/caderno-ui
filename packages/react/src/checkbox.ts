import { CadCheckbox as CadCheckboxElement } from '@caderno-ui/elements/checkbox'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadCheckbox = createComponent({
  displayName: 'CadCheckbox',
  elementClass: CadCheckboxElement,
  react: React,
  tagName: 'cad-checkbox',
})

export type { CadCheckboxTone } from '@caderno-ui/elements/checkbox'
