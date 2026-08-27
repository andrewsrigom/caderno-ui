'use client'

import { CadCheckbox as CadCheckboxElement } from '@caderno-ui/elements/checkbox'
import { createComponent, type EventName } from '@lit/react'
import React from 'react'

export const CadCheckbox = createComponent({
  displayName: 'CadCheckbox',
  elementClass: CadCheckboxElement,
  events: {
    onInput: 'input' as EventName<
      Event & { currentTarget: CadCheckboxElement; target: CadCheckboxElement }
    >,
    onChange: 'change' as EventName<
      Event & { currentTarget: CadCheckboxElement; target: CadCheckboxElement }
    >,
  },
  react: React,
  tagName: 'cad-checkbox',
})

export type { CadCheckboxTone } from '@caderno-ui/elements/checkbox'
