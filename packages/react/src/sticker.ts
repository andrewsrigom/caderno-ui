'use client'

import { CadSticker as CadStickerElement } from '@caderno-ui/elements/sticker'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadSticker = createComponent({
  displayName: 'CadSticker',
  elementClass: CadStickerElement,
  react: React,
  tagName: 'cad-sticker',
})

export type {
  CadStickerShape,
  CadStickerSize,
  CadStickerTone,
} from '@caderno-ui/elements/sticker'
