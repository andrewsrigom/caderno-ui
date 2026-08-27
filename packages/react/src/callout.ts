'use client'

import { CadCallout as CadCalloutElement } from '@caderno-ui/elements/callout'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadCallout = createComponent({
  displayName: 'CadCallout',
  elementClass: CadCalloutElement,
  react: React,
  tagName: 'cad-callout',
})

export type { CadCalloutVariant } from '@caderno-ui/elements/callout'
