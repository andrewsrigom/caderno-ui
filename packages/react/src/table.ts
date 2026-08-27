'use client'

import {
  CadTable as CadTableElement,
  CadTableColumn as CadTableColumnElement,
  CadTableRow as CadTableRowElement,
  CadTableCell as CadTableCellElement,
} from '@caderno-ui/elements/table'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadTable = createComponent({
  displayName: 'CadTable',
  elementClass: CadTableElement,
  react: React,
  tagName: 'cad-table',
})

export const CadTableColumn = createComponent({
  displayName: 'CadTableColumn',
  elementClass: CadTableColumnElement,
  react: React,
  tagName: 'cad-table-column',
})

export const CadTableRow = createComponent({
  displayName: 'CadTableRow',
  elementClass: CadTableRowElement,
  react: React,
  tagName: 'cad-table-row',
})

export const CadTableCell = createComponent({
  displayName: 'CadTableCell',
  elementClass: CadTableCellElement,
  react: React,
  tagName: 'cad-table-cell',
})

export type {
  CadTableColumnFormat,
  CadTableDensity,
  CadTableTypography,
  CadTableVariant,
} from '@caderno-ui/elements/table'
