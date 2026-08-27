'use client'

import {
  CadChart as CadChartElement,
  CadChartItem as CadChartItemElement,
} from '@caderno-ui/elements/chart'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadChart = createComponent({
  displayName: 'CadChart',
  elementClass: CadChartElement,
  react: React,
  tagName: 'cad-chart',
})

export const CadChartItem = createComponent({
  displayName: 'CadChartItem',
  elementClass: CadChartItemElement,
  react: React,
  tagName: 'cad-chart-item',
})

export type {
  CadChartAnimation,
  CadChartFillStyle,
  CadChartType,
} from '@caderno-ui/elements/chart'
