import { CadAvatar as CadAvatarElement } from '@caderno-ui/elements/avatar'
import { createComponent } from '@lit/react'
import React from 'react'

export const CadAvatar = createComponent({
  displayName: 'CadAvatar',
  elementClass: CadAvatarElement,
  react: React,
  tagName: 'cad-avatar',
})

export type {
  CadAvatarSize,
  CadAvatarStatus,
} from '@caderno-ui/elements/avatar'
